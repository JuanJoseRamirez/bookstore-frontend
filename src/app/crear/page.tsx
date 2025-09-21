'use client';
import { useState } from 'react';
import { z } from 'zod';
import { useAuthors } from '@/hook/useAuthors';
import { useRouter } from 'next/navigation';

const authorSchema = z.object({
  name: z.string().min(2, 'Nombre muy corto'),
  birthDate: z.string().min(1, 'Fecha requerida'),
  description: z.string().min(5, 'Descripción mínima de 5 caracteres'),
  image: z.string().url('Debe ser una URL válida'),
});

export default function CrearAutorPage() {
  const { createAuthor } = useAuthors();
  const router = useRouter();

  // estado de cada campo (requisito del enunciado)
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validación con Zod
    const result = authorSchema.safeParse({ name, birthDate, description, image });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Crear autor si la validación pasa
    await createAuthor(result.data);
    router.push('/authors');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Nombre"
        className="w-full border p-2 rounded"
      />
      {errors.name && <p className="text-red-500">{errors.name}</p>}

      <input
        type="date"
        value={birthDate}
        onChange={e => setBirthDate(e.target.value)}
        className="w-full border p-2 rounded"
      />
      {errors.birthDate && <p className="text-red-500">{errors.birthDate}</p>}

      <input
        value={image}
        onChange={e => setImage(e.target.value)}
        placeholder="URL de imagen"
        className="w-full border p-2 rounded"
      />
      {errors.image && <p className="text-red-500">{errors.image}</p>}

      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Descripción"
        className="w-full border p-2 rounded"
      />
      {errors.description && <p className="text-red-500">{errors.description}</p>}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Crear Autor
      </button>
    </form>
  );
}
