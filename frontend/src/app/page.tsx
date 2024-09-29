"use client";
import styles from "./page.module.css";
import PostSpace from "../components/Post";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
  
  return (
    <main>
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <h1>左側のコンテンツ</h1>
          <p>ここに左側の内容を追加します。</p>
          <PostSpace />
        </div>
        <div className={styles.rightSide}>
          <h1>右側のコンテンツ</h1>
          <p>ここに右側の内容を追加します。</p>
          <div>
            <SignInComponent />
          </div>
        </div>
      </div>
    </main>
  );
}

function SignInComponent() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <div>
        Welcome {user.name}! <a href="/api/auth/logout">Logout</a>
      </div>
    );
  }

  return <a href="/api/auth/login">Login</a>;
}