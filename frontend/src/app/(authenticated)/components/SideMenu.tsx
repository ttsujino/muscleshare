// components/SideMenu.js
"use client";

import { useState } from 'react';
import styles from './SideMenu.module.css'; // CSSモジュールを使用

const SideMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <div className={styles.hamburgerIcon} onClick={toggleMenu}>
        {/* ハンバーガーアイコンの代わりに、アイコンフォントや画像を使うことができます */}
        ☰
      </div>
      <div className={`${styles.sideMenu} ${menuOpen ? styles.open : ''}`}>
        <div className={styles.menuItems}>
          <div className={styles.menuItem}>Home</div>
          <div className={styles.menuItem}>Search</div>
          <div className={styles.menuItem}>Notifications</div>
          <div className={styles.menuItem}>Profile</div>
        </div>
        <div>
          <div className={styles.ButtomItem}>
            <a href="/api/auth/logout">Logout</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
