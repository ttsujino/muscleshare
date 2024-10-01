import styles from './MainHead.module.css';

const MainHead: React.FC<{ user_name?: string }> = ({ user_name }) => {
    return (
        <div className={styles.top}>
            <h1>Hello {user_name}</h1>
        </div>
    );
};

export default MainHead;