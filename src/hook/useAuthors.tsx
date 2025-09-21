'use client';
import { useState, useEffect } from 'react';

export interface Author {
  id?: number;
  name: string;
  birthDate: string;
  description: string;
  image: string;
}

const API_URL = 'http://localhost:8080/api/authors';

export function useAuthors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener todos los autores
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

  // Crear autor
  const createAuthor = async (author: Author) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(author),
    });
    if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Error al crear autor: ${msg}`);
  };
    const newAuthor = await res.json();
    setAuthors(prev => [...prev, newAuthor]);
  };

  // Editar autor
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

  // Eliminar autor
  const deleteAuthor = async (id: number) => {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar autor');
    setAuthors(prev => prev.filter(a => a.id !== id));
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  return {
    authors,
    loading,
    error,
    fetchAuthors,
    createAuthor,
    updateAuthor,
    deleteAuthor,
  };
}
