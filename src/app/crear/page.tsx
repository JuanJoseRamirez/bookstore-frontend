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
  books: z.array(z.any()),
  prizes: z.array(z.any()),
  
});

export default function CrearAutorPage() {
  const { createAuthor } = useAuthors();
  const router = useRouter();

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [books, setBooks] = useState([]);
  const [prizes, setPrizes] = useState([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = authorSchema.safeParse({ name, birthDate, description, image, books, prizes });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

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
        aria-invalid={!!errors.name}
        aria-describedby={errors.name ? "name-error" : undefined}
      />
      {errors.name && <p className="text-red-500">{errors.name}</p>}

      <input
        type="date"
        value={birthDate}
        onChange={e => setBirthDate(e.target.value)}
        className="w-full border p-2 rounded"
        aria-invalid={!!errors.name}
        aria-describedby={errors.name ? "name-error" : undefined}
      />
      {errors.birthDate && <p className="text-red-500">{errors.birthDate}</p>}

      <input
        value={image}
        onChange={e => setImage(e.target.value)}
        placeholder="URL de imagen"
        className="w-full border p-2 rounded"
        aria-invalid={!!errors.name}
        aria-describedby={errors.name ? "name-error" : undefined}
      />
      {errors.image && <p className="text-red-500">{errors.image}</p>}

      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Descripción"
        className="w-full border p-2 rounded"
        aria-invalid={!!errors.name}
        aria-describedby={errors.name ? "name-error" : undefined}
      />
      {errors.description && <p className="text-red-500">{errors.description}</p>}

      <button
        type="submit"
        aria-label="Crear autor"
        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Crear Autor
      </button>
    </form>
  );
}
