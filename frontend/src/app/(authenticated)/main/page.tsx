'use client';
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";

export default function MainPage() {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && user) {
      window.location.assign(`/${user.nickname}`);
    }
  }, [user]);

  return (
    <div>
    </div>
  );
}
