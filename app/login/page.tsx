"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      return;
    }
    if (data.user) {
      const { data: userData, error: fetchError } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      const role = userData?.role || "user";
      if (role === "admin") router.push("/admin");
      else router.push("/profile");
    }
  }
  async function handleForgotPassword() {
    setError("");
    setMessage("");
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password", // Change this to your deployed URL
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setMessage("Password reset link sent! Check your email.");
    }
  }

  return (
      <section className="max-w-md w-full bg-white p-6 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-amber-500 text-white p-2 rounded hover:bg-amber-500"
          >
            Log In
          </button>
        </form>
        <p
          onClick={handleForgotPassword}
          className="mt-3 text-sm text-blue-600 cursor-pointer hover:underline text-center"
        >
          Forgot your password?
        </p>

        {error && <p className="text-red-600 mt-2">{error}</p>}
        {message && <p className="text-green-600 mt-2">{message}</p>}
      </section>
    
  );
}
