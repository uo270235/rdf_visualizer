/**
 * @module components/Diagram
 */
import React, { useEffect, useState } from 'react';

/**
 * Componente de diagram creado a partir de Kroki para representar shapes lógicas y elemento start.
 * @param {object} props - Las propiedades del componente.
 * @param {string} props.diagramSource - Fuente del diagrama.
 * @param {function} [props.onSvgGenerated] - Función llamada cuando el SVG es generado.
 * @returns {JSX.Element} El componente Diagram.
 * @constant Diagram
 */
const Diagram = ({ diagramSource, onSvgGenerated }) => {
  const [diagram, setDiagram] = useState('');

  useEffect(() => {
    console.log('--------- DESDE DIAGRAM ------------');
    console.log(diagramSource);
    if (diagramSource) {
      fetch('https://kroki.io/plantuml/svg', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: diagramSource,
      })
        .then((response) => response.text())
        .then((svg) => {
          setDiagram(svg);
          if (onSvgGenerated) {
            onSvgGenerated(svg);
          }
        })
        .catch((error) => console.error('Error generating diagram:', error));
    }
  }, [diagramSource, onSvgGenerated]);

  return <div dangerouslySetInnerHTML={{ __html: diagram }} />;
};

export default Diagram;
