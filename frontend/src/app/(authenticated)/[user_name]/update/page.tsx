'use client';
import { useState } from "react";
import styles from "./update.module.css";
import Image from 'next/image';
import { getUserByAttribute, updateUser } from "../../api/handle_user_info";
import { useEffect } from "react";

// サーバーサイドとクライアントサイドの処理を分けたい

export default function UpdatePage({ params }: { params: { user_name: string } }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>(params.user_name);
  const [bio, setBio] = useState<string>('');
  const [authUserId, setAuthUserId] = useState<string>('');

  // 現在のユーザー情報を取得
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserByAttribute("nickname", userId);
      setAuthUserId(user.user_id);
      if (user) {
        setUserId(user.nickname);
        setBio(user?.user_metadata?.bio ?? '');
        setSelectedImage(user.picture);
      }
    }
    fetchUser();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updateUserInfo = {
      nickname: userId,
      // icon: selectedImage || '/default_icon.png',
      user_metadata: { bio: bio },
    };
    const result = await updateUser(authUserId, updateUserInfo);
    if (result) {
      window.location.href = `/${userId}`;
    } else {
      alert('プロフィールの更新に失敗しました。');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles['form-example']}>
      <div className={styles['form-example']}>
        <label htmlFor="user_id">user id</label>
        <input
          type="text"
          name="user_id"
          id="user_id"
          required
          maxLength={20}
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>
      <div className={styles['form-example']}>
        <label htmlFor="bio">bio</label>
        <textarea
          name="bio"
          id="bio"
          rows={4}
          cols={40}
          maxLength={160}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        >
        </textarea>
      </div>
      <div className={styles['form-example']}>
        <label htmlFor="icon">icon</label>
        <input
          type="file"
          name="icon"
          id="icon"
          onChange={handleImageChange}
        />
        <div style={{ marginTop: '20px' }}>
          <Image
            src={selectedImage || '/default_icon.png'}
            alt="Selected"
            width={200}
            height={200}
            priority
          />
        </div>
      </div>
      <div className={styles['form-example']}>
        <input
          type="submit"
          value="Update Profile!!"
        />
      </div>
    </form>
  );
}
