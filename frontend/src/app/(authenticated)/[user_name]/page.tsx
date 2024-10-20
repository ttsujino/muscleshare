import styles from "./page.module.css";
import PostSpace from "./components/Post";
import MainTop from "./components/MainTop";
import { getUserByAttribute } from "../api/handle_user_info";

export default async function Home({ params }: { params: { user_name: string } }) {
  console.log("params: ", params);
  const userInfo = await getUserByAttribute("nickname", params.user_name);
  console.log("userInfo: ", userInfo);

  if (!userInfo) {
    return <div>ユーザーが見つかりませんでした。</div>;
  }

  return (
    <main>
      <div className={`${styles.container}`}>
        <div style={{ minWidth: '1000px', margin: '0 auto' }}>
          <MainTop user_name={userInfo.nickname || ''} />
          <PostSpace />
        </div>
      </div>
    </main>
  );
}