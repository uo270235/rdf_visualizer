import React, { useState, useEffect, useRef } from 'react';
import './editor.css';
import EditorYashe from './yashe';
import shumlex from 'shumlex';
// import PlantUMLParser from '../parserShapes';
import Diagram from './Diagram';
import Alerta from './Alerta';
import { FaDownload } from 'react-icons/fa';
import { callApi } from '../ApiManager';
import { PlantUMLGenerator } from '../PlantUmlGenerator';


function Editor() {
  const editorRef = useRef(null);
  const [krokiSource, setKrokiSource] = useState('');
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

  const createKroki = async (json_api,mermaidUML) => {
    try {
      const generator = new PlantUMLGenerator(json_api,mermaidUML);
      const plantUMLCode = generator.generate(); 
      console.log("kroki source!!!!!!!!!!!!");
      console.log(plantUMLCode);
      setKrokiSource(plantUMLCode);
      setParseError(null);
      setIsKrokiDiagramVisible(true);
      return plantUMLCode;
    } catch (error) {
      console.error("Error al parsear ShEx:", error);
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

  /**
   * 
   * @param {*} svgContent 
   * @param {*} filename 
   */
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

  const createMermaid = () => {
    try {
      let yasheValue = editorRef.current.getYasheValue();
      let source = yasheValue.replace(/\bnot\b/gi, "NOT");
      let mermaidUML = shumlex.shexToUML("mermaid-diagram",source);
      shumlex.asignarEventos('mermaid-diagram');
      setIsMermaidDiagramVisible(true);
      return mermaidUML;
    } catch (error) {  
      console.error("Error al parsear ShEx:", error);
      setParseError(error.message);
      setKrokiSource('');
      console.log("DESAPARECE 1");
      clearMermaidDiagram();
    }
  };

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

                //Obtenemos JSON a través de la API
                let json_api = await callApi(yasheValue); 

                // Generación de Mermaid
                let mermaidUML=createMermaid();

                // Generación de Kroki
                createKroki(json_api,mermaidUML);

              } catch (error) {
                console.error("Error al generar Plant UML:", error);
                setParseError(error.message);
                setKrokiSource('');
                console.log("DESAPARECE 2");
                clearMermaidDiagram();
              }
            }}>
            Ver Diagrama
          </button>
        </div>
           </div>
           {parseError && (
        <Alerta mensaje={`Error al parsear ShEx,revise su entrada.`} onClose={() => setParseError(null)} />
      )}
              <div className="result-container">
          {krokiSource && 
          <div className="diagram-container kroki-diagram" data-zoom-on-wheel="zoom-amount: 0.01; min-scale: 0.3; max-scale: 20;" data-pan-on-drag>
            <Diagram diagramSource={krokiSource} onSvgGenerated={setKrokiSvg} />
            <div className='icon-container'>
              <button className='download-icon' onClick={downloadKrokiDiagram}>
                <FaDownload />
              </button>
            </div>
          </div>}
          <div className={isMermaidDiagramVisible ? (isKrokiDiagramVisible ? "diagram-container mermaid-diagram" : "diagram-container only-mermaid") : ""} data-zoom-on-wheel="zoom-amount: 0.01; min-scale: 0.3; max-scale: 20;" data-pan-on-drag>
          <div id="mermaid-diagram"></div>
              <button className='download-icon' onClick={() => downloadDiagram(document.getElementById('mermaid-diagram').innerHTML, 'diagramUMLRelationalClass')}>
                <FaDownload />
              </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Editor;
