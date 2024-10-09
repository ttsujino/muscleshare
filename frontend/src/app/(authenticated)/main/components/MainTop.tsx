import styles from './MainTop.module.css';
import Image from 'next/image';

const MainTop: React.FC<{ user_name?: string }> = ({ user_name }) => {
    return (
        <div className={styles.top_container}>
            <div>
                <div className={styles.user_name}>
                    <p>{user_name}</p>
                </div>
                <div>
                    <Image src="/sample/black.png" alt="main" width={150} height={150} className={styles.icon} />
                </div>
            </div>
            <div className={styles.introduction}>
                <p>自己紹介</p>
                <p>自己紹介文が入ります。</p>
            </div>
        </div>
    );
};

export default MainTop;