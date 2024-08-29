use axum::{
    extract::{Json, Extension, Path},
    http::StatusCode,
    response::IntoResponse,
};
use crate::repositories::{CreatePost, PostRepository};
use std::sync::Arc;

pub async fn create_post<T: PostRepository>(
    Extension(repository): Extension<Arc<T>>,
    Path(user_id): Path<i32>,
    Json(payload): Json<CreatePost>,
) -> Result<impl IntoResponse, StatusCode> {
    let post = repository
        .create(user_id, payload)
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
