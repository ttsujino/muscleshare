"use client";
import styles from "./page.module.css";

export default function Login() {
    return (
        <main>
            <div className={styles.container}>
                <a href="/api/auth/login">Login</a>
            </div>
        </main>
    );
}
