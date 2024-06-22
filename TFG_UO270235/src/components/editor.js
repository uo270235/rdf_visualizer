import React, { useState, useEffect, useRef } from 'react';
import './editor.css';
import EditorYashe from './yashe';
import shumlex from 'shumlex';
// import PlantUMLParser from '../parserShapes';
import Diagram from './Diagram';
import Alerta from './Alerta';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { FaDownload } from 'react-icons/fa';
import { callApi } from '../ApiManager';
import { PlantUMLGenerator } from '../PlantUmlGenerator';


function Editor() {
  const editorRef = useRef(null);
  //const [shexCleared, setShexCleared] = useState('');
  const [plantUMLCode, setPlantUMLCode] = useState('');
  const [parseError, setParseError] = useState(null);
  const [krokiSvg, setKrokiSvg] = useState(''); 
  const [isMermaidDiagramVisible, setIsMermaidDiagramVisible] = useState(false);
  const [isKrokiDiagramVisible, setIsKrokiDiagramVisible] = useState(false);

  useEffect(() => {
    const yashes = document.querySelectorAll('.yashe');
    if (yashes.length > 1) {
      yashes[0].remove();
    }
    setTimeout(() => {
      const example = `prefix : <http://example.org/>
prefix xsd: <http://www.w3.org/2001/XMLSchema#>

:Usuario :Hombre OR :Mujer AND NOT {:lolo[] } 

:Hombre {
  :genero [ :Masculino ];
  :mascota @:Perro *;
  :mujer @:Mujer;
}

:Mujer {
  :genero [ :Femenino ];
  :marido @:Hombre ; 
  :mascota @:Perro *
}

:Perro {
  :capacidad [ :ladrar ]
}
`;
      editorRef.current.setYasheValue(example);
    }, 1);
  }, []);

  const extractLogicShapes = async (plantuml) => {
    try {
      parseShexInput();
      setPlantUMLCode(plantuml);
      setParseError(null);
      setIsKrokiDiagramVisible(true);
      return plantuml;
    } catch (error) {
      console.error("Error al parsear ShEx:", error);
      setParseError(error.message);
      setPlantUMLCode('');
      //setShexCleared('');
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
      console.error('No Relational UML diagram content available.');
    }
  };

  const downloadKrokiDiagram = () => {
    if (krokiSvg) {
      downloadDiagram(krokiSvg, 'diagramLogicUMLClass');
    } else {
      console.error('No Logic UML diagram content available.');
    }
  };

  const parseShexInput = () => {
    try {
      const yasheValue = editorRef.current.getYasheValue();
      // shumlex.shExToXMI(yasheValue);
      
      // const xmi = shumlex.shExToXMI(yasheValue);
      // conssole.log("EL XMI SEÑORAS Y SEÑORES:");
      // console.log(xmi);
      // shumlex.crearDiagramaUML('mermaid-diagram', xmi); 

      shumlex.shexToUML("mermaid-diagram",yasheValue);

      // TODO: No funciona bien. Borrar svg al clicar validar y volver a crear
      shumlex.asignarEventos('mermaid-diagram');
      setIsMermaidDiagramVisible(true);
    } catch (error) {  
      console.error("Error al parsear ShEx:", error);
      setParseError(error.message);
      setPlantUMLCode('');
      console.log("DESAPARECE 1");
      clearMermaidDiagram();
      //setShexCleared('');
    }
  };


  // useEffect(() => {
  //   const parseShexInput = () => {
  //     try {
  //       const yasheValue = editorRef.current.getYasheValue();
  //       shumlex.shExToXMI(yasheValue);
  //       console.log("yashe? "+yasheValue);
  //       const xmi = shumlex.shExToXMI(yasheValue);
  //       shumlex.crearDiagramaUML('mermaid-diagram', xmi);
  //       shumlex.asignarEventos('mermaid-diagram');
  //       setIsMermaidDiagramVisible(true);
  //     } catch (error) {  
  //       console.error("Error al parsear ShEx:", error);
  //       setParseError(error.message);
  //       setPlantUMLCode('');
  //       console.log("DESAPARECE 1");
  //       clearMermaidDiagram();
  //       //setShexCleared('');
  //     }
  //   };

  //   if (shexCleared !== '') {
  //     parseShexInput();
  //   }
  // }, [shexCleared]);

  return (
    <>
    <div className="container">
      <div className='editor'>
        <h1 className="page-title">Schema (ShEx)</h1>
        <EditorYashe ref={editorRef} />
        <div className='editor-buttons'>
          <button className='button-20' onClick={async () => {
              const yasheValue = editorRef.current.getYasheValue();
              try {
                let plantuml = await callApi(yasheValue);
                extractLogicShapes(plantuml);
                if (plantuml !== null) {
                  console.log("Plant UML generado correctamente");
                }
              } catch (error) {
                console.error("Error al generar Plant UML:", error);
                setParseError(error.message);
                setPlantUMLCode('');
                console.log("DESAPARECE 2");
                clearMermaidDiagram();
                //setShexCleared('');
              }
            }}>
            Ver Diagrama
          </button>
        </div>
           </div>
           {parseError && (
        <Alerta mensaje={`Error al parsear ShEx: ${parseError}`} onClose={() => setParseError(null)} />
      )}
              <div className="result-container">
          {plantUMLCode && 
          <div className="diagram-container kroki-diagram" data-zoom-on-wheel="zoom-amount: 0.01; min-scale: 0.3; max-scale: 20;" data-pan-on-drag>
            <Diagram diagramSource={plantUMLCode} onSvgGenerated={setKrokiSvg} />
            <div className='icon-container'>
            {isKrokiDiagramVisible && (
              <button className='download-icon' onClick={downloadKrokiDiagram}>
                <FaDownload />
              </button>
            )}
            </div>
          </div>}
          <div className={isMermaidDiagramVisible ? (isKrokiDiagramVisible ? "diagram-container mermaid-diagram" : "diagram-container only-mermaid") : ""} data-zoom-on-wheel="zoom-amount: 0.01; min-scale: 0.3; max-scale: 20;" data-pan-on-drag>
          <div id="mermaid-diagram"></div>
            {isMermaidDiagramVisible && (
              <button className='download-icon' onClick={() => downloadDiagram(document.getElementById('mermaid-diagram').innerHTML, 'diagramUMLRelationalClass')}>
                <FaDownload />
              </button>
              
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Editor;
