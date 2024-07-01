/**
 * @module components/Alerta
 */
import React from 'react';
import './Alerta.css';

/**
 * Componente de alerta.
 * @param {object} props - Las propiedades del componente.
 * @param {string} props.mensaje - El mensaje de alerta.
 * @param {function} props.onClose - Función para cerrar la alerta.
 * @returns {JSX.Element} El componente Alerta.
 * @constant Alerta
 */
const Alerta = ({ mensaje, onClose }) => {
  return (
    <div className="alerta">
      <span className="alerta-mensaje">{mensaje}</span>
      <button className="alerta-cerrar" onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default Alerta;
