import {obtainLogicShapes} from "./ShapesManager";
import { PlantUMLGenerator } from "./PlantUmlGenerator";

/**
 * Función para hacer una llamada a una API usando el método POST.
 * 
 * @param {string} content - El contenido del esquema que se enviará en el cuerpo de la solicitud.
 * @returns {Promise<Object>} - La respuesta de la API en formato JSON.
 */
export async function callApi(content) {
    let input = content + "";
    const data = {
        schema: {
            content: input,
            format: "ShExC",
            engine: "ShEx",
            source: "byText"
        },
        targetFormat: "ShExJ",
        targetEngine: "ShEx"
    };

    try {
        const response = await fetch("https://api.rdfshape.weso.es/api/schema/convert", {
            method: 'POST', // Método HTTP
            headers: {
                'Content-Type': 'application/json', // Tipo de contenido de la solicitud
            },
            body: JSON.stringify(data) // Convierte el cuerpo de la solicitud a JSON
        });

        if (!response.ok) {
            // Manejo de errores HTTP
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parsear la respuesta JSON
        let result = await response.json();
        result = processResult(result);

        return result;
    } catch (error) {
        // Manejo de errores en la llamada fetch
        console.error('Error en la llamada a la API:', error);
        throw error;
    }
}

/**
 * Función para procesar el resultado de la API y extraer la información deseada.
 * 
 * @param {Object} result - El resultado JSON de la llamada a la API.
 * @returns {Object} - El objeto procesado con la información deseada.
 */
function processResult(result) {
    const data = result.result.content;
    const jsonResult = JSON.parse(data);

    let processed = {
        id: jsonResult.id,
        shapes: jsonResult.shapes.map(shape => ({
            id: shape.id,
            shapeExpr: shape.shapeExpr,
        })),
        start:""
    };

    if (jsonResult.start) {
        console.log("entra????");
        processed.start = jsonResult.start;
    }
    
    console.log(processed);

    const formattedResult = extractIds(processed);
    processed = obtainLogicShapes(formattedResult);
   
    return processed;
}

function extractIds(json) {
    if (typeof json === 'string') {
        try {
            json = JSON.parse(json);
        } catch (error) {
            console.error('Error al parsear el JSON:', error);
            return null;
        }
    }

    function getLastSegment(url) {
        // Separar la URL por '/' y obtener el último segmento
        let segments = url.split('/');
        let lastSegment = segments[segments.length - 1];
    
        if (lastSegment.includes('#')) {
            segments = lastSegment.split('#');
            lastSegment = segments[segments.length - 1];
        }
        
        return lastSegment;
    }
    

    for (let key in json) {
        if (typeof json[key] === 'string' && json[key].startsWith('http')) {
            json[key] = getLastSegment(json[key]);
        } 
        else if (typeof json[key] === 'string' && json[key].startsWith('file')) {
            json[key] = getLastSegment(json[key]);
        } else if (typeof json[key] === 'object' && json[key] !== null) {
            json[key] = extractIds(json[key]);
        }
    }

    return json;
}











