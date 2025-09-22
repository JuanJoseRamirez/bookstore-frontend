'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import { Book, useBooks } from './useBooks';

export interface Prize {
  id?: number;
  name: string;
}
export interface Author {
  id?: number;
  name: string;
  birthDate: string;
  description: string;
  image: string;
  books: Book[];
  prizes: Prize[];
}

const API_URL = 'http://localhost:8080/api/authors';


interface AuthorsContextType {
  authors: Author[];
  loading: boolean;
  error: string | null;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  fetchAuthors: () => Promise<void>;
  createAuthor: (author: Author) => Promise<void>;
  updateAuthor: (id: number, author: Author) => Promise<void>;
  deleteAuthor: (id: number) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  deleteBookAuthor: (authorId: number, bookId: number) => Promise<void>;
}

const AuthorsContext = createContext<AuthorsContextType | undefined>(undefined);

export function AuthorsProvider({ children }: { children: React.ReactNode }) {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('favorites') || '[]');
    }
    return [];
  });

  const { books } = useBooks();

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al cargar autores');
      const data = await res.json();
      setAuthors(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createAuthor = async (author: Author) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(author),
    });
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`Error al crear autor: ${msg}`);
    }
    const newAuthor = await res.json();
    setAuthors(prev => [...prev, newAuthor]);
  };

  const updateAuthor = async (id: number, author: Author) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(author),
    });
    if (!res.ok) throw new Error('Error al actualizar autor');
    const updated = await res.json();
    setAuthors(prev => prev.map(a => (a.id === id ? updated : a)));
  };

  const detachAllRelations = async (author: Author) => {
    for (const book of author.books) {
      await fetch(`http://localhost:8080/api/authors/${author.id}/books/${book.id}`, { method: 'DELETE' });
    }
    for (const prize of author.prizes) {
      await fetch(`http://localhost:8080/api/prizes/${prize.id}/author`, { method: 'DELETE' });
    }
  };

  const deleteAuthor = async (id: number) => {
    await detachAllRelations(authors.find(a => a.id === id)!);
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar autor');
    setAuthors(prev => prev.filter(a => a.id !== id));
    setFavorites(prev => prev.filter(fid => fid !== id));
  };

  const deleteBookAuthor = async (authorId: number, bookId: number) => {
    if (!authorId) return;
    const res = await fetch(`http://localhost:8080/api/authors/${authorId}/books/${bookId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar Book del Autor');
    window.location.reload();
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Seguro que deseas eliminar este autor?')) {
      try {
        await deleteAuthor(id);
      } catch (err) {
        console.error('Error eliminando autor:', err);
        alert('No se pudo eliminar el autor.');
      }
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  return (
    <AuthorsContext.Provider
      value={{
        authors,
        loading,
        error,
        favorites,
        toggleFavorite,
        fetchAuthors,
        createAuthor,
        updateAuthor,
        deleteAuthor,
        handleDelete,
        deleteBookAuthor,
      }}
    >
      {children}
    </AuthorsContext.Provider>
  );
}

export function useAuthors() {
  const ctx = useContext(AuthorsContext);
  if (!ctx) throw new Error('useAuthors debe usarse dentro de <AuthorsProvider>');
  return ctx;
}

