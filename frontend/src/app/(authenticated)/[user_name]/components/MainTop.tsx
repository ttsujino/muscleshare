'use client';
import { loadCSS } from 'fg-loadcss';
import styles from './MainTop.module.css';
import Image from 'next/image';
import Icon from '@mui/material/Icon';
import { isLoginUser } from './IsLoginComponent';
import { useEffect } from 'react';
import { useUserContext } from '../../context/UserContext';

const MainTop: React.FC<{ user_info?: any }> = ({ user_info }) => {

    const { loginUserInfo } = useUserContext();
    const isLoggedInUser = isLoginUser(user_info.user_id, loginUserInfo.auth_user_id);

    useEffect(() => {
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
                    <p>{user_info.nickname}</p>
                </div>
                {isLoggedInUser ? (
                    <div>
                        <a href={`/${user_info.nickname}/update`}>
                            <Image
                                src={
                                    user_info.user_metadata.picture
                                        ? user_info.user_metadata.picture + cacheBuster
                                        : user_info.picture
                                            ? user_info.picture + cacheBuster
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
                ) : (
                    <div>
                        <Image
                            src={
                                user_info.user_metadata.picture
                                    ? user_info.user_metadata.picture + cacheBuster
                                    : user_info.picture
                                        ? user_info.picture + cacheBuster
                                        : '/default_icon.png'
                            }
                            alt="main"
                            width={150}
                            height={150}
                            className={styles.user_icon}
                            priority
                        />
                    </div>
                )}
            </div>
            <div className={styles.introduction}>
                <p style={{ whiteSpace: "pre-line" }}>
                    {user_info.user_metadata.bio ?? ""}
                </p>
            </div>
            {isLoggedInUser && (
                <div>
                    <a href="/post">
                        <Icon baseClassName="fas" className={`${"fa-plus-circle"} ${styles.create_icon}`} />
                    </a>
                </div>
            )}
        </div>
    );
};

export default MainTop;
