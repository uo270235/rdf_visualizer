import React, { useState } from 'react';
import { loadExample } from '../ExamplesManager';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const NavBar = ({ onExampleLoad }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (example) => {
    loadExample(example, onExampleLoad);
    handleClose();
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
            <MenuItem onClick={() => handleMenuItemClick('example6')}>
              Example 6
            </MenuItem>
          </Menu>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
