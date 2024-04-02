import './css/index.css';
import { useEffect, useState } from 'react';
import Header from './components/header';

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [types, setTypes] = useState([]);
  const [pagination, setPagination] = useState(0);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${pagination}`)
      .then(res => res.json())
      .then(data => {
        setPokemons(data.results.map(pokemon => pokemon.name));
        // Obtener los tipos de todos los Pokémon
        const pokemonPromises = data.results.map(pokemon =>
          fetch(pokemon.url).then(res => res.json())
        );
        Promise.all(pokemonPromises)
          .then(pokemonData => {
            const typesArray = pokemonData.map(pokemon => pokemon.types.map(type => type.type.name));
            setTypes(typesArray);
          })
          .catch(error => console.error('Error fetching Pokémon types:', error));
      })
      .catch(error => console.error('Error fetching Pokémon data:', error));
  }, [pagination]);

  const loadMorePokemons = () => {
    setPagination(prevPagination => prevPagination + 20);
  };

  return (
    <>
      <Header />
      <main className='my-20 flex flex-wrap gap-8 mx-4'>
        {pokemons.map((pokemon, index) => (
          <article className='border-2 w-fit p-4 rounded-xl shadow-md shadow-black hover:scale-105 transition cursor-pointer' key={index}>
            <img className='size-40' src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${ index + 1}.png`} alt={`Imagen de ${pokemon}`} />
            <h2 className='uppercase'>{ index + 1}. {pokemon}</h2>
            {/* Mostrar los tipos del Pokémon */}
            {types[index] && (
              <p className='capitalize text-sm text-gray-500 italic'>{types[index].join(', ')}</p>
            )}
          </article>
        ))}
        <button onClick={loadMorePokemons}
          className='border-2 py-2 px-4 w-fit rounded-xl border-black hover:bg-gray-300 hover:shadow-sm transition h-fit self-center my-4'>Cargar más...</button>
      </main>
    </>
  );
}

export default App;
