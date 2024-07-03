import puppeteer from 'puppeteer';
import { expect } from 'chai';

describe('YASHE Response Handling Test', function() {
  let browser;
  let page;
  let interceptedResponse = null;

  this.timeout(60000);

  before(async function() {
    try {
      browser = await puppeteer.launch({ headless: false });
      page = await browser.newPage();

      await page.setRequestInterception(true);
      page.on('request', (request) => {
        if (
          request
            .url()
            .includes('https://api.rdfshape.weso.es/api/schema/convert')
        ) {
          request.continue();
        } else {
          request.continue();
        }
      });

      page.on('response', async (response) => {
        if (
          response
            .url()
            .includes('https://api.rdfshape.weso.es/api/schema/convert')
        ) {
          interceptedResponse = await response.json();
        }
      });

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

  it('[I-4.1] Para entrada valida recibir respuesta adecuada', async function() {
    try {
      const example5Content = `PREFIX : <http://example.org/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

start= :Hombre or :Perro

:Usuario (:Hombre OR :Mujer ) and not {:capacidad [:volar]; :estaVivo [false] }

:Animal :Canario or :Perro
`;
      await page.evaluate((content) => {
        const yasheElement = document.querySelector(
          '#yashe-editor .CodeMirror',
        );
        if (yasheElement && yasheElement.CodeMirror) {
          yasheElement.CodeMirror.setValue(content);
        }
      }, example5Content);

      await page.waitForSelector('#visualize-button', { timeout: 10000 });
      await page.click('#visualize-button');

      await new Promise((resolve) => setTimeout(resolve, 5000));

      expect(interceptedResponse).to.not.be.null;
      expect(interceptedResponse.result.content).to.include('Hombre');
    } catch (error) {
      console.error('Error during test:', error);
      throw error;
    }
  });

  it('[I-4.2] Para entrada invalida recibir respuesta adecuada', async function() {
    try {
      const example6Content = `PREFIX : <http://example.org/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

start= :Hombre or :Perro

:Usuario (:Hombre OR :Mujer ) and not {:capacidad [:volar] ; :estaVivo [false]  1234 invalid syntax}
`;
      await page.evaluate((content) => {
        const yasheElement = document.querySelector(
          '#yashe-editor .CodeMirror',
        );
        if (yasheElement && yasheElement.CodeMirror) {
          yasheElement.CodeMirror.setValue(content);
        }
      }, example6Content);

      await page.waitForSelector('#visualize-button', { timeout: 10000 });
      await page.click('#visualize-button');

      await new Promise((resolve) => setTimeout(resolve, 5000));

      expect(interceptedResponse).to.not.be.null;
    } catch (error) {
      console.error('Error during test:', error);
      throw error;
    }
  });
});
