This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the page.

Arquitectura de la Solucion
- La solucione esta estructurada asi
src/app
/authors
 Para la pagina se usa un Header, un componente AuthorList que sirve para mostras la lista de autores/ para la pagina 
 /favorites se usa el mismo componente y se filtran los autores a mostrar con una valor booleano de si es favorito.
/crear
Esta pagina no usa componentes reutilzables, si no que implementa su propio componente usando userstate para manejar el estado del formulario

Hooks
/useAuthor maneja todas las operaciones CRUD de authores contra la API, ademas para la implementacion de favoritos, se creo un customContext que maneja permite manejar el estado favorito del author, manteniendo las opraciones CRUDn realizadas para le preparcial.
/useBooks maneja todas las operaciones CRUD de books, este hook se creo este hooks para primero poder eliminar relaciones de authores con sus libros, para poder eliminar un autor.

/AuthorList componente que muestra la listas de los autores es te se usa en varias paginas.

Para el desarrllo de la parte B del parcial, Se trabajo la Accesibilidad, esta se puede validar el mirar los atributos de todos los <buttom> usados en la implementacion, a su vez para la navegacion con teclado se puede verificar de forma practica usando el tabulador.

Para correr la app, primero ejecutar le back-end y luego correr el comando
npm run dev
