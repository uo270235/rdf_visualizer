import puppeteer from 'puppeteer';
import { expect } from 'chai';
import fs from 'fs';

describe('RDFVisualizer Visualization Test - Logical Shapes Cases', function() {
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

  it('[I-7.1] Visualizar dado un Shex sin shapes lógicas', async function() {
    const example12Content = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX ex: <http://example.org/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

start = @<Course>

<Course> {
  rdf:type [ ex:Course ] ;
  ex:courseID xsd:string ;
  ex:title xsd:string ;
  ex:instructor @<Instructor> ;
  ex:assignments @<Assignment> *
}
`;
    await visualizeAndCapture(
      example12Content,
      './screenshots/visualization_example12.png',
    );
  });

  it('[I-7.2] Visualizar dado un Shex con shapes lógicas y elemento start declarado', async function() {
    const example13Content = `prefix : <http://example.org/>
prefix xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX ex: <http://example.org/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

start = @<Course> OR @<Assignment> OR @<Student> OR @<Instructor>

:Personal @<Student> And @<Instructor>

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
      example13Content,
      './screenshots/visualization_example13.png',
    );
  });
});
