import { create } from "zustand";
import { books as initialBooks } from "../mock/books";

type Book = {
  id: number;
  title: string;
  author: string;
  description?: string;
  coverImage?: string;
};

type BookState = {
  books: Book[];
  addBook: (book: Book) => void;
  updateBook: (book: Book) => void;
  deleteBook: (id: number) => void;
  setBooks: (books: Book[]) => void;
};

export const useBookStore = create<BookState>((set) => ({
  books: initialBooks, // initialize with existing books
  addBook: (book) => set((state) => ({ books: [...state.books, book] })),
  updateBook: (book) =>
    set((state) => ({
      books: state.books.map((b) => (b.id === book.id ? book : b)),
    })),
  deleteBook: (id) =>
    set((state) => ({ books: state.books.filter((b) => b.id !== id) })),
  setBooks: (books) => set({ books }),
}));