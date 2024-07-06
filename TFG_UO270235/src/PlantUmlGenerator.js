const uniqid = require('uniqid');

/**
 * Clase para generar PlantUML a partir de JSON y UML.
 */
class PlantUMLGenerator {
  /**
   * Crea una instancia de PlantUMLGenerator.
   * @param {Object} json - El JSON que representa las formas.
   * @param {string} umlText - El texto UML inicial.
   */
  constructor(json, umlText) {
    this.umlText = '';
    console.log('acaaaaa----------------------------->');
    console.log(JSON.stringify(json));
    this.json = json;
    if (umlText != undefined) this.umlText = umlText;
    this.counter = 0;
    this.counterBlank = 1;
    this.output = [];
    this.processedClasses = new Set();
    this.initializeSkinParams();
  }

  /**
   * Inicializa los parámetros de estilo para PlantUML.
   */
  initializeSkinParams() {
    this.output.push('@startuml');
    this.output.push('allowmixing');
    this.output.push('left to right direction');

    this.output.push('skinparam component {');
    this.output.push('BackgroundColor<<AND>> #1E3A8A');
    this.output.push('BorderColor<<AND>> #60A5FA');
    this.output.push('FontColor<<AND>> #E0F2FE');
    this.output.push('');
    this.output.push('BackgroundColor<<NOT>> #F87171');
    this.output.push('BorderColor<<NOT>> #B91C1C');
    this.output.push('FontColor<<NOT>> #FFFFFF');
    this.output.push('');
    this.output.push('BackgroundColor<<OR>> #065F46');
    this.output.push('BorderColor<<OR>> #6EE7B7');
    this.output.push('FontColor<<OR>> #D1FAE5');
    this.output.push('}');
    this.output.push('');
    this.output.push('skinparam {');
    this.output.push('Shadowing true');
    this.output.push('RoundCorner 15');
    this.output.push('}');
    this.output.push('');
  }

  /**
   * Genera el diagrama UML.
   * @returns {string} - El diagrama UML generado.
   */
  generate() {
    this.json.forEach((node) => {
      if (node.id === 'start') {
        this.output.push(`component "Start" as start`);
        if (node.type === 'UniqueStart') {
          if (typeof node.shapeExpr === 'string') {
            const attributes = this.extractAttributes(node.shapeExpr);
            this.output.push(`class "${node.shapeExpr}" {\n${attributes}\n}`);
            this.output.push(`start --> "${node.shapeExpr}"`);
          } else {
            this.processNode(node.shapeExpr, 'start');
          }
        }
      } else {
        this.output.push(`class ${node.id} {}`);
      }
      this.processNode(node, node.id);
    });
    this.output.push('@enduml');
    return this.output.join('\n');
  }

