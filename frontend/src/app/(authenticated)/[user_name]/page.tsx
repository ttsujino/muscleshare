import styles from "./page.module.css";
import PostSpace from "./components/Post";
import MainTop from "./components/MainTop";
import { getUserByUsername } from "../api/handle_user_info";
import ClientSidePost from "./ClientSide";

export default async function Home({ params }: { params: { user_name: string } }) {

  if (!params.user_name) {
    return <div>ユーザーが見つかりませんでした。</div>;
  }

  return (
    <main>
      <div className={`${styles.container}`}>
        <div style={{ minWidth: '1000px', margin: '0 auto' }}>
          <MainTop user_name={params.user_name || ''} />
          {/* <ClientSidePost userInfo={userInfo} /> */}
          <PostSpace />
        </div>
      </div>
    </main>
  );
}