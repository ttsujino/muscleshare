//　現時点では使っていないが、ゆくゆくはログイン中のユーザーと表示しているユーザーが一致する場合の処理を記述したい
"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Loading from "./components/Loading";
import styles from "./page.module.css";

export default function ClientSidePost({ userInfo }: { userInfo: { nickname: string } }) {
  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className={`${styles.loading}`}>
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  // ログイン中のユーザーと表示しているユーザーが一致する場合、投稿フォームを表示
  if (user?.name === userInfo.nickname) {
    return <div>投稿フォームを表示</div>;
  }

  return null; // 一致しない場合は何も表示しない
}
