import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <h1>左側のコンテンツ</h1>
          <p>ここに左側の内容を追加します。</p>
        </div>
        <div className={styles.rightSide}>
          <h1>右側のコンテンツ</h1>
          <p>ここに右側の内容を追加します。</p>
        </div>
      </div>
    </main>
  );
}
