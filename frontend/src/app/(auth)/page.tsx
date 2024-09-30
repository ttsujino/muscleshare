"use client";
import styles from "./page.module.css";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Login() {
    return (
        <main>
            <div className={styles.container}>
                <div>
                    <div>
                        <SignInComponent />
                    </div>
                </div>
            </div>
        </main>
    );
}

function SignInComponent() {
    const { user, error, isLoading } = useUser();
  
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;
  
    if (user) {
        return (
            <div>
                Welcome {user.name}! <a href="/api/auth/logout">Logout</a>
            </div>
        );
    }

    return <a href="/api/auth/login">Login</a>;
}