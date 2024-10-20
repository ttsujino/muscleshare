 // Start of Selection
"use client";
import { useState } from "react";
import { createPost } from "../api/handle_post";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function PostPage() {
  const { user, error, isLoading } = useUser();
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert("画像を選択してください");
      return;
    }
    let user_id = user?.sub;
    const response = await createPost(content, image, user_id);

    if (response.ok) {
      // 投稿成功時の処理
      alert('投稿完了');
      window.location.href = '/main';
    } else {
      // 投稿失敗時の処理
      alert("投稿に失敗しました");
    }
  };

  return (
    <div>
      <h1>投稿フォーム</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            内容:
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            画像:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  setImage(e.target.files[0]);
                }
              }}
            />
          </label>
        </div>
        <button type="submit">投稿する</button>
      </form>
    </div>
  );
}
