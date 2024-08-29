mod repositories;
mod handlers;

use axum::{
    extract::Extension,
    routing::{get, post, delete},
    Router,
};
use repositories::{PostRepository, PostRepositoryForDb};
use tracing_subscriber;
use std::{env, sync::Arc};
use dotenv::dotenv;
use sqlx::postgres::PgPoolOptions;

use handlers::{create_post, get_all_posts, get_target_user_posts, get_post, delete_post};

#[tokio::main]
async fn main() {
    let log_level = env::var("RUST_LOG").unwrap_or("debug".to_string());
    env::set_var("RUST_LOG", log_level);
    tracing_subscriber::fmt::init();
    dotenv().ok();

    let database_url = &env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    tracing::info!(database_url, "Start connect database...");

    let pool = PgPoolOptions::new()
        .connect(database_url)
        .await
        .expect("Failed to connect to Database");
    let repository = PostRepositoryForDb::new(pool);

    let app = create_app(repository);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();

}

fn create_app<T: PostRepository>(repository: T) -> Router {
    Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .route("/posts", get(get_all_posts::<T>))
        .route("/posts/:user_id", get(get_target_user_posts::<T>))
        .route("/post/new/:user_id", post(create_post::<T>))
        .route("/post/:uuid", get(get_post::<T>))
        .route("/post/:uuid/delete", delete(delete_post::<T>))
        .layer(Extension(Arc::new(repository)))
}
