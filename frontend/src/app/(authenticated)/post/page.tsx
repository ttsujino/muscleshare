 // Start of Selection
"use client";
import { useState } from "react";

export default function PostPage() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    // ここでAPIに投稿データを送信する処理を追加します
    const response = await fetch("http://localhost:3000/post/new/1", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });

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
