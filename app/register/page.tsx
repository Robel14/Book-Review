"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill all fields");
      return;
    }
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (signUpData.user) {
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: signUpData.user.id,
          name,
          email,
          role,
        },
      ]);

      if (insertError) {
        setError(insertError.message);
        return;
      }
      router.push("/profile");
    }
  }

  return (
    
    <section className="w-full max-w-xl mx-auto bg-lime-100 p-6 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center color text-sky-200">Signup</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" >
         
          Name:<input
            type="text"
            placeholder="Enter your Name"
            className="border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
         Email: <input
            type="email"
            placeholder=" Enter your Email"
            className="border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
         Password: <input
            type="password"
            placeholder=" Enter your Password"
            className="border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          who are you? (user or Admin ):<select
            value={role}
            onChange={(e) => setRole(e.target.value as "user" | "admin")}
            className="border p-2 rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="bg-sky-300 text-white p-2 rounded hover:bg-sky-100"
          >
          Signup
          </button>
        </form>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </section>
   
  );
}
