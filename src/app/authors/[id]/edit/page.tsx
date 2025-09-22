'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useAuthors, AuthorsProvider } from '@/hook/useAuthors';

const authorSchema = z.object({
  name: z.string().min(2, 'Nombre muy corto'),
  birthDate: z.string().min(1, 'Fecha requerida'),
  description: z.string().min(5, 'Descripción mínima de 5 caracteres'),
  image: z.string().url('Debe ser una URL válida'),
  books: z.array(z.any()),
  prizes: z.array(z.any()),
});

export default function EditAuthorPage() {
  const { id } = useParams();                 
  const router = useRouter();
  const { authors, updateAuthor } = useAuthors();

  // Buscar el autor en la lista actual
  const author = authors.find(a => a.id === Number(id));

  // Estado de cada campo
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [books, setBooks] = useState([]);
  const [prizes, setPrizes] = useState([]);

  // Precargar datos del autor al montar
  useEffect(() => {
    if (author) {
      setName(author.name);
      setBirthDate(author.birthDate);
      setDescription(author.description);
      setImage(author.image);
    }
  }, [author]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validar con Zod
    const result = authorSchema.safeParse({ name, birthDate, description, image, books, prizes });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    await updateAuthor(Number(id), result.data);
    router.push('/authors'); 
  };

  if (!author) return <p className="text-center mt-10">Autor no encontrado</p>;

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
        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Guardar cambios
      </button>
    </form>
  );
}
