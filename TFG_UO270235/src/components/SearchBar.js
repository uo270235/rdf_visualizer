import React, { useState } from 'react';
import { clickToNode, highlightNode } from '../DiagramManager';
import { IoSearch } from "react-icons/io5";

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [prevShape,setPrevShape] = useState('');

  const handleInputChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    clickToNode(searchTerm);
    highlightNode(prevShape,searchTerm, '#fff250');
    setPrevShape(searchTerm);
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="search">
      <input
        type="text"
        className="searchTerm"
        placeholder="What are you looking for?"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button
        type="submit"
        className="searchButton"
        onClick={handleSearch}
      >
        <IoSearch></IoSearch>
      </button>
    </div>
  );
}

export default SearchBar;
