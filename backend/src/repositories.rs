use axum::async_trait;
use serde::{Deserialize, Serialize};

use sqlx::{PgPool, FromRow};
use uuid::Uuid;
use tracing::error;

#[derive(Debug, Serialize, FromRow)]
pub struct Post {
    id: i32,
    user_id: i32,
    content: String,
    image_id: Uuid,
}

#[derive(Debug, Deserialize)]
pub struct CreatePost {
    // content: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdatePost {
    // content: String,
}

#[derive(Debug, Serialize, FromRow)]
pub struct PostResponse {
    id: i32,
    user_id: i32,
    content: String,
    image_path: String,
}

pub fn cast_post_to_post_response(post: Post) -> PostResponse {
    PostResponse {
        id: post.id,
        user_id: post.user_id,
        content: post.content,
        image_path: format!("./imgs/{}.jpg", post.image_id),
    }
}

#[async_trait]
pub trait PostRepository: Clone + std::marker::Send + std::marker::Sync + 'static {
    async fn create(&self, user_id: i32, content: String, image_id: Uuid) -> anyhow::Result<Post>;
    async fn get_post(&self, id: i32) -> anyhow::Result<PostResponse>;
    async fn get_posts(&self, user_id: i32) -> anyhow::Result<Vec<PostResponse>>;
    async fn delete(&self, id: i32) -> anyhow::Result<Post>;
    async fn get_all(&self) -> anyhow::Result<Vec<PostResponse>>;
}

#[derive(Debug, Clone)]
pub struct PostRepositoryForDb {
    pool: PgPool,
}

impl PostRepositoryForDb {
    pub fn new(pool: PgPool) -> Self {
        PostRepositoryForDb { pool }
    }
}

#[async_trait]
impl PostRepository for PostRepositoryForDb {
    async fn create(&self, user_id: i32, content: String, image_id: Uuid) -> anyhow::Result<Post> {
        let post = sqlx::query_as::<_, Post>(
            r#"
            INSERT INTO posts (user_id, content, image_id)
            VALUES ($1, $2, $3::UUID)
            RETURNING id, user_id, content, image_id
            "#,
        )
        .bind(user_id)
        .bind(content)
        .bind(image_id)
        .fetch_one(&self.pool)
        .await
        .map_err(|e| {
            error!("Failed to create post: {:?}", e);
            e
        })?;

        Ok(post)
    }

    async fn get_all(&self) -> anyhow::Result<Vec<PostResponse>> {
        let posts = sqlx::query_as::<_, Post>(
            r#"
            SELECT id, user_id, content, image_id
            FROM posts
            "#,
        )
        .fetch_all(&self.pool)
        .await
        .map_err(|e| {
            error!("Failed to get posts: {:?}", e);
            e
        })?;

        let posts_resp = posts.into_iter().map(cast_post_to_post_response).collect();

        Ok(posts_resp)
    }

    async fn get_post(&self, id: i32) -> anyhow::Result<PostResponse> {
        let post = sqlx::query_as::<_, Post>(
            r#"
            SELECT id, user_id, content, image_id
            FROM posts
            WHERE id = $1
            "#,
        )
        .bind(id)
        .fetch_one(&self.pool)
        .await
        .map_err(|e| {
            error!("Failed to get post: {:?}", e);
            e
        })?;

        let post_resp = cast_post_to_post_response(post);

        Ok(post_resp)
    }

    async fn get_posts(&self, user_id: i32) -> anyhow::Result<Vec<PostResponse>> {
        let posts = sqlx::query_as::<_, Post>(
            r#"
            SELECT id, user_id, content, image_id
            FROM posts
            WHERE user_id = $1
            "#,
        )
        .bind(user_id)
        .fetch_all(&self.pool)
        .await
        .map_err(|e| {
            error!("Failed to get posts: {:?}", e);
            e
        })?;

        let posts_resp = posts.into_iter().map(cast_post_to_post_response).collect();

        Ok(posts_resp)
    }

    async fn delete(&self, id: i32) -> anyhow::Result<Post> {
        let post = sqlx::query_as::<_, Post>(
            r#"
            DELETE FROM posts
            WHERE id = $1
            RETURNING id, user_id, content
            "#,
        )
        .bind(id)
        .fetch_one(&self.pool)
        .await
        .map_err(|e| {
            error!("Failed to delete post: {:?}", e);
            e
        })?;

        Ok(post)
    }
}
