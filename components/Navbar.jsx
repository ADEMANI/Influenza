import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import TextShine from "@/components/TextShine";

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      try {
        const u = localStorage.getItem("user");
        setUser(u ? JSON.parse(u) : null);
      } catch { setUser(null); }
    };
    checkUser();
    router.events.on("routeChangeComplete", checkUser);
    return () => router.events.off("routeChangeComplete", checkUser);
  }, [router.events]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold items-center justify-center gap-x-2 rounded-md">
            <span className="text-xl">🌹</span>
            <span>NOTSOCIAL</span>
          </Link>
          <div className="hidden items-center space-x-4 sm:flex">
            <Link href="/explore" className={buttonVariants({ variant: "ghost", size: "sm" })}>Explore</Link>
            <Link href="/#howitworks" className={buttonVariants({ variant: "ghost", size: "sm" })}>How It Works</Link>
            {user ? (
              <>
                <Link href={user.role === "creator" ? "/creator/profilesetup" : "/brand/profilesetup"}
                  className={buttonVariants({ variant: "ghost", size: "sm" })}>My Profile</Link>
                <Link href="/messages" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                  📬 Messages
                </Link>
                <button onClick={handleLogout} className={buttonVariants({ variant: "ghost", size: "sm" })}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>Login</Link>
                <Link href="/brand/signup" className={buttonVariants({ variant: "ghost", size: "sm" })}><TextShine text={"Join as Brand"} /></Link>
                <Link href="/creator/signup" className={buttonVariants({ variant: "ghost", size: "sm" })}><TextShine text={"Join as Creator"} /></Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};
export default Navbar;
