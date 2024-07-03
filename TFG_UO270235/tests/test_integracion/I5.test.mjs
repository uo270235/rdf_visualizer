import puppeteer from 'puppeteer';
import { expect } from 'chai';
import fs from 'fs';

describe('RDFVisualizer Visualization Test', function() {
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

  it('[I-5.1] Visualizar dado un Shex sin shapes lógicas ni elemento start declarados', async function() {
    const example7Content = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX : <http://example.org/>



:active_site EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31  [ wd:Q423026 ] ;
  wdt:P361 @:protein_family * ;
}

:anatomical_structure EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31  [ wd:Q4936952 ] ;
  wdt:P361 @:anatomical_structure * ;
  wdt:P527 @:anatomical_structure *
}

:binding_site EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31  [ wd:Q616005 ] ;
  wdt:P361 @:protein *;
  wdt:P361 @:protein_family *;
  wdt:P361 @:protein_domain *
}

:biological_pathway EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31 [ wd:Q4915012 ] ;
  wdt:P361 @:biological_pathway * ;
  wdt:P361 @:gene * ;
  wdt:P361 @:medication * ;
  wdt:P361 @:chemical_compound * ;
  wdt:P703  @:taxon * ;
  wdt:P527 @:disease*;
}

:biological_process EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31  [wd:Q2996394];
  wdt:P527 @:disease *;
  wdt:P31 @:anatomical_structure *;
  wdt:P279 @:biological_process *
}

:cellular_component EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31 [wd:Q5058355];
  wdt:P681 @:cellular_component *;
  wdt:P361 @:protein *;
  wdt:P702 @:gene *;
  wdt:P680 @:molecular_function*;
}
`;
    await visualizeAndCapture(
      example7Content,
      './screenshots/visualization_example7.png',
    );
  });

  it('[I-5.2] Visualizar dado un Shex con shapes lógicas declaradas', async function() {
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
    await visualizeAndCapture(
      example3Content,
      './screenshots/visualization_example3.png',
    );
  });

  it('[I-5.3] Visualizar dado un Shex sin elemento start declarado', async function() {
    const example8Content = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX ex: <http://example.org/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

start =  (@<Project> OR @<Task>) AND (@<Employee> OR @<Team>)

<Project> {
  rdf:type [ ex:Project ] ;
  ex:projectID xsd:string ;
  ex:name xsd:string ;
  ex:startDate xsd:date ;
  ex:endDate xsd:date ? ;
  ex:status [ ex:NotStarted ex:InProgress ex:Completed ] ;
  ex:team @<Team> ;
  ex:tasks @<Task> *
}

<Task> {
  rdf:type [ ex:Task ] ;
  ex:taskID xsd:string ;
  ex:name xsd:string ;
  ex:description xsd:string ;
  ex:assignedTo @<Employee> ? ;
  ex:startDate xsd:date ;
  ex:endDate xsd:date ? ;
  ex:status [ ex:NotStarted ex:InProgress ex:Completed ] ;
  ex:project @<Project> ;
  ex:subTasks @<Task> *
}

<Employee> {
  rdf:type [ ex:Employee ] ;
  ex:employeeID xsd:string ;
  ex:name xsd:string ;
  ex:role [ ex:Developer ex:Manager ex:Tester ] ;
  ex:email xsd:string ;
  ex:team @<Team> ;
  ex:tasks @<Task> *
}

<Team> {
  rdf:type [ ex:Team ] ;
  ex:teamID xsd:string ;
  ex:name xsd:string ;
  ex:members @<Employee> * ;
  ex:projects @<Project> *
}
`;
    await visualizeAndCapture(
      example8Content,
      './screenshots/visualization_example8.png',
    );
  });

  it('[I-5.4] Visualizar una entrada muy grande', async function() {
    const example9Content = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX : <http://example.org/>

start= @:active_site OR 
       @:anatomical_structure OR
       @:binding_site OR
       @:biological_pathway OR
       @:biological_process OR
       @:cellular_component OR
       @:chemical_compound OR
       @:protein OR
       @:ribosomal_RNA OR
       @:sequence_variant OR
       @:supersecondary_structure OR
       @:symptom OR
       @:therapeutic_use 

:active_site EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31  [ wd:Q423026 ] ;
  wdt:P361 @:protein_family * ;
}

:anatomical_structure EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31  [ wd:Q4936952 ] ;
  wdt:P361 @:anatomical_structure * ;
  wdt:P527 @:anatomical_structure *
}

:binding_site EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31  [ wd:Q616005 ] ;
  wdt:P361 @:protein *;
  wdt:P361 @:protein_family *;
  wdt:P361 @:protein_domain *
}

:biological_pathway EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31 [ wd:Q4915012 ] ;
  wdt:P361 @:biological_pathway * ;
  wdt:P361 @:gene * ;
  wdt:P361 @:medication * ;
  wdt:P361 @:chemical_compound * ;
  wdt:P703  @:taxon * ;
  wdt:P527 @:disease*;
}

:biological_process EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31  [wd:Q2996394];
  wdt:P527 @:disease *;
  wdt:P31 @:anatomical_structure *;
  wdt:P279 @:biological_process *
}

:cellular_component EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31 [wd:Q5058355];
  wdt:P681 @:cellular_component *;
  wdt:P361 @:protein *;
  wdt:P702 @:gene *;
  wdt:P680 @:molecular_function*;
}

