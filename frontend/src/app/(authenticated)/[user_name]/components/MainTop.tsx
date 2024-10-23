'use client';
import * as React from 'react';
import { loadCSS } from 'fg-loadcss';
import styles from './MainTop.module.css';
import Image from 'next/image';
import Icon from '@mui/material/Icon';
import { useUserContext } from '../../context/UserContext';

const MainTop: React.FC<{ user_name?: any }> = ({ user_name }) => {
    const { userInfo: contextUserInfo } = useUserContext();
    console.log(contextUserInfo);

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
                                contextUserInfo?.icon 
                                ? contextUserInfo.icon + cacheBuster 
                                : '/default_icon.png'
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
                <p>{contextUserInfo.bio ?? ""}</p>
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
