'use client';

import { useAuthors } from '@/hook/useAuthors'; 
import { Author} from '@/hook/useAuthors';
import { useRouter } from 'next/navigation';

export default function AuthorsList() {

  const { authors, loading, error, deleteAuthor, updateAuthor} = useAuthors();
  const router = useRouter();

   const handleDelete = async (id: number) => {
    const author = authors.find(a => a.id === Number(id));
    if (confirm('¿Seguro que deseas eliminar este autor?')) {
      try {
        await deleteAuthor(id);
      } catch (err) {
        console.error('Error eliminando autor:', err);
        alert('No se pudo eliminar el autor.');
      }
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando autores...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="flex justify-center mt-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl">
        {authors.map((author: Author) => (
          <div
            key={author.id}
            className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center"
          >
            <h2 className="text-lg font-black text-center text-black">
              {author.name}
            </h2>
            <h1 className="text-lg font-semibold text-center mb-2 text-black">
              {author.birthDate}
            </h1>
            <img
              src={author.image}
              alt={author.name}
              className="w-full h-64 object-cover rounded-xl mb-2"
            />
            <h2 className="text-sm font-semibold text-center mb-2 text-black">
              {author.description}
            </h2>
            <button
            onClick={() => router.push(`/authors/${author.id}/edit`)}
            className="mt-2 px-3 py-1 bg-gray-800 text-white rounded mb-2 hover:bg-green-700"
          >
            Editar
          </button>
          <button
              onClick={() => handleDelete(author.id!)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

