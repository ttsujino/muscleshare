'use client';
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";

export default function MainPage() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      window.location.assign(`/${user.nickname}`);
    }
  }, [user]);

  return (
    <div>
    </div>
  );
}
