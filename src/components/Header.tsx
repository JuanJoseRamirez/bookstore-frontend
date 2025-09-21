import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 mb-2">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/menu.png"
            alt="App's logo"
            width={40}
            height={40}
          />
          <span className="text-xl font-bold">MiApp</span>
        </Link>
        <nav className="flex space-x-4">
          <Link href="/" className="hover:text-gray-300">
            <h1>Inicio</h1>
          </Link>
          <Link href="/authors" className="hover:text-gray-300">
        <   h1>Authors</h1>
          </Link>
          <Link href="/crear" className="hover:text-gray-300">
            <h1>Añadir</h1>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;