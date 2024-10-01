"use client";
import styles from "./page.module.css";
import PostSpace from "./components/Post";
import { useUser } from "@auth0/nextjs-auth0/client";
import MainTop from "./components/MainTop";

export default function Home() {
  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return <div className={`${styles.loading}`}>Loading...</div>; // ローディング中の表示
  }

  if (error) {
    return <div>{error.message}</div>; // エラーが発生した場合の表示
  }

  return (
    <main>
      <div className={`${styles.container}`}>
        <div>
          <MainTop user_name={user?.name || undefined} />
          <PostSpace />
        </div>
      </div>
    </main>
  );
}