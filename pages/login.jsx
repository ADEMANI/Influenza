import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa("junaid:2002")}`,
        },
        body: JSON.stringify(userInfo),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Login successful!");
        localStorage.setItem("user", JSON.stringify({
          email: data.email,
          role: data.role,
          token: data.token,
        }));
        setTimeout(() => {
          router.push("/explore");
        }, 800);
      } else {
        toast.error(data.error || "Invalid credentials");
      }
    } catch {
      toast.error("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} theme="light" />
      <div className="h-max text-center py-20">
        <h1 className="text-3xl font-semibold mt-20">Login to your account</h1>
        <div className="w-full">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 w-80 my-10 mx-auto">
            <Input
              onChange={handleChange}
              name="email"
              required
              type="email"
              value={userInfo.email}
              placeholder="Email address"
            />
            <Input
              onChange={handleChange}
              name="password"
              type="password"
              required
              value={userInfo.password}
              placeholder="Password"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/forgot" className="text-sm text-gray-400 hover:text-gray-600 mt-1 inline-block">Forgot password?</Link>
            <Link href="/creator/signup">
              <span className="text-blue-500 hover:underline">Sign up</span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
