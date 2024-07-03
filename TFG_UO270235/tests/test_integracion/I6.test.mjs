import puppeteer from 'puppeteer';
import { expect } from 'chai';
import fs from 'fs';

describe('RDFVisualizer Visualization Test - Additional Cases', function() {
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

  async function visualizeAndCapture(content, screenshotPath) {
    await page.evaluate((content) => {
      const yasheElement = document.querySelector('#yashe-editor .CodeMirror');
      if (yasheElement && yasheElement.CodeMirror) {
        yasheElement.CodeMirror.setValue(content);
      }
    }, content);

    await page.waitForSelector('#visualize-button', { timeout: 10000 });
    await page.click('#visualize-button');

    await new Promise((resolve) => setTimeout(resolve, 5000));

    await page.screenshot({ path: screenshotPath });

    expect(fs.existsSync(screenshotPath)).to.be.true;
  }

  it('[I-6.1] Visualizar dado un Shex con elemento start declarado', async function() {
    const example10Content = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX ex: <http://example.org/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

start = @<Course> OR @<Assignment> OR @<Student> OR @<Instructor>

<Course> {
  rdf:type [ ex:Course ] ;
  ex:courseID xsd:string ;
  ex:title xsd:string ;
  ex:instructor @<Instructor> ;
  ex:assignments @<Assignment> *
}

<Assignment> {
  rdf:type [ ex:Assignment ] ;
  ex:assignmentID xsd:string ;
  ex:title xsd:string ;
  ex:assignedTo @<Student> ? ;
  ex:course @<Course>
}

<Student> {
  rdf:type [ ex:Student ] ;
  ex:studentID xsd:string ;
  ex:name xsd:string ;
  ex:courses @<Course> *
}

<Instructor> {
  rdf:type [ ex:Instructor ] ;
  ex:instructorID xsd:string ;
  ex:name xsd:string ;
  ex:courses @<Course> *
}
`;
    await visualizeAndCapture(
      example10Content,
      './screenshots/visualization_example10.png',
    );
  });

  it('[I-6.2] Visualizar dado un Shex sin elemento start declarado', async function() {
    const example11Content = `prefix : <http://example.org/>
prefix xsd: <http://www.w3.org/2001/XMLSchema#>


:Animal @:Canario or @:Perro


:Perro {
  :nombre xsd:string ;
  :edad xsd:integer ;
  :capacidad [ :ladrar ]
}

:Canario {
  :nombre xsd:string ;
  :edad xsd:integer ;
  :capacidad [ :volar ]
}
`;
    await visualizeAndCapture(
      example11Content,
      './screenshots/visualization_example11.png',
    );
  });
});
