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
