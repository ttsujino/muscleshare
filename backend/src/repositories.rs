use axum::async_trait;
use serde::{Deserialize, Serialize};

use sqlx::{PgPool, FromRow};
use uuid::Uuid;
use tracing::error;
use tokio::fs;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Post {
    pub id: Uuid,
    pub user_id: String,
    pub content: String,
}

#[derive(Debug, Deserialize)]
pub struct CreatePost {
    // content: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdatePost {
    // content: String,
}

#[async_trait]
pub trait PostRepository: Clone + std::marker::Send + std::marker::Sync + 'static {
    async fn create(&self, image_id: Uuid, user_id: String, content: String) -> anyhow::Result<Post>;
    async fn get_post(&self, image_id: Uuid) -> anyhow::Result<Post>;
    async fn get_user_posts(&self, user_id: String) -> anyhow::Result<Vec<Post>>;
    async fn get_all_posts(&self) -> anyhow::Result<Vec<Post>>;
    async fn delete(&self, image_id: Uuid) -> anyhow::Result<Post>;
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
    async fn create(&self, image_id: Uuid, user_id: String, content: String) -> anyhow::Result<Post> {
        let post = sqlx::query_as::<_, Post>(
            r#"
            INSERT INTO posts (id, user_id, content)
            VALUES ($1::UUID, $2, $3)
            RETURNING id, user_id, content
            "#,
        )
        .bind(image_id)
        .bind(user_id)
        .bind(content)
        .fetch_one(&self.pool)
        .await
        .map_err(|e| {
            error!("Failed to create post: {:?}", e);
            e
        })?;

        Ok(post)
    }

    async fn get_post(&self, image_id: Uuid) -> anyhow::Result<Post> {
        let post = sqlx::query_as::<_, Post>(
            r#"
            SELECT id, user_id, content
            FROM posts
            WHERE id = $1
            "#,
        )
        .bind(image_id)
        .fetch_one(&self.pool)
        .await
        .map_err(|e| {
            error!("Failed to get post: {:?}", e);
            e
        })?;

        Ok(post)
    }

    async fn get_user_posts(&self, user_id: String) -> anyhow::Result<Vec<Post>> {
        let posts = sqlx::query_as::<_, Post>(
            r#"
            SELECT id, user_id, content
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

        Ok(posts)
    }

    async fn get_all_posts(&self) -> anyhow::Result<Vec<Post>> {
        let posts = sqlx::query_as::<_, Post>(
            r#"
            SELECT id, user_id, content
            FROM posts
            "#,
        )
        .fetch_all(&self.pool)
        .await
        .map_err(|e| {
            error!("Failed to get posts: {:?}", e);
            e
        })?;

        Ok(posts)
    }

    async fn delete(&self, image_id: Uuid) -> anyhow::Result<Post> {
        let post = sqlx::query_as::<_, Post>(
            r#"
            DELETE FROM posts
            WHERE id = $1
            RETURNING id, user_id, content
            "#,
        )
        .bind(image_id)
        .fetch_one(&self.pool)
        .await
        .map_err(|e| {
            error!("Failed to delete post: {:?}", e);
            e
        })?;
        
        let file_path = format!("./imgs/{}.jpg", image_id);
        if let Err(e) = fs::remove_file(file_path).await {
            error!("Failed to delete image: {:?}", e);
        }

        Ok(post)
    }
}
