'use client';
import { useState } from "react";
import styles from "./update.module.css";
import Image from 'next/image';

// TODO: サーバーサイドの処理とクライアントサイドの処理を分けたい

export default function UpdatePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <form action="" method="get" className={styles['form-example']}>
      <div className={styles['form-example']}>
        <label htmlFor="user_id">user id</label>
        <input
          type="text"
          name="user_id"
          id="user_id"
          required
          maxLength={20}
        />
      </div>
      <div className={styles['form-example']}>
        <label htmlFor="bio">bio</label>
        <textarea
          name="bio"
          id="bio"
          rows={4}
          cols={40}>
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
            width={500}
            height={500} style={{ maxWidth: '100%', height: 'auto' }}
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
