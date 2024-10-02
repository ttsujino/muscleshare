import styles from './MainTop.module.css';
import Image from 'next/image';

const MainTop: React.FC<{ user_name?: string }> = ({ user_name }) => {
    return (
        <div className={styles.top}>
            <div className={styles.user_name}>
                <p>{user_name}</p>
            </div>
            <div>
                <Image src="/sample/black.png" alt="main" width={150} height={150} className={styles.icon} />
            </div>
        </div>
    );
};

export default MainTop;