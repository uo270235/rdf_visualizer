import puppeteer from 'puppeteer';
import { expect } from 'chai';
import fs from 'fs';

describe('RDFVisualizer Highlight Functionality Test', function() {
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

  async function visualize(content) {
    await page.evaluate((content) => {
      const yasheElement = document.querySelector('#yashe-editor .CodeMirror');
      if (yasheElement && yasheElement.CodeMirror) {
        yasheElement.CodeMirror.setValue(content);
      }
    }, content);

    await page.waitForSelector('#visualize-button', { timeout: 10000 });
    await page.click('#visualize-button');

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  async function clickAndCapture(labelText, screenshotPath) {
    await page.evaluate((labelText) => {
      const elements = Array.from(document.querySelectorAll('.nodeLabel'));
      const targetElement = elements.find(
        (el) => el.textContent.trim() === labelText,
      );
      if (targetElement) {
        targetElement.click();
      }
    }, labelText);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    await page.screenshot({ path: screenshotPath });

    expect(fs.existsSync(screenshotPath)).to.be.true;
  }

  it('[I-9-1] Resaltar una clase con relaciones', async function() {
    const exampleContent = `PREFIX : <http://example.org/library#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX schema: <http://schema.org/>

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
}`;
    await visualize(exampleContent);
    await clickAndCapture(
      ':Library',
      './screenshots/click_library_highlighted.png',
    );
  });

  it('[I-9-2] Resaltar una clase sin relaciones', async function() {
    const exampleContent = `PREFIX : <http://example.org/library#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX schema: <http://schema.org/>

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
}`;
    await visualize(exampleContent);
    await clickAndCapture(':User', './screenshots/click_book_highlighted.png');
  });
});