  /**
   * Procesa un nodo y lo añade al diagrama.
   * @param {Object|string} node - El nodo a procesar.
   * @param {string} parentId - El ID del nodo padre.
   */
  /**
   * Procesa un nodo y lo añade al diagrama.
   * @param {Object|string} node - El nodo a procesar.
   * @param {string} parentId - El ID del nodo padre.
   */
  processNode(node, parentId) {
    if (typeof node === 'string') {
      if (node === '') {
        const blankId = `Blank_${this.counterBlank++}`;
        this.output.push(`class ${blankId} {}`);
        this.output.push(`${parentId} --> ${blankId}`);
      } else {
        if (!this.processedClasses.has(node)) {
          this.output.push(
            `class ${node} {\n${this.extractAttributes(node)}\n}`,
          );
          this.processedClasses.add(node);
        }
        this.output.push(`${parentId} --> ${node}`);
      }
    } else if (
      node.type === 'ShapeOr' ||
      node.type === 'ShapeAnd' ||
      node.type === 'ShapeNot'
    ) {
      const typeLabel = node.type.replace('Shape', '').toUpperCase(); // Convert to AND, OR, NOT
      const id = `${typeLabel}_${uniqid()}`;
      this.output.push(`component [ ] as ${id} <<${typeLabel}>>`);
      if (parentId) {
        this.output.push(`${parentId} --> ${id}`);
      }
      if (node.shapeExprs && Array.isArray(node.shapeExprs)) {
        node.shapeExprs.forEach((child) => {
          this.processNode(child, id);
        });
      } else if (node.shapeExpr && Array.isArray(node.shapeExpr)) {
        node.shapeExpr.forEach((child) => {
          this.processNode(child, id);
        });
      } else if (node.shapeExpr) {
        this.processNode(node.shapeExpr, id);
      } else {
        const blankId = `Blank_${this.counterBlank++}`;
        this.output.push(`class ${blankId} {}`);
        this.output.push(`${id} --> ${blankId}`);
      }
    } else if (node.type === 'NodeConstraint') {
      const className = node.datatype
        ? this.extractClassName(node.datatype)
        : `Blank_${this.counterBlank++}`;
      if (node.values && node.values.length > 0) {
        const values = node.values
          .map((val) => (typeof val === 'string' ? val : val.value))
          .join(', ');
        this.output.push(`class "${className}" {\nvalues: ${values}\n}`);
      } else {
        this.output.push(`class "${className}" {}`);
      }
      if (parentId) {
        this.output.push(`${parentId} --> ${className}`);
      }
    } else if (node.type === 'Shape' && node.expression) {
      if (node.expression.type === 'TripleConstraint') {
        this.processTripleConstraint(node.expression, parentId);
      } else if (node.expression.type === 'EachOf') {
        this.processEachOf(node.expression, parentId);
      }
    } else if (node.type === 'Shape' && !node.expression) {
      const blankId = `Blank_${this.counterBlank++}`;
      this.output.push(`class ${blankId} {}`);
      if (parentId) {
        this.output.push(`${parentId} --> ${blankId}`);
      }
    } else if (Array.isArray(node.shapeExpr)) {
      node.shapeExpr.forEach((child) => {
        this.processNode(child, parentId);
      });
    }
  }

  /**
   * Procesa una expresión de restricción triple.
   * @param {Object} expression - La expresión de restricción triple.
   * @param {string} parentId - El ID del nodo padre.
   */
  /**
   * Procesa una expresión de restricción triple.
   * @param {Object} expression - La expresión de restricción triple.
   * @param {string} parentId - El ID del nodo padre.
   */
  processTripleConstraint(expression, parentId) {
    let attribute = `:${expression.predicate} [ `;
    let attributeId = `${expression.predicate}_value`; // Usar nombre específico para el predicado

    if (expression.valueExpr) {
      if (
        expression.valueExpr.type === 'NodeConstraint' &&
        expression.valueExpr.values
      ) {
        const values = expression.valueExpr.values
          .map((val) => (typeof val === 'string' ? `:${val}` : val.value))
          .join(', ');
        attribute += `${values} ]`;
      } else if (expression.valueExpr.type) {
        if (
          expression.valueExpr.type === 'ShapeAnd' ||
          expression.valueExpr.type === 'ShapeOr'
        ) {
          const nestedNodeId = `${expression.valueExpr.type.toUpperCase()}_${uniqid()}`;
          this.output.push(
            `component [ ] as ${nestedNodeId} <<${expression.valueExpr.type
              .replace('Shape', '')
              .toUpperCase()}>>`,
          );
          this.output.push(`${attributeId} --> ${nestedNodeId}`);
          if (Array.isArray(expression.valueExpr.shapeExprs)) {
            expression.valueExpr.shapeExprs.forEach((child) => {
              this.processNode(child, nestedNodeId);
            });
          }
          attribute += `${attributeId} ]`;
        } else if (expression.valueExpr.type === 'ShapeNot') {
          const notNodeId = `NOT_${uniqid()}`;
          this.output.push(`component [ ] as ${notNodeId} <<NOT>>`);
          this.output.push(`${attributeId} --> ${notNodeId}`);
          this.processNode(expression.valueExpr.shapeExpr, notNodeId);
          attribute += `${attributeId} ]`;
        } else {
          const nestedNodeId = `${expression.predicate}_value`; // Usar nombre específico para el predicado
          this.processNode(expression.valueExpr, nestedNodeId);
          attributeId = `:${expression.predicate} [ ${nestedNodeId} ]`;
          attribute += `${nestedNodeId} ]`;
        }
      }
    } else {
      attribute += ']';
    }

    const blankId = `Blank_${this.counterBlank}`;
    this.output.push(`class ${blankId} {\n${attribute}\n}`);
    if (parentId) {
      this.output.push(`${parentId} --> ${blankId}`);
    }
    if (
      expression.valueExpr &&
      (expression.valueExpr.type === 'ShapeAnd' ||
        expression.valueExpr.type === 'ShapeOr' ||
        expression.valueExpr.type === 'ShapeNot')
    ) {
      // this.output.push(`${blankId} --> ${expression.predicate}_value`);
    }
    this.counterBlank++;
  }

