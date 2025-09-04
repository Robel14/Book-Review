"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

type Book = {
  id: number;
  title: string;
  author: string;
  description: string;
  cover_image: string; 
};

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    cover_image: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData?.session?.user;

      if (!currentUser) {
        router.push("/login");
        return;
      }

      const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (error || !userData || userData.role !== "admin") {
        router.push("/login");
        return;
      }

      setUser(userData);
      setLoading(false);
    }

    fetchUser();
  }, [router]);

  
  useEffect(() => {
    async function fetchBooks() {
      const { data, error } = await supabase.from<Book>("books").select("*");
      if (error) {
        console.error(error);
        return;
      }
      setBooks(data || []);
    }

    fetchBooks();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title || !formData.author) {
      alert("Title and author are required");
      return;
    }

    if (editingBook) {
      const { error } = await supabase
        .from("books")
        .update({ ...formData })
        .eq("id", editingBook.id);

      if (error) {
        alert(error.message);
        return;
      }

      setBooks((prev) =>
        prev.map((b) => (b.id === editingBook.id ? { ...b, ...formData } : b))
      );
      setEditingBook(null);
    } else {
      const { data, error } = await supabase
        .from("books")
        .insert([{ ...formData }])
        .select()
        .single();

      if (error) {
        alert(error.message);
        return;
      }

      setBooks((prev) => [...prev, data]);
    }

    setFormData({ title: "", author: "", description: "", cover_image: "" });
  }

  function handleEdit(book: Book) {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      cover_image: book.cover_image,
    });
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this book?")) return;

    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }

    setBooks((prev) => prev.filter((b) => b.id !== id));
  }

  if (loading) return <p>Loading...</p>;

  return (
    <section className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel - Manage Books</h1>

      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3">
        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          className="border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="cover_image"
          placeholder="Cover Image URL"
          value={formData.cover_image}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {editingBook ? "Update Book" : "Add Book"}
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4">Existing Books</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {books.map((book) => (
          <div key={book.id} className="border p-3 rounded shadow-sm">
            <img
              src={book.cover_image}
              alt={book.title}
              className="h-40 w-full object-cover mb-2 rounded"
            />
            <h3 className="font-bold">{book.title}</h3>
            <p className="italic mb-2">by {book.author}</p>
            <p className="mb-2 text-sm">{book.description}</p>
            <div className="flex gap-2">
              <button
                className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
                onClick={() => handleEdit(book)}
              >
                Edit
              </button>
              <button
                className="bg-red-400 text-white p-1 rounded hover:bg-red-700"
                onClick={() => handleDelete(book.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
