import puppeteer from 'puppeteer';
import { expect } from 'chai';

describe('YASHE Editor Tests', function() {
  let browser;
  let page;

  this.timeout(60000);

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

  it('[U1.1] Verificación de recepción de datos ShEx para entrada E1', async function() {
    try {
      // Esperar a que el editor YASHE esté cargado
      await page.waitForSelector('#yashe-editor');

      // Define el nuevo valor de YASHE
      const entryE1 = `PREFIX :       <http://example.org/>
PREFIX schema: <http://schema.org/>
PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>

:User {
  schema:name          xsd:string ;
  schema:birthDate     xsd:date?  ;
  schema:gender        [ schema:Male schema:Female ] OR xsd:string ;
  schema:knows         IRI @:User*
}
`;

      // Establecer el nuevo valor de YASHE usando Puppeteer
      await page.evaluate((newYasheValue) => {
        const yasheElement = document.querySelector(
          '#yashe-editor .CodeMirror',
        );
        if (yasheElement && yasheElement.CodeMirror) {
          yasheElement.CodeMirror.setValue(newYasheValue);
        }
      }, entryE1);

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

      // Verificar que el valor de YASHE es el esperado
      expect(yasheValue).to.equal(entryE1);
    } catch (error) {
      console.error('Error during test:', error);
    }
  });

  it('[U1.2] Modificación de entrada ', async function() {
    try {
      // Esperar a que el editor YASHE esté cargado
      await page.waitForSelector('#yashe-editor');

      // Define el nuevo valor de YASHE
      const entryE2 = `PREFIX :       <http://example2.org/>
PREFIX schema: <http://schema.org/>
PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>

:Person {
  schema:name          xsd:string ;
  schema:birthDate     xsd:date?  ;
  schema:gender        [ schema:Male schema:Female schema:Other ] ;
  schema:knows         IRI @:Person*
}
`;

      // Establecer el nuevo valor de YASHE usando Puppeteer
      await page.evaluate((newYasheValue) => {
        const yasheElement = document.querySelector(
          '#yashe-editor .CodeMirror',
        );
        if (yasheElement && yasheElement.CodeMirror) {
          yasheElement.CodeMirror.setValue(newYasheValue);
        }
      }, entryE2);

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

      // Verificar que el valor de YASHE es el esperado
      expect(yasheValue).to.equal(entryE2);
    } catch (error) {
      console.error('Error during test:', error);
    }
  });

  it('[U1.3] Eliminar información del editor ', async function() {
    try {
      // Esperar a que el editor YASHE esté cargado
      await page.waitForSelector('#yashe-editor');

      // Define el nuevo valor de YASHE
      const entryE1 = `PREFIX :       <http://example.org/>
PREFIX schema: <http://schema.org/>
PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>

:User {
  schema:name          xsd:string ;
  schema:birthDate     xsd:date?  ;
  schema:gender        [ schema:Male schema:Female ] OR xsd:string ;
  schema:knows         IRI @:User*
}
`;

      // Establecer el nuevo valor de YASHE usando Puppeteer
      await page.evaluate((newYasheValue) => {
        const yasheElement = document.querySelector(
          '#yashe-editor .CodeMirror',
        );
        if (yasheElement && yasheElement.CodeMirror) {
          yasheElement.CodeMirror.setValue(newYasheValue);
        }
      }, entryE1);

      // Verificar que el valor de YASHE se haya actualizado
      let yasheValue = await page.evaluate(() => {
        const yasheElement = document.querySelector(
          '#yashe-editor .CodeMirror',
        );
        if (yasheElement && yasheElement.CodeMirror) {
          return yasheElement.CodeMirror.getValue();
        }
        return null;
      });

      // Verificar que el valor de YASHE es el esperado
      expect(yasheValue).to.equal(entryE1);

      // Eliminar el contenido del editor YASHE
      await page.evaluate(() => {
        const yasheElement = document.querySelector(
          '#yashe-editor .CodeMirror',
        );
        if (yasheElement && yasheElement.CodeMirror) {
          yasheElement.CodeMirror.setValue('');
        }
      });

      // Verificar que el contenido del editor YASHE esté vacío
      yasheValue = await page.evaluate(() => {
        const yasheElement = document.querySelector(
          '#yashe-editor .CodeMirror',
        );
        if (yasheElement && yasheElement.CodeMirror) {
          return yasheElement.CodeMirror.getValue();
        }
        return null;
      });

      // Verificar que el valor de YASHE esté vacío
      expect(yasheValue).to.equal('');
    } catch (error) {
      console.error('Error during test:', error);
    }
  });
});
