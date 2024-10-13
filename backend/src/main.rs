mod repositories;
mod handlers;

use axum::{
    extract::Extension,
    routing::{get, post, delete},
    Router,
};
use repositories::{PostRepository, PostRepositoryForDb};
// use tracing_subscriber;
use std::{env, sync::Arc};
use dotenv::dotenv;
use sqlx::postgres::PgPoolOptions;

use http::Method;
use tower_http::cors::{Any, CorsLayer};

use handlers::{
    create_post,
    get_all_posts,
    get_user_posts,
    get_post,
    delete_post,
    get_image
};

#[tokio::main]
async fn main() {
    let log_level = env::var("RUST_LOG").unwrap_or("debug".to_string());
    env::set_var("RUST_LOG", log_level);
    tracing_subscriber::fmt::init();
    dotenv().ok();

    let database_url = &env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    tracing::info!(database_url, "Start connect database...");

    let cors: CorsLayer = CorsLayer::new()
    // allow `GET` and `POST` when accessing the resource
    .allow_methods([Method::GET, Method::POST, Method::DELETE])
    // allow requests from any origin
    .allow_origin(Any);

    let pool = PgPoolOptions::new()
        .connect(database_url)
        .await
        .expect("Failed to connect to Database");
    let repository = PostRepositoryForDb::new(pool);

    let app = create_app(repository, cors);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();

}

fn create_app<T: PostRepository>(repository: T, cors: CorsLayer) -> Router {
    Router::new()
        .route("/health", get(|| async { "Hello, World!" }))
        .route("/post/new/:user_id", post(create_post::<T>))
        .route("/post/:uuid", get(get_post::<T>))
        .route("/posts/:user_id", get(get_user_posts::<T>))
        .route("/posts", get(get_all_posts::<T>))
        .route("/post/:uuid", delete(delete_post::<T>))
        .route("/image/:uuid", get(get_image))
        .layer(Extension(Arc::new(repository)))
        .layer(cors)
}
