const puppeteer = require('puppeteer');
const { PlantUMLGenerator } = require('../../src/PlantUmlGenerator'); // Ajusta la ruta a tu archivo
const chalk = require('chalk');

function normalizeIds(uml) {
  let idCounter = 1;
  return uml.replace(/(_[a-z0-9]+)+/g, () => ``);
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
component [ ] as AND <<AND>>
Animal --> AND
class "Canario" {}
AND --> Canario
class "Perro" {}
AND --> Perro
@enduml`;

  const generatorAnd = new PlantUMLGenerator(jsonAnd, '');
  const resultAnd = generatorAnd.generate();
  const normalizedResultAnd = normalizeIds(resultAnd);
  const normalizedExpectedOutputAnd = expectedOutputAnd;
  const testId1 = 'U-10.1';
  const testDesc1 =
    'PlantUML para estructuras que utilizan el operador lógico AND';
  const testPassed1 = normalizedResultAnd === normalizedExpectedOutputAnd;

  if (!testPassed1) {
    console.log(
      chalk.blue('Normalized Generated Output:\n\n'),
      normalizedResultAnd,
    );
    console.log(
      chalk.blue('Normalized Expected Output:\n'),
      normalizedExpectedOutputAnd,
    );
  }
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
component [ ] as OR <<OR>>
Animal --> OR
class "Canario" {}
OR --> Canario
class "Perro" {}
OR --> Perro
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
  if (!testPassed2) {
    console.log(
      chalk.blue('Normalized Generated Output:\n\n'),
      normalizedResultOr,
    );
    console.log(
      chalk.blue('Normalized Expected Output:\n'),
      normalizedExpectedOutputOr,
    );
  }

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
component [ ] as NOT <<NOT>>
Animal --> NOT
class "Canario" {}
NOT --> Canario
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
  if (!testPassed3) {
    console.log(
      chalk.blue('Normalized Generated Output:\n\n'),
      normalizedResultNot,
    );
    console.log(
      chalk.blue('Normalized Expected Output:\n'),
      normalizedExpectedOutputNot,
    );
  }

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
  const normalizedResultStart = resultStart;
  const normalizedExpectedOutputStart = expectedOutputStart;
  const testId4 = 'U-10.4';
  const testDesc4 = 'Generar código para nodo START';
  const testPassed4 = normalizedResultStart === normalizedExpectedOutputStart;
  console.log(
    testPassed4
      ? chalk.green(`${testId4} Test passed`)
      : chalk.red(`${testId4} Test failed`),
    chalk.white(testDesc4),
  );
  if (!testPassed4) {
    console.log(
      chalk.blue('Normalized Generated Output:\n\n'),
      normalizedResultStart,
    );
    console.log(
      chalk.blue('Normalized Expected Output:\n'),
      normalizedExpectedOutputStart,
    );
  }

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
component [ ] as NOT <<NOT>>
Usuario --> NOT
class Blank {
:capacidad [ :volar ]
:estaVivo [ false ]
}
NOT --> Blank
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
  if (!testPassed4) {
    console.log(
      chalk.blue('Normalized Generated Output:\n\n'),
      normalizedResultEmptyNode,
    );
    console.log(
      chalk.blue('Normalized Expected Output:\n'),
      normalizedExpectedOutputEmptyNode,
    );
  }
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
component [ ] as NOT <<NOT>>
Usuario --> NOT
class Mujer {
 "[ :Femenino ]"
 "xsd"
 "xsd"

}
NOT --> Mujer
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
component [ ] as NOT <<NOT>>
Persona --> NOT
class Blank {
:vive [ :Oviedo ]
:estaVivo [ false ]
}
NOT --> Blank
class Usuario {}
component [ ] as AND <<AND>>
Usuario --> AND
class "cliente" {}
AND --> cliente
class Blank {
:estado [ :activo ]
}
AND --> Blank
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
component [ ] as NOT <<NOT>>
Persona --> NOT
class Blank {
:vive [ :Luarca ]
:estaVivo [ true ]
}
NOT --> Blank
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
  const testDesc8 = 'Nodo TripleConstraint ';
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

  // Caso de prueba U-10.9: Nodo con varios tipos de expresiones lógicas combinadas
  const jsonComplexNode = [
    {
      id: 'lu',
      type: 'ShapeAnd',
      shapeExprs: [
        { type: 'NodeConstraint', datatype: 'cliente' },
        {
          type: 'Shape',
          expression: {
            type: 'TripleConstraint',
            predicate: 'estado',
            valueExpr: {
              type: 'ShapeNot',
              shapeExpr: { type: 'NodeConstraint', values: ['activo'] },
            },
          },
        },
      ],
    },
  ];

  const expectedOutputComplexNode = `@startuml
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

class lu {}
component [ ] as AND_ly747e9y <<AND>>
lu --> AND_ly747e9y
class "cliente" {}
AND_ly747e9y --> cliente
component [ ] as NOT_ly747e9z <<NOT>>
estado_value --> NOT_ly747e9z
class "Blank_1" {
values: activo
}
NOT_ly747e9z --> Blank_1
class Blank_2 {
:estado [ estado_value ]
}
AND_ly747e9y --> Blank_2
@enduml`;

  const generatorComplexNode = new PlantUMLGenerator(jsonComplexNode, '');
  const resultComplexNode = generatorComplexNode.generate();

  const normalizedResultComplexNode = normalizeIds(resultComplexNode);
  const normalizedExpectedOutputComplexNode = normalizeIds(
    expectedOutputComplexNode,
  );

  const testId9 = 'U-10.9';
  const testDesc9 = 'Nodo con varios tipos de expresiones lógicas combinadas';
  const testPassed9 =
    normalizedResultComplexNode === normalizedExpectedOutputComplexNode;
  console.log(
    testPassed9
      ? chalk.green(`${testId9} Test passed`)
      : chalk.red(`${testId9} Test failed`),
    chalk.white(testDesc9),
  );

  // Imprimir los resultados normalizados para depuración
  if (!testPassed9) {
    console.log(
      chalk.blue('Normalized Generated Output:\n\n'),
      normalizedResultComplexNode,
    );
    console.log(
      chalk.blue('Normalized Expected Output:\n'),
      normalizedExpectedOutputComplexNode,
    );
  }

  // Caso de prueba U-10.10: Nodo con más niveles de anidación
  const jsonNestedNode = [
    {
      id: 'condiciones',
      type: 'ShapeAnd',
      shapeExprs: [
        {
          type: 'Shape',
          expression: {
            type: 'TripleConstraint',
            predicate: 'asistencia_minima',
            valueExpr: {
              type: 'NodeConstraint',
              values: ['80'],
            },
          },
        },
        {
          type: 'Shape',
          expression: {
            type: 'TripleConstraint',
            predicate: 'nota_minima',
            valueExpr: {
              type: 'ShapeOr',
              shapeExprs: [
                {
                  type: 'Shape',
                  expression: {
                    type: 'TripleConstraint',
                    predicate: 'laboratorio',
                    valueExpr: {
                      type: 'NodeConstraint',
                      values: ['5'],
                    },
                  },
                },
                {
                  type: 'Shape',
                  expression: {
                    type: 'TripleConstraint',
                    predicate: 'teoria',
                    valueExpr: {
                      type: 'NodeConstraint',
                      values: ['5'],
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
    {
      id: 'evaluacion',
      type: 'ShapeAnd',
      shapeExprs: [
        {
          type: 'Shape',
          expression: {
            type: 'TripleConstraint',
            predicate: 'nota',
            valueExpr: {
              type: 'NodeConstraint',
              values: [],
            },
          },
        },
        {
          type: 'Shape',
          expression: {
            type: 'TripleConstraint',
            predicate: 'asistencia',
            valueExpr: {
              type: 'NodeConstraint',
              values: [],
            },
          },
        },
      ],
    },
    {
      id: 'asignatura',
      type: 'ShapeAnd',
      shapeExprs: [
        { type: 'NodeConstraint', datatype: 'condiciones' },
        { type: 'NodeConstraint', datatype: 'evaluacion' },
      ],
    },
  ];

  const expectedOutputNestedNode = `@startuml
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

class condiciones {}
component [ ] as AND_ly74bm47 <<AND>>
condiciones --> AND_ly74bm47
class Blank_1 {
:asistencia_minima [ :80 ]
}
AND_ly74bm47 --> Blank_1
component [ ] as SHAPEOR_ly74bm48 <<OR>>
nota_minima_value --> SHAPEOR_ly74bm48
class Blank_2 {
:laboratorio [ :5 ]
}
SHAPEOR_ly74bm48 --> Blank_2
class Blank_3 {
:teoria [ :5 ]
}
SHAPEOR_ly74bm48 --> Blank_3
class Blank_4 {
:nota_minima [ nota_minima_value ]
}
AND_ly74bm47 --> Blank_4
class evaluacion {}
component [ ] as AND_ly74bm49 <<AND>>
evaluacion --> AND_ly74bm49
class Blank_5 {
:nota [  ]
}
AND_ly74bm49 --> Blank_5
class Blank_6 {
:asistencia [  ]
}
AND_ly74bm49 --> Blank_6
class asignatura {}
component [ ] as AND_ly74bm4a <<AND>>
asignatura --> AND_ly74bm4a
class "condiciones" {}
AND_ly74bm4a --> condiciones
class "evaluacion" {}
AND_ly74bm4a --> evaluacion
@enduml`;

  const generatorNestedNode = new PlantUMLGenerator(jsonNestedNode, '');
  const resultNestedNode = generatorNestedNode.generate();

  const normalizedResultNestedNode = normalizeIds(resultNestedNode);
  const normalizedExpectedOutputNestedNode = normalizeIds(
    expectedOutputNestedNode,
  );

  const testId10 = 'U-10.10';
  const testDesc10 = 'Nodo con más niveles de anidación \n';
  const testPassed10 =
    normalizedResultNestedNode === normalizedExpectedOutputNestedNode;
  console.log(
    testPassed10
      ? chalk.green(`${testId10} Test passed`)
      : chalk.red(`${testId10} Test failed`),
    chalk.white(testDesc10),
  );

  // Imprimir los resultados normalizados para depuración
  if (!testPassed10) {
    console.log(
      chalk.blue('Normalized Generated Output:\n\n'),
      normalizedResultNestedNode,
    );
    console.log(
      chalk.blue('Normalized Expected Output:\n'),
      normalizedExpectedOutputNestedNode,
    );
  }

  await browser.close();
})();
