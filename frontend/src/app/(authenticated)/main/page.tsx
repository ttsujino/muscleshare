"use client";
import styles from "./page.module.css";
import PostSpace from "../../../components/Post";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
  const { user, error, isLoading } = useUser();
  
  return (
    <main>
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <h1>Hello { user?.name }</h1>
          <PostSpace />
        </div>
      </div>
    </main>
  );
}
