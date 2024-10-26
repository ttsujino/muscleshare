import styles from "./page.module.css";
import PostSpace from "./components/Post";
import MainTop from "./components/MainTop";
import { getUserByAttribute } from "../api/handle_user_info";
import { useEffect } from "react";

export default async function Home({ params }: { params: { user_name: string } }) {
  const userInfo = await getUserByAttribute("nickname", params.user_name);

  if (!userInfo) {
    return <div>ユーザーが見つかりませんでした。</div>;
  }

  return (
    <main>
      <div className={`${styles.container}`}>
        <div style={{ minWidth: '1000px', margin: '0 auto' }}>
          <MainTop user_info={userInfo || ''} />
          <PostSpace user_info={userInfo || ''} />
        </div>
      </div>
    </main>
  );
}