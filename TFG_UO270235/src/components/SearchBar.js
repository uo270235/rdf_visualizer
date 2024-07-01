/**
 * @module components/SearchBar
 */
import React, { useState } from 'react';
import { clickToNode, highlightNode } from '../DiagramManager';
import { IoSearch } from 'react-icons/io5';

/**
 * Barra de búsqueda para buscar nodos en el diagrama.
 * @param {object} props - Las propiedades del componente.
 * @param {function} props.onSearch - Función a ejecutar cuando se realiza una búsqueda.
 * @returns {JSX.Element} El componente SearchBar.
 */
function SearchBar({ onSearch }) {
  /**
   * @constant {string} searchTerm - El término de búsqueda ingresado por el usuario.
   */
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * @constant {string} prevShape - El término de búsqueda previo.
   */
  const [prevShape, setPrevShape] = useState('');

  /**
   * Maneja el cambio en el input de búsqueda.
   * @param {object} event - El evento de cambio.
   * @constant {object} handleInputChange
   */
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  /**
   * Maneja la acción de búsqueda.
   * @constant {object} handleSearch
   */
  const handleSearch = () => {
    highlightNode(prevShape, searchTerm, '#fff250');
    setPrevShape(searchTerm);
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="search">
      <input
        id="searchbar"
        type="text"
        className="searchTerm"
        placeholder="What are you looking for?"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button type="submit" className="searchButton" onClick={handleSearch}>
        <IoSearch></IoSearch>
      </button>
    </div>
  );
}

export default SearchBar;
