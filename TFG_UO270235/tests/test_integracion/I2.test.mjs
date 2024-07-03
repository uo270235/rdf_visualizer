import puppeteer from 'puppeteer';
import { expect } from 'chai';

describe('YASHE Example Selection Tests', function() {
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

  it('[I-2.1] Ejemplo cargado correctamente', async function() {
    try {
      // Esperar a que el botón de cargar ejemplo esté cargado
      await page.waitForSelector('#basic-button');

      // Hacer clic en el botón de cargar ejemplo
      await page.click('#basic-button');

      // Esperar a que se cargue el menú y hacer clic en Example 1
      await page.waitForSelector('#example-1');
      await page.click('#example-1');

      // Esperar un poco para que el editor se actualice
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Esperar 2 segundos

      // Verificar el contenido del editor
      const example1Content = `prefix : <http://example.org/>
prefix xsd: <http://www.w3.org/2001/XMLSchema#>

:Usuario (@:Hombre OR @:Mujer ) and not {:capacidad [:volar]; :estaVivo [false] }

:Animal @:Canario or @:Perro

:Hombre {
  :genero [ :Masculino ];
  :nombre xsd:string ;
  :edad xsd:integer ;
  :mascota @:Canario ;
  :mascota @:Perro *;
  :pareja @:Mujer
}

:Mujer {
  :genero [ :Femenino ];
  :nombre xsd:string ;
  :edad xsd:integer ;
  :mascota @:Canario*;
  :mascota @:Perro;
  :pareja @:Hombre
}

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

      const yasheValue = await page.evaluate(() => {
        const yasheElement = document.querySelector(
          '#yashe-editor .CodeMirror',
        );
        if (yasheElement && yasheElement.CodeMirror) {
          return yasheElement.CodeMirror.getValue();
        }
        return null;
      });

      expect(yasheValue.trim()).to.equal(example1Content.trim());
    } catch (error) {
      console.error('Error during test:', error);
    }
  });

  it('[I-2.2] Cambio en la selección de ejemplo', async function() {
    try {
      await page.waitForSelector('#basic-button');

      await page.click('#basic-button');

      await page.waitForSelector('#example-1');
      await page.click('#example-1');

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Esperar 2 segundos

      await page.click('#basic-button');

      await page.waitForSelector('#example-2');
      await page.click('#example-2');

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Esperar 2 segundos

      const example2Content = `prefix wd: <http://www.wikidata.org/entity/>
prefix wdt: <http://www.wikidata.org/prop/direct/>
prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>

start = @<city> OR @<human>

<city> EXTRA wdt:P31 {
    rdfs:label [ @en ] ;
    wdt:P31 [ wd:Q515 ]
}

<human> EXTRA wdt:P31 {
    rdfs:label [ @en ] ;
    wdt:P31 [ wd:Q5 ] ;
    wdt:P19 @<BirthPlace>
}

<BirthPlace> {
    rdfs:label [ @en ]
}
`;

      const yasheValue = await page.evaluate(() => {
        const yasheElement = document.querySelector(
          '#yashe-editor .CodeMirror',
        );
        if (yasheElement && yasheElement.CodeMirror) {
          return yasheElement.CodeMirror.getValue();
        }
        return null;
      });

      // Verificar que el valor de YASHE es el esperado (sin espacios al principio y al final)
      expect(yasheValue.trim()).to.equal(example2Content.trim());
    } catch (error) {
      console.error('Error during test:', error);
    }
  });
});
