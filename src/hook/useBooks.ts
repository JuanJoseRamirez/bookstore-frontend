'use client';
import { useState, useEffect } from 'react';

export interface Book {
  id?: number;
  name: string;
  isbn: string;
  image: string;
  description: string;
}

const API_URL = 'http://localhost:8080/api/books';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener todos los libros
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al cargar libros');
      const data = await res.json();
      setBooks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Crear libro
  const createBook = async (book: Book) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`Error al crear libro: ${msg}`);
    }
    const newBook = await res.json();
    setBooks(prev => [...prev, newBook]);
  };

  // Editar libro
  const updateBook = async (id: number, book: Book) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
    if (!res.ok) throw new Error('Error al actualizar libro');
    const updated = await res.json();
    setBooks(prev => prev.map(b => (b.id === id ? updated : b)));
  };

  // Eliminar libro
  const deleteBook = async (id: number) => {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar libro');
    setBooks(prev => prev.filter(b => b.id !== id));
  };

   const handleDelete = async (id: number) => {
    const book = books.find(b => b.id === Number(id));
    if (confirm('¿Seguro que deseas eliminar este libro?')) {
      try {
        await deleteBook(id);
      } catch (err) {
        console.error('Error eliminando libro:', err);
        alert('No se pudo eliminar el libro.');
      }
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return {
    books,
    loading,
    error,
    fetchBooks,
    createBook,
    updateBook,
    deleteBook,
    handleDelete
  };
}
