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

pub async fn create_post<T: PostRepository>(
    Extension(repository): Extension<Arc<T>>,
    Path(user_id): Path<i32>,
    mut multipart: Multipart,
) -> Result<impl IntoResponse, StatusCode> {

    let mut content = String::new();
    let image_id = Uuid::new_v4();
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
                let image_fname = format!("{}.jpg", image_id);
                let mut file = fs::File::create(format!("./imgs/{}", image_fname)).await.unwrap();
                file.write_all(&image).await.unwrap();
            }
            _ => {
                tracing::warn!("Unexpected field: {}", param_name);
            }
        }   
    }

    let post = repository
        .create(user_id, content, image_id)
        .await
        .or(Err(StatusCode::NOT_FOUND))?;

    Ok((StatusCode::CREATED, Json(post)))
}

pub async fn get_all_posts<T: PostRepository>(
    Extension(repository): Extension<Arc<T>>,
) -> Result<impl IntoResponse, StatusCode> {

    let posts = repository
        .get_all()
        .await
        .or(Err(StatusCode::NOT_FOUND))?;

    Ok(Json(posts))
}

pub async fn get_target_user_posts<T: PostRepository>(
    Extension(repository): Extension<Arc<T>>,
    Path(user_id): Path<i32>,
) -> Result<impl IntoResponse, StatusCode> {
    let posts = repository
        .get_posts(user_id)
        .await
        .or(Err(StatusCode::NOT_FOUND))?;

    Ok(Json(posts))
}

pub async fn get_post<T: PostRepository>(
    Extension(repository): Extension<Arc<T>>,
    Path(id): Path<i32>,
) -> Result<impl IntoResponse, StatusCode> {
    let post = repository
        .get_post(id)
        .await
        .or(Err(StatusCode::NOT_FOUND))?;

    Ok(Json(post))
}

pub async fn delete_post<T: PostRepository>(
    Extension(repository): Extension<Arc<T>>,
    Path(id): Path<i32>,
) -> Result<impl IntoResponse, StatusCode> {
    let post = repository
        .delete(id)
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

        let response = server.post("/post/new/1")
            .multipart(multipart_form)
            .await;

        response.assert_status(StatusCode::CREATED);

        let post = response.json::<Post>();
        assert_eq!(post.user_id, 1);
        let img_uuid = &post.image_id.to_string();
        assert!(uuid::Uuid::parse_str(img_uuid).is_ok(), "image_id should be a valid UUID");

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
}