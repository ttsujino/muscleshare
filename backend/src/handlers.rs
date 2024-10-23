use axum::{
    extract::{Json, Extension, Path, Multipart},
    http::StatusCode,
    response::IntoResponse,
};
use crate::repositories::PostRepository;
use std::sync::Arc;
use uuid::Uuid;
use tokio::fs;
use tokio::fs::metadata;
use tokio::io::AsyncWriteExt;
use serde::{Deserialize, Serialize};

pub async fn create_post<T: PostRepository>(
    Extension(repository): Extension<Arc<T>>,
    Path(user_id): Path<String>,
    mut multipart: Multipart,
) -> Result<impl IntoResponse, StatusCode> {

    let mut content = String::new();
    let image_uuid = Uuid::new_v4();
    if metadata("./imgs").await.is_err() {
        fs::create_dir("./imgs").await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    }

    while let Some(field) = multipart.next_field().await.unwrap() {
        let param_name = field.name().unwrap();
        match param_name {
            "content" => {
                content = field.text().await.unwrap();
            }
            "image" => {
                let image = field.bytes().await.unwrap();
                let image_fname = format!("{}.jpg", image_uuid);
                let mut file = fs::File::create(format!("./imgs/{}", image_fname)).await.unwrap();
                file.write_all(&image).await.unwrap();
            }
            _ => {
                tracing::warn!("Unexpected field: {}", param_name);
            }
        }   
    }

    let post = repository
        .create(image_uuid, user_id, content)
        .await
        .or(Err(StatusCode::NOT_FOUND))?;

    Ok((StatusCode::CREATED, Json(post)))
}

pub async fn get_post<T: PostRepository>(
    Extension(repository): Extension<Arc<T>>,
    Path(image_id): Path<String>,
) -> Result<impl IntoResponse, StatusCode> {

    let image_uuid = Uuid::parse_str(&image_id).map_err(|_| StatusCode::BAD_REQUEST)?;
    let post = repository
        .get_post(image_uuid)
        .await
        .or(Err(StatusCode::NOT_FOUND))?;

    Ok(Json(post))
}

pub async fn get_user_posts<T: PostRepository>(
    Extension(repository): Extension<Arc<T>>,
    Path(user_id): Path<String>,
) -> Result<impl IntoResponse, StatusCode> {
    let posts = repository
        .get_user_posts(user_id)
        .await
        .or(Err(StatusCode::NOT_FOUND))?;

    Ok(Json(posts))
}

pub async fn get_all_posts<T: PostRepository>(
    Extension(repository): Extension<Arc<T>>,
) -> Result<impl IntoResponse, StatusCode> {

    let posts = repository
        .get_all_posts()
        .await
        .or(Err(StatusCode::NOT_FOUND))?;

    Ok(Json(posts))
}

pub async fn delete_post<T: PostRepository>(
    Extension(repository): Extension<Arc<T>>,
    Path(image_id): Path<String>,
) -> Result<impl IntoResponse, StatusCode> {
    let post = repository
        .delete(Uuid::parse_str(&image_id).unwrap())
        .await
        .or(Err(StatusCode::NOT_FOUND))?;

    Ok(Json(post))
}

