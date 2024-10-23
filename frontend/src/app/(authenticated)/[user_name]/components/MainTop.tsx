'use client';
import * as React from 'react';
import { loadCSS } from 'fg-loadcss';
import styles from './MainTop.module.css';
import Image from 'next/image';
import Icon from '@mui/material/Icon';
import { useState } from 'react';
import { getUserByAttribute } from '../../api/handle_user_info';

const MainTop: React.FC<{ user_name?: any }> = ({ user_name }) => {
    const [userInfo, setUserInfo] = useState<{ picture?: string; nickname?: string; user_metadata?: { bio?: string; picture?: string } }>({});

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

    React.useEffect(() => {
        const fetchUserInfo = async () => {
            const user = await getUserByAttribute("nickname", user_name);
            setUserInfo(user);
        };
        fetchUserInfo();
    }, []);

    // NOTE: アイコン更新後にキャッシュされた古い画像が表示されないようキャッシュバスターを使用
    const cacheBuster = `?v=${new Date().getTime()}`;

    return (
        <div className={styles.top_container}>
            <div>
                <div className={styles.user_name}>
                    <p>{user_name}</p>
                </div>
                <div>
                    <a href={`/${user_name}/update`}>
                        <Image
                            src={
                                (userInfo?.user_metadata?.picture 
                                ?? userInfo?.picture 
                                ?? '/default_icon.png') + cacheBuster
                            }
                            alt="main"
                            width={150}
                            height={150}
                            className={styles.user_icon}
                            priority
                        />
                    </a>
                </div>
            </div>
            <div className={styles.introduction}>
                <p>{userInfo?.user_metadata?.bio ?? ""}</p>
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
