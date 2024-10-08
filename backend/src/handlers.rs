use axum::{
    extract::{Json, Extension, Path, Multipart},
    http::StatusCode,
    response::IntoResponse,
};
use crate::repositories::PostRepository;
use std::sync::Arc;
use uuid::Uuid;
use tokio::io::AsyncWriteExt;
use tokio::fs;

pub async fn create_post<T: PostRepository>(
    Extension(repository): Extension<Arc<T>>,
    Path(user_id): Path<i32>,
    mut multipart: Multipart,
) -> Result<impl IntoResponse, StatusCode> {

    let mut content = String::new();
    let image_id = Uuid::new_v4().to_string();
    // // フォルダ作成
    // fs::create_dir("/imgs").await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    while let Some(field) = multipart.next_field().await.unwrap() {
        let field_name = field.name().unwrap().to_string();
        match field_name.as_str() {
            "content" => {
                content = field.text().await.unwrap();
            }
            "image" => {
                let image = field.bytes().await.unwrap();
                let image_fname = format!("{}.jpg", Uuid::new_v4());
                let mut file = fs::File::create(format!("./imgs/{}", image_fname)).await.unwrap();
                file.write_all(&image).await.unwrap();
            }
            _ => {
                tracing::warn!("Unexpected field: {}", field_name);
            }
        }   
    }

    let post = repository
        .create(user_id, content, Uuid::parse_str(&image_id).unwrap())
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


#[cfg(test)]
mod tests {
    use super::*;
    use sqlx::PgPool;
    use axum::{
        Router,
        routing::get,
        extract::Extension,
    };
    use crate::repositories::PostRepositoryForDb;
    use axum_test::TestServer;

    fn create_app<T: PostRepository>(repository: T) -> Router {
        Router::new()
        .route("/ping", get(|| async { "pong!" }))
        .route("/posts/:user_id", get(get_target_user_posts::<T>))
        .layer(Extension(Arc::new(repository)))
    }

    #[sqlx::test]
    async fn test_create_post(pool: PgPool) {
        let repository = PostRepositoryForDb::new(pool);

        let app = create_app(repository);

        let server = TestServer::new(app).unwrap();

        let response = server.post("/ping")
            .await;
        
        response.assert_status_ok();
        response.assert_text("pong!");
    }
}