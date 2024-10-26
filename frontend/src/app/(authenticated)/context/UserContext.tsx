'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { getUserByAttribute } from "../api/handle_user_info";

interface loginUserInfo {
    auth_user_id: string;
    app_user_id: string;
    bio: string;
    icon: string;
}

const UserContext = createContext<{
    loginUserInfo: loginUserInfo;
    setLoginUserInfo: React.Dispatch<React.SetStateAction<loginUserInfo>>;
} | undefined>(undefined);

export const MyUserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const { user, error, isLoading } = useUser();

    const [loginUserInfo, setLoginUserInfo] = useState<loginUserInfo>({
        auth_user_id: "",
        app_user_id: "",
        bio: "",
        icon: "",
    });

    const fetchUserInfo = async () => {
        try {
            const data = await getUserByAttribute("nickname", user?.name);
            setLoginUserInfo({
                auth_user_id: data.user_id,
                app_user_id: data.nickname,
                bio: data.user_metadata.bio,
                icon: data.user_metadata.picture ?? data.picture,
            });
        } catch (error) {
            console.error("Failed to fetch user info:", error);
        }
    };

    useEffect(() => {
        if (user && !isLoading && !error) {
            fetchUserInfo();
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ loginUserInfo, setLoginUserInfo }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
}