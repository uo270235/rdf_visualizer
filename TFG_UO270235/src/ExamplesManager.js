/**
 * @module managers/ExamplesManager
 */

/**
 * Carga un ejemplo desde un archivo JSON.
 * @param {string} example - El nombre del ejemplo a cargar.
 * @returns {Promise<string>} - Una promesa que resuelve con el contenido de ShEx.
 * @throws {Error} - Lanza un error si no se puede cargar el archivo JSON.
 */
export async function loadExample(example) {
  try {
    const response = await fetch(`static/${example}.json`);
    const data = await response.json();
    return data.shex;
  } catch (error) {
    console.error('Error al cargar el archivo JSON:', error);
    throw error;
  }
}
