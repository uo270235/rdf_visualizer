export function loadExample(example) {
  fetch(`static/${example}.json`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.error('Error al cargar el archivo JSON:', error);
    });
}
