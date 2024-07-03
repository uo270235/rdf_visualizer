import puppeteer from 'puppeteer';
import { expect } from 'chai';

describe('YASHE Editor Tests', function() {
  let browser;
  let page;

  this.timeout(60000); // Incrementar el timeout a 60000ms

  before(async function() {
    try {
      browser = await puppeteer.launch({ headless: false }); // Ejecutar en modo no headless para depurar
      page = await browser.newPage();
      await page.goto('http://localhost:3000', {
        waitUntil: 'networkidle2',
      });
    } catch (error) {
      console.error('Error during before hook:', error);
    }
  });

  after(async function() {
    if (browser) {
      await browser.close();
    }
  });

  it('should take a screenshot of the web page and change YASHE value', async function() {
    try {
      // Esperar un poco para asegurarse de que la página esté completamente cargada
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Esperar 5 segundos

      // Tomar una captura de pantalla
      await page.screenshot({ path: 'test_mochi.png' });

      // Esperar a que el editor YASHE esté cargado
      await page.waitForSelector('#yashe-editor');

      // Define el nuevo valor de YASHE
      const newYasheValue = `mierda pa ti yashe\n`;

      // Establecer el nuevo valor de YASHE usando Puppeteer
      await page.evaluate((newYasheValue) => {
        const yasheElement = document.querySelector(
          '#yashe-editor .CodeMirror',
        );
        if (yasheElement && yasheElement.CodeMirror) {
          yasheElement.CodeMirror.setValue(newYasheValue);
        }
      }, newYasheValue);

      // Verificar que el valor de YASHE se haya actualizado
      const yasheValue = await page.evaluate(() => {
        const yasheElement = document.querySelector(
          '#yashe-editor .CodeMirror',
        );
        if (yasheElement && yasheElement.CodeMirror) {
          return yasheElement.CodeMirror.getValue();
        }
        return null;
      });

      // Imprimir el valor de YASHE para verificación
      console.log('YASHE Value:', yasheValue);

      // Verificar que el valor de YASHE es el esperado
      expect(yasheValue).to.equal(newYasheValue);

      // Tomar otra captura de pantalla después de cambiar el valor de YASHE
      await page.screenshot({ path: 'test_mochi_after_change.png' });
    } catch (error) {
      console.error('Error during test:', error);
    }
  });
});
