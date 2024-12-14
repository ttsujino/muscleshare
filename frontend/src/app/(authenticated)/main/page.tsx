'use client';
import { useUserContext } from "../context/UserContext";

export default function MainPage() {
  const { loginUserInfo } = useUserContext();

  if (loginUserInfo?.app_user_id) {
    window.location.assign(`/${loginUserInfo.app_user_id}`);
  }

}
