'use client';
import { useAuthors} from '@/hook/useAuthors'; 
import { useRouter } from 'next/navigation';

export default function AuthorsList({ onlyFavorites = false }: { onlyFavorites?: boolean }) {
  const { authors, loading, error, handleDelete, favorites, toggleFavorite } = useAuthors();
  const list = onlyFavorites ? authors.filter(a => favorites.includes(a.id!)) : authors;
  const router = useRouter();

  if (loading) return <p className="text-center mt-10">Cargando autores...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="flex justify-center mt-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl">
        {list.map((author) => {
          const isFav = favorites.includes(author.id!);
          return (
            <div
              key={author.id}
              className={`bg-white rounded-2xl shadow-md p-4 flex flex-col items-center border-2 ${isFav ? 'border-yellow-400' : 'border-transparent'}`}
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
                onClick={() => toggleFavorite(author.id!)}
                aria-label={isFav ? 'Quitar de favoritos' : 'Marcar como favorito'}
                aria-pressed={isFav}
                className={`mt-2 px-3 py-1 rounded mb-2 ${isFav ? 'bg-yellow-400 text-black' : 'bg-gray-300 text-black'} hover:bg-yellow-500`}
              >
                {isFav ? 'Favorito' : 'Marcar Favorito'}
              </button>
              <button
                onClick={() => router.push(`/authors/${author.id}/edit`)}
                aria-label={`Editar autor ${author.name}`}
                className="mt-2 px-3 py-1 bg-gray-800 text-white rounded mb-2 hover:bg-green-700"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(Number(author.id))}
                aria-label={`Eliminar autor ${author.name}`}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}


