'use client';
import { useUserContext } from "../context/UserContext";
import { useEffect } from "react";

export default function MainPage() {
  const { loginUserInfo } = useUserContext();

  useEffect(() => {
    if (loginUserInfo.app_user_id) {
      window.location.assign(`/${loginUserInfo.app_user_id}`);
    }
  }, [loginUserInfo]);

  return (
    <div>
    </div>
  );
}
