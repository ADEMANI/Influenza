import { useState } from "react"
import Link from "next/link";
import { useRouter } from "next/router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BrandSignup() {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        password: "",
        username: "",
        role: "brand"
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userInfo.username || !userInfo.name || !userInfo.email || !userInfo.password) {
            toast.error("Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${btoa("junaid:2002")}`,
                },
                body: JSON.stringify(userInfo),
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Account created! Redirecting...");
                localStorage.setItem("user", JSON.stringify({
                    email: data.email,
                    role: data.role,
                    token: data.token,
                }));
                setTimeout(() => router.push("/brand"), 1000);
            } else {
                toast.error(data.error || "Signup failed");
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
                <h1 className="text-3xl font-semibold mt-10">Join as a Brand</h1>
                <div className="w-full">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 w-80 my-10 mx-auto">
                        <input
                            onChange={handleChange}
                            name="username"
                            type="text"
                            value={userInfo.username}
                            required
                            className="border-2 border-gray-300 p-2 rounded-lg"
                            placeholder="Username (e.g. mybrand123)"
                        />
                        <input
                            onChange={handleChange}
                            name="name"
                            type="text"
                            value={userInfo.name}
                            required
                            className="border-2 border-gray-300 p-2 rounded-lg"
                            placeholder="Brand / Full Name"
                        />
                        <input
                            onChange={handleChange}
                            name="email"
                            required
                            type="email"
                            value={userInfo.email}
                            className="border-2 border-gray-300 p-2 rounded-lg"
                            placeholder="Email address"
                        />
                        <input
                            onChange={handleChange}
                            required
                            name="password"
                            type="password"
                            value={userInfo.password}
                            className="border-2 border-gray-300 p-2 rounded-lg"
                            placeholder="Password (min 8 characters)"
                            minLength={8}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                        >
                            {loading ? "Creating account..." : "Sign up"}
                        </button>
                    </form>
                    <p className="text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link href="/login"><span className="text-black cursor-pointer hover:underline">Sign in</span></Link>
                    </p>
                </div>
            </div>
        </>
    );
}
