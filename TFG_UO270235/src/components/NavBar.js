/**
 * @module components/NavBar
 */
import React, { useState } from 'react';
import { loadExample } from '../ExamplesManager';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

/**
 * Componente de barra de navegación.
 * @param {object} props - Las propiedades del componente.
 * @param {function} props.onExampleLoad - Función llamada cuando se carga un ejemplo.
 * @returns {JSX.Element} El componente NavBar.
 * @constant NavBar
 */
const NavBar = ({ onExampleLoad }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  /**
   * Maneja el clic en el botón del menú.
   * @param {object} event - El evento de clic.
   * @constant handleClick
   */
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Cierra el menú.
   * @constant handleClose
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Maneja el clic en un elemento del menú.
   * @param {string} example - El ejemplo a cargar.
   * @constant handleMenuItemClick
   */
  const handleMenuItemClick = async (example) => {
    try {
      const exampleContent = await loadExample(example);
      onExampleLoad(exampleContent);
    } catch (error) {
      console.error('Error al cargar el ejemplo:', error);
    } finally {
      handleClose();
    }
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <nav className="nav">
        <label className="logo">RDF Visualizer</label>
        <div className="examples-btn">
          <Button
            className="menu-btn"
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            Load Example
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={() => handleMenuItemClick('example1')}>
              Example 1
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('example2')}>
              Example 2
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('example3')}>
              Example 3
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('example4')}>
              Example 4
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('example5')}>
              Example 5
            </MenuItem>
          </Menu>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
