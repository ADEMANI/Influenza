import { useEffect } from "react";
import { useRouter } from "next/router";

export default function CreatorIndex() {
  const router = useRouter();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.email) {
      router.replace("/creator/profilesetup");
    } else {
      router.replace("/creator/signup");
    }
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}
