'use client';
import { cache, useState } from "react";
import styles from "./update.module.css";
import Image from 'next/image';
import { getUserByAttribute, updateUser } from "../../api/handle_user_info";
import { useEffect } from "react";
import { postIcon } from "../../api/handle_icon";

// サーバーサイドとクライアントサイドの処理を分けたい

export default function UpdatePage({ params }: { params: { user_name: string } }) {
  const [iconPath, setIconPath] = useState<string>('');
  const [icon, setIcon] = useState<File | null>(null);
  const [userId, setUserId] = useState<string>(params.user_name);
  const [bio, setBio] = useState<string>('');
  const [authUserId, setAuthUserId] = useState<string>('');

  // 現在のユーザー情報を取得
  useEffect(() => {
    const fetchUser = async () => {
      const cacheBuster = `?v=${new Date().getTime()}`;
      const user = await getUserByAttribute("nickname", params.user_name);
      setAuthUserId(user.user_id);
      if (user) {
        setUserId(user.nickname);
        setBio(user?.user_metadata?.bio ?? '');
        setIconPath(user?.user_metadata?.picture + cacheBuster ?? user.picture + cacheBuster);
      }
    }
    fetchUser();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIcon(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (e) => {
        setIconPath(e.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let imagePath = null;

    if (icon) {
      imagePath = await postIcon(authUserId, icon);
    } else {
      imagePath = iconPath;
    }

    const updateUserInfo = {
      nickname: userId,
      user_metadata: {
        bio: bio,
        picture: imagePath,
      },
    };
    const result = await updateUser(authUserId, updateUserInfo);
    if (result) {
      // DBが更新されるのを待つため、1秒待ってからリダイレクト
      await new Promise(resolve => setTimeout(resolve, 1000));
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
            src={iconPath || '/default_icon.png'}
            alt="Selected"
            width={200}
            height={200}
            priority
          />
        </div>
      </div>
      <div
        className={styles['form-example']}
        style={{ cursor: 'pointer' }}
        onClick={() => 
          (document.querySelector('input[type="submit"]') as HTMLInputElement)?.click()
        }
      >
        <input
          type="submit"
          // value="Update Profile!!!"
          style={{ display: 'none' }}
        />
        Update Profile!!
      </div>
    </form>
  );
}