  /**
   * Procesa una expresión de tipo "EachOf".
   * @param {Object} expression - La expresión "EachOf".
   * @param {string} parentId - El ID del nodo padre.
   */
  processEachOf(expression, parentId) {
    const uniqueId = `Blank_${this.counterBlank++}`;
    const attributes = expression.expressions
      .map((expr) => {
        if (expr.type === 'TripleConstraint') {
          let attribute = `:${expr.predicate} [ `;
          let attributeId = `${expr.predicate}_value`;
          if (expr.valueExpr) {
            if (
              expr.valueExpr.type === 'NodeConstraint' &&
              expr.valueExpr.values
            ) {
              const values = expr.valueExpr.values
                .map((val) => (typeof val === 'string' ? `:${val}` : val.value))
                .join(', ');
              attribute += `${values} ]`;
            } else if (expr.valueExpr.type) {
              if (
                expr.valueExpr.type === 'ShapeAnd' ||
                expr.valueExpr.type === 'ShapeOr'
              ) {
                const nestedNodeId = `${expr.valueExpr.type.toUpperCase()}_${uniqid()}`;
                this.output.push(
                  `component [ ] as ${nestedNodeId} <<${expr.valueExpr.type
                    .replace('Shape', '')
                    .toUpperCase()}>>`,
                );
                this.output.push(`${attributeId} --> ${nestedNodeId}`);
                if (Array.isArray(expr.valueExpr.shapeExprs)) {
                  expr.valueExpr.shapeExprs.forEach((child) => {
                    this.processNode(child, nestedNodeId);
                  });
                }
                attribute += `${attributeId} ]`;
              } else if (expr.valueExpr.type === 'ShapeNot') {
                const notNodeId = `NOT_${uniqid()}`;
                this.output.push(`component [ ] as ${notNodeId} <<NOT>>`);
                this.output.push(`${attributeId} --> ${notNodeId}`);
                this.processNode(expr.valueExpr.shapeExpr, notNodeId);
                attribute += `${attributeId} ]`;
              } else {
                const nestedNodeId = `${expr.predicate}_value`; // Usar nombre específico para el predicado
                this.processNode(expr.valueExpr, nestedNodeId);
                attribute += `${nestedNodeId} ]`;
              }
            }
          } else {
            attribute += ']';
          }
          return { attribute, attributeId };
        }
        return null;
      })
      .filter(Boolean);

    const attributeString = attributes.map((attr) => attr.attribute).join('\n');
    this.output.push(`class ${uniqueId} {\n${attributeString}\n}`);
    if (parentId) {
      this.output.push(`${parentId} --> ${uniqueId}`);
    }
  }

  /**
   * Extrae los atributos de una clase del texto UML.
   * @param {string} className - El nombre de la clase.
   * @returns {string} - Los atributos extraídos.
   */
  extractAttributes(className) {
    const regex = new RegExp(
      `class (_?${className}_?|ex_${className}) \\{([^}]*)\\}`,
      's',
    );
    const match = this.umlText.match(regex);

    if (match && match[2]) {
      return match[2]
        .trim()
        .split(';')
        .map((attr) => attr.trim())
        .join('\n');
    } else {
      return '';
    }
  }

  /**
   * Extrae el nombre simple de una URI.
   * @param {string} uri - La URI.
   * @returns {string} - El nombre simple.
   */
  extractClassName(uri) {
    const parts = uri.split('#');
    return parts.length > 1 ? parts[1] : parts[0];
  }
}

module.exports = { PlantUMLGenerator };
