import styles from './MainTop.module.css';
import Image from 'next/image';

const MainTop: React.FC<{ user_name?: string }> = ({ user_name }) => {
    return (
        <div className={styles.top}>
            <h1>Hello {user_name}</h1>
            <Image src="/sample/black.png" alt="main" width={150} height={150} style={{ objectFit: 'cover', borderRadius: '50%', width: '200px', height: '200px' }} />
        </div>
    );
};

export default MainTop;