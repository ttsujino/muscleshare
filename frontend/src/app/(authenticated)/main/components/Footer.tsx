"use strict";
import styles from './Footer.module.css'; // CSSモジュールを使用
import React from 'react';

const Footer: React.FC = () => {
  
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>© 2024 Muscleshare. All rights reserved.</p>
        <a href="/api/auth/logout">Logout</a>
      </div>
    </footer>
  );
};

export default Footer;