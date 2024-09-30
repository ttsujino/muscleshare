"use client";
import styles from "./page.module.css";
import PostSpace from "../../../components/Post";

export default function Home() {
  
  return (
    <main>
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <h1>ポストコンテンツ</h1>
          <p>ここに内容を追加します。</p>
          <PostSpace />
        </div>
      </div>
    </main>
  );
}
