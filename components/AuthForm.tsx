// "use client";

// import { useState } from "react";

// type AuthFormProps = {
//   isRegister?: boolean;
//   onSubmit: (data: { name?: string; email: string; password: string }) => void;
// };

// export default function AuthForm({ isRegister = false, onSubmit }: AuthFormProps) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (isRegister && !name.trim()) return alert("Name is required");
//     if (!email.trim() || !password.trim()) return alert("Email and password are required");
//     onSubmit({ name: isRegister ? name : undefined, email, password });
//   }

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
//       {isRegister && (
//         <input
//           type="text"
//           placeholder="Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="border p-2 rounded"
//           required={isRegister}
//         />
//       )}
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         className="border p-2 rounded"
//         required
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         className="border p-2 rounded"
//         required
//       />
//       <button
//         type="submit"
//         className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
//       >
//         {isRegister ? "Register" : "Login"}
//       </button>
//     </form>
//   );
// }
