"use client";
import styles from "./page.module.css";
import { useState } from "react";
import { createPost } from "../api/handle_post";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";

export default function PostPage() {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert("画像を選択してください");
      return;
    }
    const user_id = user?.sub;
    const response = await createPost(content, image, user_id);

    if (response.ok) {
      alert("投稿完了");
      window.location.href = "/main";
    } else {
      alert("投稿に失敗しました");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
<div className={styles.container}>
  <h1 className={styles.title}>投稿フォーム</h1>
  <form onSubmit={handleSubmit} className={styles.form}>
    <div className={styles.formGroup}>
      <label className={styles.label}>
        内容:
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className={styles.textarea}
        />
      </label>
    </div>
    <div className={styles.formGroup}>
      <label className={styles.label}>
        画像:
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={styles.input}
        />
      </label>
      {preview && <Image src={preview} alt="プレビュー" className={styles.preview} width={300} height={300} />}
    </div>
    <button type="submit" className={styles.button}>投稿する</button>
  </form>
</div>

  );
}
