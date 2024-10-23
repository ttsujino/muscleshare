'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { getUserByAttribute } from "../api/handle_user_info";

interface UserInfo {
    auth_user_id: string;
    app_user_id: string;
    bio: string;
    icon: string;
}

const UserContext = createContext<{
    userInfo: UserInfo;
    setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
} | undefined>(undefined);

export const MyUserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const { user, error, isLoading } = useUser();

    const [userInfo, setUserInfo] = useState<UserInfo>({
        auth_user_id: "",
        app_user_id: "",
        bio: "",
        icon: "",
    });

    const fetchUserInfo = async () => {
        try {
            const data = await getUserByAttribute("nickname", user?.name);
            setUserInfo({
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
            console.log(userInfo);
        }
    }, [user, isLoading, error]);

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
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