:chemical_compound EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31  [ wd:Q11173 ] ;
  wdt:P2868 @:therapeutic_use * ;
  wdt:P2868 @:pharmacologic_action * ;
  wdt:P769  @:therapeutic_use * ;
  wdt:P769  @:pharmacologic_action * ;
  wdt:P279  @:pharmacologic_action * ;
  wdt:P3780 @:pharmaceutical_product * ;
  wdt:P2175 @:disease * ;
  wdt:P361  @:biological_pathway * ;
  wdt:P361  @:medication * ;
  wdt:P361 @:molecular_function *;
  wdt:P703  @:taxon * ;
  wdt:P3364 @:chemical_compound * ;
  wdt:P2868 @:mechanism_of_action *;
  wdt:P769 @:chemical_compound * ;
}

:chromosome EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31 [ wd:Q37748 ] ;
}

:disease EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31   [ wd:Q12136 ] ;
  wdt:P780  @:disease * ;
  wdt:P780  @:symptom * ;
  wdt:P828  @:taxon * ;
  wdt:P2293 @:gene * ;
  wdt:P927  @:anatomical_structure * ;
  wdt:P2176 @:medication * ;
  wdt:P2176 @:chemical_compound * ;
}

:gene EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31   [ wd:Q7187 ] ;
  wdt:P2293 @:disease *;
  wdt:P703  @:taxon * ;
  wdt:P684  @:gene * ;
  wdt:P682  @:biological_process ;
  wdt:P688  @:protein * ;
  wdt:P527  @:biological_pathway *;
  wdt:P1057 @:mechanism_of_action ;
  wdt:P688 @:molecular_function *;
  wdt:P688 @:cellular_component*;
}

:mechanism_of_action EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31 [ wd:Q3271540 ] ;
  wdt:P1050 @:disease *
}

:medication EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31 [ wd:Q12140 ] ;
  wdt:P2175 @:disease * ;
  wdt:P3489 @:disease * ;
  wdt:P3780 @:pharmaceutical_product * ;
  wdt:P3489  @:medication * ;
  wdt:P361  @:biological_pathway * ;
  wdt:P769  @:pharmacologic_action * ;
  wdt:P769  @:chemical_compound * ;
  wdt:P769  @:therapeutic_use * ;
  wdt:P2868 @:pharmacologic_action * ;
  wdt:P2868 @:therapeutic_use * ;
  wdt:P279  @:pharmacologic_action * ;
  wdt:P279  @:therapeutic_use * ;
  wdt:P2868 @:mechanism_of_action * ;
  wdt:P2175 @:symptom *
}

:molecular_function EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31  [ wd:Q14860489 ] ;
  wdt:P680 @:molecular_function *;
  wdt:P702 @:gene*;
  wdt:P31 @:protein *;
  wdt:P681 @:cellular_component*
}

:pharmaceutical_product EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31  [ wd:Q28885102 ] ;
  wdt:P3781 @:therapeutic_use * ;
  wdt:P3781 @:pharmacologic_action * ;
  wdt:P3781 @:chemical_compound * ;
  wdt:P4044 @:disease *;
  wdt:P3781 @:medication *
}

:pharmacologic_action EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31 [wd:Q50377224 ] ;
  wdt:P3780 @:pharmaceutical_product * ;
  wdt:P2175 @:disease *
}

:protein_domain EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31  [ wd:Q898273 ] ;
  wdt:P527 @:protein_domain * ;
  wdt:P361 @:protein_domain * ;
}

:protein_family EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31  [ wd:Q417841 ] ;
  wdt:P527 @:protein * ;
  wdt:P279 @:protein_family* ;
}

:protein EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31  [ wd:Q8054 ] ;
  wdt:P129 @:medication * ;
  wdt:P129 @:protein  * ;
  wdt:P129 @:chemical_compound  * ;
  wdt:P702 @:gene * ;
  wdt:P361 @:protein_family * ;
  wdt:P527 @:active_site * ;
  wdt:P527 @:binding_site * ;
  wdt:P680 @:molecular_function * ;
  wdt:P682 @:biological_process * ;
  wdt:P703 @:taxon * ;
  wdt:P681 @:anatomical_structure * ;
  wdt:P681 @:protein * ;
}

:ribosomal_RNA EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31  [ wd:Q28885102 ] ;
  wdt:P703 @:taxon *
}

:sequence_variant EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31   [ wd:Q15304597 ] ;
  wdt:P3355  @:chemical_compound * ;
  wdt:P3354 @:chemical_compound * ;
  wdt:P3354 @:medication * ;
  wdt:P3355 @:medication * ;
  wdt:P3433 @:gene * ;
  wdt:P1057 @:chromosome * ;
}

:supersecondary_structure EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31 [ wd:Q7644128 ] ;
  wdt:P361 @:protein *;
  wdt:P361 @:protein_family *;
  wdt:P361 @:protein_domain *
}

:symptom EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31 [ wd:Q169872 ];
  wdt:P2176 @:chemical_compound *;
}

:taxon EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31 [ wd:Q16521 ] ;
}

:therapeutic_use EXTRA wdt:P31 {
  rdfs:label [ @en @es ] ;
  wdt:P31   [ wd:Q50379781 ] ;
  wdt:P3781 @:pharmaceutical_product * ;
  wdt:P2175 @:disease *
}
`;
    await visualizeAndCapture(
      example9Content,
      './screenshots/visualization_example9.png',
    );
  });
});
