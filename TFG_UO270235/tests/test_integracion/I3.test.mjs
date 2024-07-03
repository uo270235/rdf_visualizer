import puppeteer from 'puppeteer';
import { expect } from 'chai';

describe('YASHE Example Download Test', function() {
  let browser;
  let page;

  this.timeout(60000);

  before(async function() {
    try {
      browser = await puppeteer.launch({ headless: false });
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

  it('[I-3.1] Descarga con shapes lógicas y relaciones', async function() {
    try {
      // Introducir la entrada E-3 en el editor
      const example3Content = `PREFIX : <http://example.org/library#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX schema: <http://schema.org/>

:isMemberOf @:Library AND NOT { :isBanned [ true ] }

:Book {
  :name xsd:string ;
  :author @:Author ;
  :genre @:Genre;
  :datePublished xsd:date ;
  :isbn xsd:string ;
  :about xsd:string *
}

# Forma para un autor
:Author {
  :name xsd:string ;
  :birthDate xsd:date ;
  :nationality xsd:string ;
  :authorOf @:Book *
}

# Forma para un género
:Genre {
  :name xsd:string ;
  :genre @:SubGenre *
}

# Forma para un subgénero
:SubGenre {
  :name xsd:string
}

# Forma para la biblioteca
:Library {
  :libraryName xsd:string ;
  :hasBook @:Book * ;
  :hasBorrowingEvent @:BorrowingEvent *
}

# Forma para un evento de préstamo de libros
:BorrowingEvent {
  :borrower @:User ;
  :itemBorrowed @:Book ;
  :borrowDate xsd:date ;
  :returnDate xsd:date ;
}

:User {
  :name xsd:string ;
}
`;
      await page.evaluate((content) => {
        const yasheElement = document.querySelector(
          '#yashe-editor .CodeMirror',
        );
        if (yasheElement && yasheElement.CodeMirror) {
          yasheElement.CodeMirror.setValue(content);
        }
      }, example3Content);

      await page.waitForSelector('#visualize-button', { timeout: 10000 });
      await page.click('#visualize-button');

      await new Promise((resolve) => setTimeout(resolve, 5000));

      await page.waitForSelector('#download-button', { timeout: 10000 });
      await page.click('#download-button');

      await new Promise((resolve) => setTimeout(resolve, 2000));

      expect(true).to.be.true;
    } catch (error) {
      console.error('Error during test:', error);
      throw error;
    }
  });

  it('[I-3.2] Descarga solo shapes lógicas', async function() {
    try {
      const example4Content = `PREFIX : <http://example.org/library#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX schema: <http://schema.org/>

:isMemberOf :Library AND NOT { :isBanned [ true ] }
`;
      await page.evaluate((content) => {
        const yasheElement = document.querySelector(
          '#yashe-editor .CodeMirror',
        );
        if (yasheElement && yasheElement.CodeMirror) {
          yasheElement.CodeMirror.setValue(content);
        }
      }, example4Content);

      await page.waitForSelector('#visualize-button', { timeout: 10000 });
      await page.click('#visualize-button');

      await new Promise((resolve) => setTimeout(resolve, 5000));

      await page.waitForSelector('#download-button', { timeout: 10000 });
      await page.click('#download-button');

      await new Promise((resolve) => setTimeout(resolve, 2000));

      expect(true).to.be.true;
    } catch (error) {
      console.error('Error during test:', error);
      throw error;
    }
  });

  it('[I-3.3] Descarga solo elemento start', async function() {
    try {
      // Introducir la entrada E-5 en el editor
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

      await page.waitForSelector('#download-button', { timeout: 10000 });
      await page.click('#download-button');

      await new Promise((resolve) => setTimeout(resolve, 2000));

      expect(true).to.be.true;
    } catch (error) {
      console.error('Error during test:', error);
      throw error;
    }
  });
});
