'use client';
import * as React from 'react';
import { loadCSS } from 'fg-loadcss';
import styles from './MainTop.module.css';
import Image from 'next/image';
import Icon from '@mui/material/Icon';
import { useState } from 'react';

const MainTop: React.FC<{ user_info?: any }> = ({ user_info }) => {

    React.useEffect(() => {
        const node = loadCSS(
          'https://use.fontawesome.com/releases/v5.14.0/css/all.css',
          // Inject before JSS
          document.querySelector('#font-awesome-css') as HTMLElement || document.head.firstChild as HTMLElement,
        );

        return () => {
          node.parentNode!.removeChild(node);
        };

    }, []);

    return (
        <div className={styles.top_container}>
            <div>
                <div className={styles.user_name}>
                    <p>{user_info.nickname}</p>
                </div>
                <div>
                    <Image src={user_info.picture ?? ''} alt="main" width={150} height={150} className={styles.user_icon} priority />
                </div>
            </div>
            <div className={styles.introduction}>
                <p>自己紹介</p>
                <p>自己紹介文が入ります。</p>
            </div>
            <div>
                <a href="/post">
                    <Icon baseClassName="fas" className={`${"fa-plus-circle"} ${styles.create_icon}`} />
                </a>
            </div>
        </div>
    );
};

export default MainTop;