pub async fn get_image(Path(image_id): Path<String>) -> impl IntoResponse {
    let image_path = format!("./imgs/{}.jpg", image_id);
    let image_data = fs::read(image_path).await.expect("Failed to read image");

    (
         [("Content-Type", "image/jpeg")],
         image_data,
    )
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Icon {
    image_path: String,
}

pub async fn post_icon(
    Path(user_id): Path<String>,
    mut multipart: Multipart,
) -> Result<impl IntoResponse, StatusCode> {

    if metadata("./icons").await.is_err() {
        fs::create_dir("./icons").await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    }
    let image_path = format!("./icons/{}.jpg", user_id);

    while let Some(field) = multipart.next_field().await.unwrap() {
        let param_name = field.name().unwrap();
        match param_name {
            "image" => {
                let image = field.bytes().await.unwrap();
                let mut file = fs::File::create(&image_path).await.unwrap();
                file.write_all(&image).await.unwrap();
            }
            _ => {
                tracing::warn!("Unexpected field: {}", param_name);
            }
        }
    }
    let image_path = format!("icon/{}", user_id);
    
    let icon = Icon {image_path};

    Ok((StatusCode::CREATED, Json(icon)))
}

pub async fn get_icon(Path(user_id): Path<String>) -> impl IntoResponse {

    let image_path = format!("./icons/{}.jpg", user_id);
    let image_data = fs::read(image_path.clone()).await.expect("Failed to read image");

    (
         [("Content-Type", "image/jpeg")],
         image_data,
    )
}


#[cfg(test)]
mod tests {
    use super::*;
    use sqlx::PgPool;
    use axum::{
        Router,
        routing::{post, get},
        extract::Extension,
    };
    use crate::repositories::PostRepositoryForDb;
    use axum_test::TestServer;
    use axum_test::multipart::{Part, MultipartForm};
    use crate::repositories::Post;

    fn create_app<T: PostRepository>(repository: T) -> Router {
        Router::new()
        .route("/posts", get(get_all_posts::<T>))
        .route("/post/new/:user_id", post(create_post::<T>))
        .route("/image/:uuid", get(get_image))
        .layer(Extension(Arc::new(repository)))
    }

    async fn setup_test<T: PostRepository>(pool: PgPool) -> TestServer {
        let repository = PostRepositoryForDb::new(pool);
        let app = create_app(repository);
        TestServer::new(app).unwrap()
    }

    use std::fs;

    #[sqlx::test]
    async fn test_create_post(pool: PgPool) {
        let server = setup_test::<PostRepositoryForDb>(pool).await;

        let image_bytes = include_bytes!("./test_data/test.jpg");
        let image_part = Part::bytes(image_bytes.as_slice())
        .file_name("test.jpg")
        .mime_type("image/jpeg");

        let multipart_form = MultipartForm::new()
            .add_text("content", "test")
            .add_part("image", image_part);

        let user_id_uuid = Uuid::new_v4();
        let user_id = user_id_uuid.to_string();
        let response = server.post(&format!("/post/new/{}", user_id))
            .multipart(multipart_form)
            .await;

        response.assert_status(StatusCode::CREATED);

        let post = response.json::<Post>();
        assert_eq!(post.user_id, user_id);
        let img_uuid = &post.id.to_string();

        let file_path = format!("./imgs/{}.jpg", img_uuid);
        assert!(std::path::Path::new(&file_path).exists(), "Image file {} does not exist.", file_path);
        
        if let Err(e) = fs::remove_file(&file_path) {
            tracing::error!("Failed to delete image file {}: {:?}", file_path, e);
        }
        }

    #[sqlx::test]
    async fn test_get_all_posts(pool: PgPool) {
        let server = setup_test::<PostRepositoryForDb>(pool).await;

        let response = server.get("/posts").await;
        response.assert_status_ok();
    }

    #[sqlx::test]
    async fn test_get_image(pool: PgPool) {
        let server = setup_test::<PostRepositoryForDb>(pool).await;

        let image_id = "image-for-test-get-image";
        let response = server.get(&(format!("/image/{}", image_id))).await;
        response.assert_status_ok();
    }

    #[sqlx::test]
    async fn test_post_icon(pool: PgPool) {
        let server = setup_test::<PostRepositoryForDb>(pool).await;

        let image_bytes = include_bytes!("./test_data/test.jpg");
        let image_part = Part::bytes(image_bytes.as_slice())
        .file_name("test.jpg")
        .mime_type("image/jpeg");

        let multipart_form = MultipartForm::new()
            .add_part("image", image_part);

        let user_id = String::from("test_user_id");

        let response = server.post(&format!("/icon/{}", user_id))
            .multipart(multipart_form)
            .await;

        let icon = response.json::<Icon>();
        assert_eq!(icon.image_path, format!("icon/{}", user_id));

        }
}