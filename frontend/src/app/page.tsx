"use client";
import Image from "next/image";
import styles from "./page.module.css";
import PostSpace from "../components/Post";
import { auth, provider } from "../components/firebase";
import { signInWithPopup, User, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";

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
            <SignInButton />
          </div>
          <div>
            <DisplayUserInfo />
          </div>
        </div>
      </div>
    </main>
  );
}

function SignInButton() {
  const signInWithGoogle = () => {
    // filebaseを使ってグーグル認証を行う
    signInWithPopup(auth, provider);
  };
  return (
    <button onClick={signInWithGoogle}>
      <p>Googleでサインイン</p>
    </button>
  )
}

function DisplayUserInfo() {
  const [user, setUser] = useState<null | User>(null);

  onAuthStateChanged(auth, (user) => {
    setUser(user);
  });
  return (
    <div>
      {user && (
        <div>
          <p>{user.displayName}</p>
          
        </div>
      )}
    </div>
  );
}