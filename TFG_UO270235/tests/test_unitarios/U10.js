const puppeteer = require('puppeteer');
const { PlantUMLGenerator } = require('../../src/PlantUmlGenerator'); // Ajusta la ruta a tu archivo
const chalk = require('chalk');

function normalizeIds(uml) {
  let idCounter = 1;
  return uml.replace(/(_[a-z0-9]+)+/g, () => `_${idCounter++}`);
}

(async () => {
  // Configuración de Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Caso de prueba U-10.1: PlantUML para estructuras que utilizan el operador lógico AND
  const jsonAnd = [
    {
      id: 'Animal',
      type: 'ShapeAnd',
      shapeExprs: [
        { type: 'NodeConstraint', datatype: 'Canario' },
        { type: 'NodeConstraint', datatype: 'Perro' },
      ],
    },
  ];

  console.log(chalk.blue('\n Pruebas unitarias U10:\n'));

  const expectedOutputAnd = `@startuml
allowmixing
left to right direction
skinparam component {
BackgroundColor<<AND>> #1E3A8A
BorderColor<<AND>> #60A5FA
FontColor<<AND>> #E0F2FE

BackgroundColor<<NOT>> #F87171
BorderColor<<NOT>> #B91C1C
FontColor<<NOT>> #FFFFFF

BackgroundColor<<OR>> #065F46
BorderColor<<OR>> #6EE7B7
FontColor<<OR>> #D1FAE5
}

skinparam {
Shadowing true
RoundCorner 15
}

class Animal {}
component [ ] as AND_1 <<AND>>
Animal --> AND_1
class "Canario" as Canario_2 {}
AND_1 --> Canario_2
class "Perro" as Perro_3 {}
AND_1 --> Perro_3
@enduml`;

  const generatorAnd = new PlantUMLGenerator(jsonAnd, '');
  const resultAnd = generatorAnd.generate();
  const normalizedResultAnd = normalizeIds(resultAnd);
  const normalizedExpectedOutputAnd = normalizeIds(expectedOutputAnd);
  const testId1 = 'U-10.1';
  const testDesc1 =
    'PlantUML para estructuras que utilizan el operador lógico AND';
  const testPassed1 = normalizedResultAnd === normalizedExpectedOutputAnd;
  console.log(
    testPassed1
      ? chalk.green(`${testId1} Test passed`)
      : chalk.red(`${testId1} Test failed`),
    chalk.white(testDesc1),
  );

  // Caso de prueba U-10.2: PlantUML adecuado para estructuras que utilizan el operador lógico OR
  const jsonOr = [
    {
      id: 'Animal',
      type: 'ShapeOr',
      shapeExprs: [
        { type: 'NodeConstraint', datatype: 'Canario' },
        { type: 'NodeConstraint', datatype: 'Perro' },
      ],
    },
  ];

  const expectedOutputOr = `@startuml
allowmixing
left to right direction
skinparam component {
BackgroundColor<<AND>> #1E3A8A
BorderColor<<AND>> #60A5FA
FontColor<<AND>> #E0F2FE

BackgroundColor<<NOT>> #F87171
BorderColor<<NOT>> #B91C1C
FontColor<<NOT>> #FFFFFF

BackgroundColor<<OR>> #065F46
BorderColor<<OR>> #6EE7B7
FontColor<<OR>> #D1FAE5
}

skinparam {
Shadowing true
RoundCorner 15
}

class Animal {}
component [ ] as OR_1 <<OR>>
Animal --> OR_1
class "Canario" as Canario_2 {}
OR_1 --> Canario_2
class "Perro" as Perro_3 {}
OR_1 --> Perro_3
@enduml`;

  const generatorOr = new PlantUMLGenerator(jsonOr, '');
  const resultOr = generatorOr.generate();
  const normalizedResultOr = normalizeIds(resultOr);
  const normalizedExpectedOutputOr = normalizeIds(expectedOutputOr);
  const testId2 = 'U-10.2';
  const testDesc2 =
    'PlantUML adecuado para estructuras que utilizan el operador lógico OR';
  const testPassed2 = normalizedResultOr === normalizedExpectedOutputOr;
  console.log(
    testPassed2
      ? chalk.green(`${testId2} Test passed`)
      : chalk.red(`${testId2} Test failed`),
    chalk.white(testDesc2),
  );

  // Caso de prueba U-10.3: PlantUML adecuado para estructuras que utilizan el operador lógico NOT
  const jsonNot = [
    {
      id: 'Animal',
      type: 'ShapeNot',
      shapeExpr: { type: 'NodeConstraint', datatype: 'Canario' },
    },
  ];

  const expectedOutputNot = `@startuml
allowmixing
left to right direction
skinparam component {
BackgroundColor<<AND>> #1E3A8A
BorderColor<<AND>> #60A5FA
FontColor<<AND>> #E0F2FE

BackgroundColor<<NOT>> #F87171
BorderColor<<NOT>> #B91C1C
FontColor<<NOT>> #FFFFFF

BackgroundColor<<OR>> #065F46
BorderColor<<OR>> #6EE7B7
FontColor<<OR>> #D1FAE5
}

skinparam {
Shadowing true
RoundCorner 15
}

class Animal {}
component [ ] as NOT_1 <<NOT>>
Animal --> NOT_1
class "Canario" as Canario_2 {}
NOT_1 --> Canario_2
@enduml`;

  const generatorNot = new PlantUMLGenerator(jsonNot, '');
  const resultNot = generatorNot.generate();
  const normalizedResultNot = normalizeIds(resultNot);
  const normalizedExpectedOutputNot = normalizeIds(expectedOutputNot);
  const testId3 = 'U-10.3';
  const testDesc3 =
    'PlantUML adecuado para estructuras que utilizan el operador lógico NOT';
  const testPassed3 = normalizedResultNot === normalizedExpectedOutputNot;
  console.log(
    testPassed3
      ? chalk.green(`${testId3} Test passed`)
      : chalk.red(`${testId3} Test failed`),
    chalk.white(testDesc3),
  );

  // Caso de prueba U-10.4: Generar código para nodo START
  const jsonStart = [
    {
      id: 'start',
      type: 'UniqueStart',
      shapeExpr: 'taxon',
    },
  ];

  const umlReceived = `classDiagram
class _taxon {
EXTRA [ wdt:P31 ]
rdfs_label "[ @en ,@es  ]" ;
wdt_P31 "[ wd:Q16521 ]" ;
}
_therapeutic_use --> " *" _pharmaceutical_product : wdt_P37811
_therapeutic_use --> " *" _disease : wdt_P21752
class _therapeutic_use {
EXTRA [ wdt:P31 ]
rdfs_label "[ @en ,@es  ]" ;
wdt_P31 "[ wd:Q50379781 ]" ;
}`;

  const expectedOutputStart = `@startuml
allowmixing
left to right direction
skinparam component {
BackgroundColor<<AND>> #1E3A8A
BorderColor<<AND>> #60A5FA
FontColor<<AND>> #E0F2FE

BackgroundColor<<NOT>> #F87171
BorderColor<<NOT>> #B91C1C
FontColor<<NOT>> #FFFFFF

BackgroundColor<<OR>> #065F46
BorderColor<<OR>> #6EE7B7
FontColor<<OR>> #D1FAE5
}

skinparam {
Shadowing true
RoundCorner 15
}

component "Start" as start
class "taxon" {
EXTRA [ wdt:P31 ]
rdfs_label "[ @en ,@es  ]"
wdt_P31 "[ wd:Q16521 ]"

}
start --> "taxon"
@enduml`;

  const generatorStart = new PlantUMLGenerator(jsonStart, umlReceived);
  const resultStart = generatorStart.generate();
  const normalizedResultStart = normalizeIds(resultStart);
  const normalizedExpectedOutputStart = normalizeIds(expectedOutputStart);
  const testId4 = 'U-10.4';
  const testDesc4 = 'Generar código para nodo START';
  const testPassed4 = normalizedResultStart === normalizedExpectedOutputStart;
  console.log(
    testPassed4
      ? chalk.green(`${testId4} Test passed`)
      : chalk.red(`${testId4} Test failed`),
    chalk.white(testDesc4),
  );

  // Caso de prueba U-10.5: Nodo vacío
  // Caso de prueba U-10.5: Nodo vacío
  const jsonEmptyNode = [
    {
      id: 'Usuario',
      type: 'ShapeNot',
      shapeExpr: {
        type: 'Shape',
        expression: {
          type: 'EachOf',
          expressions: [
            {
              type: 'TripleConstraint',
              predicate: 'capacidad',
              valueExpr: { type: 'NodeConstraint', values: ['volar'] },
            },
            {
              type: 'TripleConstraint',
              predicate: 'estaVivo',
              valueExpr: {
                type: 'NodeConstraint',
                values: [{ value: 'false', type: 'boolean' }],
              },
            },
          ],
        },
      },
    },
  ];

  const expectedOutputEmptyNode = `@startuml
allowmixing
left to right direction
skinparam component {
BackgroundColor<<AND>> #1E3A8A
BorderColor<<AND>> #60A5FA
FontColor<<AND>> #E0F2FE

BackgroundColor<<NOT>> #F87171
BorderColor<<NOT>> #B91C1C
FontColor<<NOT>> #FFFFFF

BackgroundColor<<OR>> #065F46
BorderColor<<OR>> #6EE7B7
FontColor<<OR>> #D1FAE5
}

skinparam {
Shadowing true
RoundCorner 15
}

class Usuario {}
component [ ] as NOT_1 <<NOT>>
Usuario --> NOT_1
class Blank_1 {
:capacidad [ :volar ]
:estaVivo [ false ]
}
NOT_1 --> Blank_1
@enduml`;

  const generatorEmptyNode = new PlantUMLGenerator(jsonEmptyNode, '');
  const resultEmptyNode = generatorEmptyNode.generate();

  const normalizedResultEmptyNode = normalizeIds(resultEmptyNode);
  const normalizedExpectedOutputEmptyNode = normalizeIds(
    expectedOutputEmptyNode,
  );

  const testId5 = 'U-10.5';
  const testDesc5 = 'Nodo vacío';
  const testPassed5 =
    normalizedResultEmptyNode === normalizedExpectedOutputEmptyNode;
  console.log(
    testPassed5
      ? chalk.green(`${testId5} Test passed`)
      : chalk.red(`${testId5} Test failed`),
    chalk.white(testDesc5),
  );

  // Imprimir los resultados normalizados para depuración
  if (!testPassed5) {
    console.log(
      chalk.blue('Normalized Generated Output:\n'),
      normalizedResultEmptyNode,
    );
    console.log(
      chalk.blue('Normalized Expected Output:\n'),
      normalizedExpectedOutputEmptyNode,
    );
  }

  // Caso de prueba U-10.6: Nodo con clase definida
  const jsonDefinedClassNode = [
    {
      id: 'Usuario',
      type: 'ShapeNot',
      shapeExpr: 'Mujer',
    },
  ];

  const umlReceivedDefinedClassNode = `classDiagram
_Mujer --> " *" _Canario : _mascota1
_Mujer --> "" _Perro : _mascota2
_Mujer --> "" _Hombre : _pareja3
class _Mujer {
_genero "[ :Femenino ]" ;
_nombre "xsd_string" ;
_edad "xsd_integer" ;
}`;

  const expectedOutputDefinedClassNode = `@startuml
allowmixing
left to right direction
skinparam component {
BackgroundColor<<AND>> #1E3A8A
BorderColor<<AND>> #60A5FA
FontColor<<AND>> #E0F2FE

BackgroundColor<<NOT>> #F87171
BorderColor<<NOT>> #B91C1C
FontColor<<NOT>> #FFFFFF

BackgroundColor<<OR>> #065F46
BorderColor<<OR>> #6EE7B7
FontColor<<OR>> #D1FAE5
}

skinparam {
Shadowing true
RoundCorner 15
}

class Usuario {}
component [ ] as NOT_1 <<NOT>>
Usuario --> NOT_1
class Mujer {
_genero "[ :Femenino ]"
_nombre "xsd_string"
_edad "xsd_integer"

}
NOT_1 --> Mujer
@enduml`;

  const generatorDefinedClassNode = new PlantUMLGenerator(
    jsonDefinedClassNode,
    umlReceivedDefinedClassNode,
  );
  const resultDefinedClassNode = generatorDefinedClassNode.generate();

  const normalizedResultDefinedClassNode = normalizeIds(resultDefinedClassNode);
  const normalizedExpectedOutputDefinedClassNode = normalizeIds(
    expectedOutputDefinedClassNode,
  );

  const testId6 = 'U-10.6';
  const testDesc6 = 'Nodo con clase definida';
  const testPassed6 =
    normalizedResultDefinedClassNode ===
    normalizedExpectedOutputDefinedClassNode;
  console.log(
    testPassed6
      ? chalk.green(`${testId6} Test passed`)
      : chalk.red(`${testId6} Test failed`),
    chalk.white(testDesc6),
  );

  // Imprimir los resultados normalizados para depuración
  if (!testPassed6) {
    console.log(
      chalk.blue('Normalized Generated Output:\n'),
      normalizedResultDefinedClassNode,
    );
    console.log(
      chalk.blue('Normalized Expected Output:\n'),
      normalizedExpectedOutputDefinedClassNode,
    );
  }

  // Caso de prueba U-10.7: Nodo EachOf
  const jsonEachOfNode = [
    {
      id: 'Persona',
      type: 'ShapeNot',
      shapeExpr: {
        type: 'Shape',
        expression: {
          type: 'EachOf',
          expressions: [
            {
              type: 'TripleConstraint',
              predicate: 'vive',
              valueExpr: { type: 'NodeConstraint', values: ['Oviedo'] },
            },
            {
              type: 'TripleConstraint',
              predicate: 'estaVivo',
              valueExpr: {
                type: 'NodeConstraint',
                values: [{ value: 'false', type: 'boolean' }],
              },
            },
          ],
        },
      },
    },
    {
      id: 'Usuario',
      type: 'ShapeAnd',
      shapeExprs: [
        { type: 'NodeConstraint', datatype: 'cliente' },
        {
          type: 'Shape',
          expression: {
            type: 'TripleConstraint',
            predicate: 'estado',
            valueExpr: { type: 'NodeConstraint', values: ['activo'] },
          },
        },
      ],
    },
  ];

  const expectedOutputEachOfNode = `@startuml
allowmixing
left to right direction
skinparam component {
BackgroundColor<<AND>> #1E3A8A
BorderColor<<AND>> #60A5FA
FontColor<<AND>> #E0F2FE

BackgroundColor<<NOT>> #F87171
BorderColor<<NOT>> #B91C1C
FontColor<<NOT>> #FFFFFF

BackgroundColor<<OR>> #065F46
BorderColor<<OR>> #6EE7B7
FontColor<<OR>> #D1FAE5
}

skinparam {
Shadowing true
RoundCorner 15
}

class Persona {}
component [ ] as NOT_1 <<NOT>>
Persona --> NOT_1
class Blank_1 {
:vive [ :Oviedo ]
:estaVivo [ false ]
}
NOT_1 --> Blank_1
class Usuario {}
component [ ] as AND_2 <<AND>>
Usuario --> AND_2
class "cliente" as cliente_3 {}
AND_2 --> cliente_3
class Blank_2 {
:estado [ :activo ]
}
AND_2 --> Blank_2
@enduml`;

  const generatorEachOfNode = new PlantUMLGenerator(jsonEachOfNode, '');
  const resultEachOfNode = generatorEachOfNode.generate();

  const normalizedResultEachOfNode = normalizeIds(resultEachOfNode);
  const normalizedExpectedOutputEachOfNode = normalizeIds(
    expectedOutputEachOfNode,
  );

  const testId7 = 'U-10.7';
  const testDesc7 = 'Nodo EachOf';
  const testPassed7 =
    normalizedResultEachOfNode === normalizedExpectedOutputEachOfNode;
  console.log(
    testPassed7
      ? chalk.green(`${testId7} Test passed`)
      : chalk.red(`${testId7} Test failed`),
    chalk.white(testDesc7),
  );

  // Imprimir los resultados normalizados para depuración
  if (!testPassed7) {
    console.log(
      chalk.blue('Normalized Generated Output:\n'),
      normalizedResultEachOfNode,
    );
    console.log(
      chalk.blue('Normalized Expected Output:\n'),
      normalizedExpectedOutputEachOfNode,
    );
  }

  // Caso de prueba U-10.8: Nodo TripleConstraint
  const jsonTripleConstraintNode = [
    {
      id: 'Persona',
      type: 'ShapeNot',
      shapeExpr: {
        type: 'Shape',
        expression: {
          type: 'EachOf',
          expressions: [
            {
              type: 'TripleConstraint',
              predicate: 'vive',
              valueExpr: { type: 'NodeConstraint', values: ['Luarca'] },
            },
            {
              type: 'TripleConstraint',
              predicate: 'estaVivo',
              valueExpr: {
                type: 'NodeConstraint',
                values: [{ value: 'true', type: 'boolean' }],
              },
            },
          ],
        },
      },
    },
  ];

  const expectedOutputTripleConstraintNode = `@startuml
allowmixing
left to right direction
skinparam component {
BackgroundColor<<AND>> #1E3A8A
BorderColor<<AND>> #60A5FA
FontColor<<AND>> #E0F2FE

BackgroundColor<<NOT>> #F87171
BorderColor<<NOT>> #B91C1C
FontColor<<NOT>> #FFFFFF

BackgroundColor<<OR>> #065F46
BorderColor<<OR>> #6EE7B7
FontColor<<OR>> #D1FAE5
}

skinparam {
Shadowing true
RoundCorner 15
}

class Persona {}
component [ ] as NOT_1 <<NOT>>
Persona --> NOT_1
class Blank_1 {
:vive [ :Luarca ]
:estaVivo [ true ]
}
NOT_1 --> Blank_1
@enduml`;

  const generatorTripleConstraintNode = new PlantUMLGenerator(
    jsonTripleConstraintNode,
    '',
  );
  const resultTripleConstraintNode = generatorTripleConstraintNode.generate();

  const normalizedResultTripleConstraintNode = normalizeIds(
    resultTripleConstraintNode,
  );
  const normalizedExpectedOutputTripleConstraintNode = normalizeIds(
    expectedOutputTripleConstraintNode,
  );

  const testId8 = 'U-10.8';
  const testDesc8 = 'Nodo TripleConstraint \n';
  const testPassed8 =
    normalizedResultTripleConstraintNode ===
    normalizedExpectedOutputTripleConstraintNode;
  console.log(
    testPassed8
      ? chalk.green(`${testId8} Test passed`)
      : chalk.red(`${testId8} Test failed`),
    chalk.white(testDesc8),
  );

  // Imprimir los resultados normalizados para depuración
  if (!testPassed8) {
    console.log(
      chalk.blue('Normalized Generated Output:\n\n'),
      normalizedResultTripleConstraintNode,
    );
    console.log(
      chalk.blue('Normalized Expected Output:\n'),
      normalizedExpectedOutputTripleConstraintNode,
    );
  }

  await browser.close();
})();
