use axum::async_trait;
use serde::{Deserialize, Serialize};

use sqlx::{PgPool, FromRow};

#[derive(Debug, Serialize, FromRow)]
pub struct Post {
    id: i32,
    user_id: i32,
    content: String,
    image_id: String,
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
    async fn create(&self, user_id: i32, content: String, image_id: String) -> anyhow::Result<Post>;
    async fn get_post(&self, id: i32) -> anyhow::Result<Post>;
    async fn get_posts(&self, user_id: i32) -> anyhow::Result<Vec<Post>>;
    async fn delete(&self, id: i32) -> anyhow::Result<Post>;
    async fn get_all(&self) -> anyhow::Result<Vec<Post>>;
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
    async fn create(&self, user_id: i32, content: String, image_id: String) -> anyhow::Result<Post> {
        let post = sqlx::query_as::<_, Post>(
            r#"
            INSERT INTO posts (user_id, content, image_id)
            VALUES ($1, $2, $3)
            RETURNING id, user_id, content, image_id
            "#,
        )
        .bind(user_id)
        .bind(content)
        .bind(image_id)
        .fetch_one(&self.pool)
        .await?;

        Ok(post)
    }

    async fn get_all(&self) -> anyhow::Result<Vec<Post>> {
        let posts = sqlx::query_as::<_, Post>(
            r#"
            SELECT id, user_id, content, image_id
            FROM posts
            "#,
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(posts)
    }

    async fn get_post(&self, id: i32) -> anyhow::Result<Post> {
        let post = sqlx::query_as::<_, Post>(
            r#"
            SELECT id, user_id, content, image_id
            FROM posts
            WHERE id = $1
            "#,
        )
        .bind(id)
        .fetch_one(&self.pool)
        .await?;

        Ok(post)
    }

    async fn get_posts(&self, user_id: i32) -> anyhow::Result<Vec<Post>> {
        let posts = sqlx::query_as::<_, Post>(
            r#"
            SELECT id, user_id, content, image_id
            FROM posts
            WHERE user_id = $1
            "#,
        )
        .bind(user_id)
        .fetch_all(&self.pool)
        .await?;

        Ok(posts)
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
        .await?;

        Ok(post)
    }
}
