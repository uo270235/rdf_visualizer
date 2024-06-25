import React, { useState, useEffect, useRef } from 'react';
import './editor.css';
import EditorYashe from './yashe';
import shumlex from 'shumlex';
import Diagram from './Diagram';
import Alerta from './Alerta';
import { FaDownload, FaQuestion } from 'react-icons/fa';
import { callApi } from '../ApiManager';
import { PlantUMLGenerator } from '../PlantUmlGenerator';
import SearchBar from './SearchBar';
import Tooltip from '@mui/material/Tooltip';

export function scrollToElement(id) {
  const element = document.getElementById(id);
  if (element) {
    const elementRect = element.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const scrollY = elementRect.top + window.pageYOffset - viewportHeight / 2;
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }
}

function Editor({ example }) {
  const editorRef = useRef(null);
  const [krokiSource, setKrokiSource] = useState('');
  const [parseError, setParseError] = useState(null);
  const [krokiSvg, setKrokiSvg] = useState('');
  const [isMermaidDiagramVisible, setIsMermaidDiagramVisible] = useState(false);
  const [isKrokiDiagramVisible, setIsKrokiDiagramVisible] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState({
    question: false,
    download: false,
  });

  useEffect(() => {
    if (example && editorRef.current) {
      editorRef.current.setYasheValue(example);
    }
  }, [example]);

  useEffect(() => {
    const yashes = document.querySelectorAll('.yashe');
    if (yashes.length > 1) {
      yashes[0].remove();
    }
    setTimeout(() => {
      const example = `PREFIX :       <http://example.org/>
PREFIX schema: <http://schema.org/>
PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>

:User {
  schema:name          xsd:string ;
  schema:birthDate     xsd:date?  ;
  schema:gender        [ schema:Male schema:Female ] OR xsd:string ;
  schema:knows         IRI @:User*
}
`;
      editorRef.current.setYasheValue(example);
    }, 1);
  }, []);

  const recreateMermaid = async () => {
    const container = document.getElementById('mermaid-diagram-container');
    const oldMermaidDiagram = document.getElementById('mermaid-diagram');
    if (oldMermaidDiagram) {
      container.removeChild(oldMermaidDiagram);
    }
    const newMermaidDiagram = document.createElement('div');
    newMermaidDiagram.id = 'mermaid-diagram';
    container.insertBefore(newMermaidDiagram, container.firstChild);
  };

  const createKroki = async (json_api, mermaidUML) => {
    try {
      const generator = new PlantUMLGenerator(json_api, mermaidUML);
      const plantUMLCode = generator.generate();

      setKrokiSource(plantUMLCode);
      setParseError(null);
      if (json_api.length === 0) setKrokiSource('');
      return plantUMLCode;
    } catch (error) {
      console.error('Error al parsear ShEx:', error);
      setParseError(error.message);
      setKrokiSource('');
      setIsKrokiDiagramVisible(false);
      return null;
    }
  };

  const clearMermaidDiagram = () => {
    const mermaidContainer = document.getElementById('mermaid-diagram');
    if (mermaidContainer) {
      mermaidContainer.innerHTML = '';
      setIsMermaidDiagramVisible(false);
    }
  };

  const handleTooltipOpen = (tooltipName) => {
    setTooltipOpen((prevState) => ({ ...prevState, [tooltipName]: true }));
  };

  const handleTooltipClose = (tooltipName) => {
    setTooltipOpen((prevState) => ({ ...prevState, [tooltipName]: false }));
  };

  const downloadDiagram = (svgContent, filename) => {
    if (svgContent) {
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      console.error('No hay contenido del diagrama UML relacional disponible.');
    }
  };

  const createMermaid = () => {
    try {
      let yasheValue = editorRef.current.getYasheValue();
      let source = yasheValue.replace(/\bnot\b/gi, 'NOT');
      let mermaidUML = shumlex.shexToUML('mermaid-diagram', source);
      shumlex.asignarEventos('mermaid-diagram');

      if (mermaidUML === 'classDiagram\n') {
        clearMermaidDiagram();
        console.log('Error en la generación del diagrama Mermaid jiji');
      } else {
        setIsMermaidDiagramVisible(true);
        return mermaidUML;
      }
    } catch (error) {
      console.error('Error al parsear ShEx:', error);
      setParseError(error.message);
      setKrokiSource('');

      clearMermaidDiagram();
    }
  };

  const getSvgDimensions = (svgString) => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = svgDoc.getElementsByTagName('svg')[0];
    const width = parseFloat(
      svgElement.getAttribute('width') || svgElement.viewBox.baseVal.width,
    );
    const height = parseFloat(
      svgElement.getAttribute('height') || svgElement.viewBox.baseVal.height,
    );
    return { width, height };
  };

  const combineSVGs = () => {
    const mermaidSVG =
      document.getElementById('mermaid-diagram')?.innerHTML || '';
    let krokiSVG = krokiSvg || '';

    // Elimina las declaraciones XML adicionales
    krokiSVG = krokiSVG.replace(/<\?xml.*?\?>/g, '');

    if (!mermaidSVG && !krokiSVG) {
      console.error('No hay contenido SVG para combinar.');
      return;
    }

    const krokiDimensions = krokiSVG
      ? getSvgDimensions(krokiSVG)
      : { width: 0, height: 0 };
    const mermaidDimensions = mermaidSVG
      ? getSvgDimensions(mermaidSVG)
      : { width: 0, height: 0 };

    const combinedWidth = Math.max(
      krokiDimensions.width,
      mermaidDimensions.width,
    );
    const combinedHeight = krokiDimensions.height + mermaidDimensions.height;

    const combinedSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${combinedWidth}" height="${combinedHeight}">
        ${krokiSVG ? `<g>${krokiSVG}</g>` : ''}
        ${
          mermaidSVG
            ? `<g transform="translate(0, ${krokiDimensions.height})">${mermaidSVG}</g>`
            : ''
        }
      </svg>
    `;

    downloadDiagram(combinedSVG, 'combinedDiagram');
  };

  const iconStyle = {
    backgroundColor: 'white',
    color: '#1f425d',
    borderRadius: '0.2rem',
    padding: '0.1rem',
    marginLeft: '1rem',
    width: '1.15rem',
    height: '1.15rem',
  };

  const titleStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <>
      <div className="container">
        <div className="editor">
          <h1 className="page-title" style={titleStyle}>
            Schema (ShEx)
            <Tooltip
              title="Input some ShEx schema  to validate the schema and visualize it in UML diagrams."
              open={tooltipOpen.question}
              onOpen={() => handleTooltipOpen('question')}
              onClose={() => handleTooltipClose('question')}
              arrow
            >
              <div
                onMouseEnter={() => handleTooltipOpen('question')}
                onMouseLeave={() => handleTooltipClose('question')}
              >
                <FaQuestion style={iconStyle} />
              </div>
            </Tooltip>
          </h1>
          <EditorYashe ref={editorRef} />
          <div className="editor-buttons">
            <button
              className="button-20"
              onClick={async () => {
                const yasheValue = editorRef.current.getYasheValue();
                try {
                  await recreateMermaid();

                  // Limpiar estado previo de Kroki
                  setKrokiSource('');
                  setKrokiSvg('');
                  setIsKrokiDiagramVisible(false);

                  //Obtenemos JSON a través de la API
                  let json_api = await callApi(yasheValue);

                  // Generación de Mermaid
                  let mermaidUML = createMermaid();
                  console.log('caaa');
                  console.log(mermaidUML);

                  // Generación de Kroki
                  createKroki(json_api, mermaidUML);

                  scrollToElement('result-container');
                } catch (error) {
                  console.error('Error al generar Plant UML:', error);
                  setParseError(error.message);
                  setKrokiSource('');

                  clearMermaidDiagram();
                }
              }}
            >
              Visualize
            </button>
          </div>
        </div>
        {parseError && (
          <Alerta
            mensaje={`Error al parsear ShEx, revise su entrada.`}
            onClose={() => setParseError(null)}
          />
        )}

        {(krokiSource || isMermaidDiagramVisible) && (
          <div className="tools-container">
            {isMermaidDiagramVisible && <SearchBar />}
            <Tooltip
              title="Download Diagram(s)"
              open={tooltipOpen.download}
              onOpen={() => handleTooltipOpen('download')}
              onClose={() => handleTooltipClose('download')}
              arrow
            >
              <button
                className="download-icon"
                onClick={combineSVGs}
                onMouseEnter={() => handleTooltipOpen('download')}
                onMouseLeave={() => handleTooltipClose('download')}
              >
                <FaDownload />
              </button>
            </Tooltip>
          </div>
        )}

        <div id="result-container" className="result-container">
          {krokiSource && (
            <div
              className={
                krokiSource
                  ? isMermaidDiagramVisible
                    ? 'diagram-container kroki-diagram'
                    : 'diagram-container only-kroki'
                  : ''
              }
              data-zoom-on-wheel="zoom-amount: 0.01; min-scale: 0.3; max-scale: 20;"
              data-pan-on-drag
            >
              <Diagram
                diagramSource={krokiSource}
                onSvgGenerated={setKrokiSvg}
              />
            </div>
          )}
          <div
            id="mermaid-diagram-container"
            className={
              isMermaidDiagramVisible
                ? krokiSource
                  ? 'diagram-container mermaid-diagram'
                  : 'diagram-container only-mermaid'
                : ''
            }
            data-zoom-on-wheel="zoom-amount: 0.01; min-scale: 0.3; max-scale: 20;"
            data-pan-on-drag
          >
            <div id="mermaid-diagram"></div>
          </div>
        </div>
        <div className="icon-container"></div>
      </div>
    </>
  );
}

export default Editor;
