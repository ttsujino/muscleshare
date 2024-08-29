mod repositories;
mod handlers;

use axum::{
    extract::Extension,
    routing::{get, post},
    Router,
};
use repositories::{PostRepository, PostRepositoryForDb};
use tracing_subscriber;
use std::{env, sync::Arc};
use dotenv::dotenv;
use sqlx::postgres::PgPoolOptions;

use handlers::{create_post, get_all_posts};

#[tokio::main]
async fn main() {
    let log_level = env::var("RUST_LOG").unwrap_or("debug".to_string());
    env::set_var("RUST_LOG", log_level);
    tracing_subscriber::fmt::init();
    dotenv().ok();

    let database_url = &env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    tracing::info!(database_url, "Start connect database...");
    // let pool = PgPool::connect(database_url)
    //     .await
    //     .expect("Failed to connect to Database");

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
        .route("/:user_id/post", post(create_post::<T>))
        .route("/all_posts", get(get_all_posts::<T>))
        .layer(Extension(Arc::new(repository)))
}
