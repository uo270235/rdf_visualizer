export async function loadExample(example) {
  try {
    const response = await fetch(
      `${process.env.PUBLIC_URL}/static/${example}.json`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.shex;
  } catch (error) {
    console.error('Error al cargar el archivo JSON:', error);
    throw error;
  }
}
