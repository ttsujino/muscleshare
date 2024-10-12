"use client";
import styles from "./page.module.css";
import PostSpace from "./components/Post";
import { useUser } from "@auth0/nextjs-auth0/client";
import MainTop from "./components/MainTop";
import Loading from "./components/Loading";

export default function Home({ params }: { params: { user_name: string } }) {
  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className={`${styles.loading}`}>
        <Loading />
      </div>
    )
  }

  if (error) {
    return <div>{error.message}</div>; // エラーが発生した場合の表示
  }

  return (
    <main>
      <div className={`${styles.container} ${styles.container}`}>
        <div style={{ minWidth: '1000px', margin: '0 auto' }}>
          <MainTop user_name={ params.user_name } />
          {/* <MainTop user_name={user?.name || undefined} /> */}
          <PostSpace />
        </div>
      </div>
    </main>
  );
}