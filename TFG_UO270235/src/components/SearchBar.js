import { useState } from 'react';
import React from 'react';
import { clickToNode, highlightNode } from '../DiagramManager';
import { IoSearch } from 'react-icons/io5';
import Tooltip from '@mui/material/Tooltip';

function SearchBar({ searchTerm, setSearchTerm, onSearch }) {
  const [prevShape, setPrevShape] = useState('');
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    highlightNode(prevShape, searchTerm, '#fff250');
    setPrevShape(searchTerm);
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleTooltipOpen = () => {
    setTooltipOpen(true);
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
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
      <Tooltip
        title="If the class has this syntax <ExampleClass>, search  ex:ExampleClass . If it has this syntax :ExampleClass, search using :ExampleClass."
        open={tooltipOpen}
        onOpen={() => handleTooltipOpen()}
        onClose={() => handleTooltipClose()}
        arrow
      >
        <button type="submit" className="searchButton" onClick={handleSearch}>
          <IoSearch />
        </button>
      </Tooltip>
    </div>
  );
}

export default SearchBar;
