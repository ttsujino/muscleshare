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
          <div className={styles.menuItem} onClick={() => window.location.assign('/main')}>Home</div>
        </div>
        <div>
          <div
            className={styles.ButtomItem}
            onClick={() => document.querySelector('a[href="/api/auth/logout"]')?.click()}
          >
            <a href="/api/auth/logout">Logout</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
