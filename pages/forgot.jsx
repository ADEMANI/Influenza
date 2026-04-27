import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
        {sent ? (
          <>
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-2xl font-bold mb-2">Check your email</h2>
            <p className="text-gray-500 text-sm mb-6">
              If an account exists for <strong>{email}</strong>, you will receive password reset instructions.
            </p>
            <Link href="/login" className="text-blue-500 hover:underline text-sm">Back to Login</Link>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold mb-2">Forgot Password?</h2>
            <p className="text-gray-500 text-sm mb-6">Enter your email and we will send you reset instructions.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
              <button type="submit"
                className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors">
                Send Reset Link
              </button>
            </form>
            <Link href="/login" className="text-gray-400 hover:text-gray-600 text-sm mt-4 inline-block">Back to Login</Link>
          </>
        )}
      </div>
    </div>
  );
}
