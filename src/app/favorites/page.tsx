'use client';
import AuthorsList from '@/components/AuthorsList';
import { useAuthors} from '@/hook/useAuthors';

export default function FavoritosPage() {
  const { authors, favorites } = useAuthors();
  const favAuthors = authors.filter(a => favorites.includes(a.id!));

  return (
    <div>
      <h1 className="text-2xl text-center mt-6 font-bold">Autores Favoritos</h1>
      {favAuthors.length === 0 ? (
        <p className="text-center mt-10">No hay autores favoritos aún.</p>
      ) : (
        <AuthorsList onlyFavorites/>
      )}
    </div>
  );
}
