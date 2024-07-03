const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');

  // Espera a que el editor YASHE esté cargado
  await page.waitForSelector('#yashe-editor');

  // Define el nuevo valor de YASHE
  const newYasheValue = `mierda pa ti yashe
`;

  // Establece el nuevo valor de YASHE usando Puppeteer
  await page.evaluate((newYasheValue) => {
    const yasheElement = document.querySelector('#yashe-editor .CodeMirror');
    if (yasheElement && yasheElement.CodeMirror) {
      yasheElement.CodeMirror.setValue(newYasheValue);
    }
  }, newYasheValue);

  // Verifica que el valor de YASHE se haya actualizado
  const yasheValue = await page.evaluate(() => {
    const yasheElement = document.querySelector('#yashe-editor .CodeMirror');
    if (yasheElement && yasheElement.CodeMirror) {
      return yasheElement.CodeMirror.getValue();
    }
    return null;
  });

  console.log('YASHE Value:', yasheValue);

  // Toma una captura de pantalla
  await page.screenshot({ path: 'captura-de-pantalla.png' });

  await browser.close();
})();
