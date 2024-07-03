// tests/test_unitarios/U10.test.mjs
import chai from 'chai';
import { PlantUMLGenerator } from '../../src/PlantUMLGenerator.mjs'; // Ajusta la ruta a tu archivo

const { expect } = chai;

describe('PlantUMLGenerator', () => {
  it('should generate the correct UML diagram for the given JSON and UML text', () => {
    const json = [
      {
        id: 'isMemberOf',
        type: 'ShapeAnd',
        shapeExprs: [
          'Library',
          {
            type: 'ShapeNot',
            shapeExpr: {
              type: 'Shape',
              expression: {
                type: 'TripleConstraint',
                predicate: 'isBanned',
                valueExpr: {
                  type: 'NodeConstraint',
                  values: [{ value: 'true', type: 'boolean' }],
                },
              },
            },
          },
        ],
      },
    ];

    const umlText = `classDiagram
_Book --> "" _Author : _author1
_Book --> "" _Genre : _genre2
class _Book {
_name "xsd_string" ;
_datePublished "xsd_date" ;
_isbn "xsd_string" ;
_about "xsd_string *" ;
}
_Author --> " *" _Book : _authorOf3
class _Author {
_name "xsd_string" ;
_birthDate "xsd_date" ;
_nationality "xsd_string" ;
}
_Genre --> " *" _SubGenre : _genre4
class _Genre {
_name "xsd_string" ;
}
class _SubGenre {
_name "xsd_string" ;
}
_Library --> " *" _Book : _hasBook5
_Library --> " *" _BorrowingEvent : _hasBorrowingEvent6
class _Library {
_libraryName "xsd_string" ;
}
_BorrowingEvent --> "" _User : _borrower7
_BorrowingEvent --> "" _Book : _itemBorrowed8
class _BorrowingEvent {
_borrowDate "xsd_date" ;
_returnDate "xsd_date" ;
}
class _User {
_name "xsd_string" ;
}`;

    const expectedOutput = `@startuml
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

class isMemberOf {}
component [ ] as AND_ly50uh80 <<AND>>
isMemberOf --> AND_ly50uh80
class Library {
_libraryName "xsd_string"

}
AND_ly50uh80 --> Library
component [ ] as NOT_ly50uh81 <<NOT>>
AND_ly50uh80 --> NOT_ly50uh81
class Blank_1 {
:isBanned [ true ]
}
NOT_ly50uh81 --> Blank_1
@enduml`;

    const generator = new PlantUMLGenerator(json, umlText);
    const result = generator.generate();

    expect(result.trim()).to.equal(expectedOutput.trim());
  });
});
