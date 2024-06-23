const uniqid = require("uniqid");

export class PlantUMLGenerator {
    constructor(json, umlText) {
        this.json = json;
        this.umlText = umlText;
        this.counter = 0;
        this.counterBlank = 1;
        this.output = [];
        this.initializeSkinParams();
    }

    initializeSkinParams() {
        this.output.push("@startuml");
        this.output.push("allowmixing");
        this.output.push("left to right direction");  // Añadir la directiva de dirección

        this.output.push("skinparam component {");
        this.output.push("BackgroundColor<<AND>> #1E3A8A");
        this.output.push("BorderColor<<AND>> #60A5FA");
        this.output.push("FontColor<<AND>> #E0F2FE");
        this.output.push("");
        this.output.push("BackgroundColor<<NOT>> #F87171");
        this.output.push("BorderColor<<NOT>> #B91C1C");
        this.output.push("FontColor<<NOT>> #FFFFFF");
        this.output.push("");
        this.output.push("BackgroundColor<<OR>> #065F46");
        this.output.push("BorderColor<<OR>> #6EE7B7");
        this.output.push("FontColor<<OR>> #D1FAE5");
        this.output.push("}");
        this.output.push("");
        this.output.push("skinparam {");
        this.output.push("Shadowing true");
        this.output.push("RoundCorner 15");
        this.output.push("}");
        this.output.push("");
    }

    generate() {
        this.json.forEach(node => {
            this.output.push(`class ${node.id} {}`);
            this.output.push("");  // Añadir una línea en blanco después de cada clase

            this.processNode(node, node.id);
            this.output.push("");  // Añadir una línea en blanco después de cada procesamiento de nodo
        });
        this.output.push("@enduml");
        return this.output.join("\n");
    }

    processNode(node, parentId) {
        if (typeof node === 'string') {
            if (node === '') {
                const blankId = `Blank_${this.counterBlank++}`;
                this.output.push(`class ${blankId} {}`);
                this.output.push(`${parentId} --> ${blankId}`);
                this.output.push("");  // Añadir una línea en blanco después de la relación
            } else {
                this.output.push(`class ${node} {\n${this.extractAttributes(node)}\n}`);
                this.output.push(`${parentId} --> ${node}`);
                this.output.push("");  // Añadir una línea en blanco después de la relación
            }
        } else if (node.type === "ShapeOr" || node.type === "ShapeAnd" || node.type === "ShapeNot") {
            const typeLabel = node.type.replace('Shape', '').toUpperCase(); // Convert to AND, OR, NOT
            const id = `${typeLabel}_${uniqid()}`;
            this.output.push(`component [ ] as ${id} <<${typeLabel}>>`);
            if (parentId) {
                this.output.push(`${parentId} --> ${id}`);
                this.output.push("");  // Añadir una línea en blanco después de la relación
            }
            if (node.shapeExprs && Array.isArray(node.shapeExprs)) {
                node.shapeExprs.forEach(child => {
                    this.processNode(child, id);
                });
            } else if (node.shapeExpr && Array.isArray(node.shapeExpr)) {
                node.shapeExpr.forEach(child => {
                    this.processNode(child, id);
                });
            } else if (node.shapeExpr) {
                this.processNode(node.shapeExpr, id);
            } else {
                const blankId = `Blank_${this.counterBlank++}`;
                this.output.push(`class ${blankId} {}`);
                this.output.push(`${id} --> ${blankId}`);
                this.output.push("");  // Añadir una línea en blanco después de la relación
            }
        } else if (node.type === "NodeConstraint") {
            const className = node.datatype;
            if (className === '') {
                const blankId = `Blank_${this.counterBlank++}`;
                this.output.push(`class ${blankId} {}`);
                this.output.push(`${parentId} --> ${blankId}`);
                this.output.push("");  // Añadir una línea en blanco después de la relación
            } else {
                this.output.push(`class ${className} {}`);
                if (parentId) {
                    this.output.push(`${parentId} --> ${className}`);
                    this.output.push("");  // Añadir una línea en blanco después de la relación
                }
            }
        } else if (node.type === "Shape" && node.expression) {
            if (node.expression.type === "TripleConstraint") {
                this.processTripleConstraint(node.expression, parentId);
            } else if (node.expression.type === "EachOf") {
                this.processEachOf(node.expression, parentId);
            }
        } else if (Array.isArray(node.shapeExpr)) {
            node.shapeExpr.forEach(child => {
                this.processNode(child, parentId);
                this.output.push("");  // Añadir una línea en blanco después de cada procesamiento de nodo hijo
            });
        }
    }

    processTripleConstraint(expression, parentId) {
        const attribute = `${expression.predicate}: ${expression.valueExpr.values.join(', ')}`;
        this.output.push(`class Blank_${this.counterBlank} {\n${attribute}\n}`);
        if (parentId) {
            this.output.push(`${parentId} --> Blank_${this.counterBlank}`);
            this.output.push("");  // Añadir una línea en blanco después de la relación
        }
        this.counterBlank++;
    }

    processEachOf(expression, parentId) {
        const uniqueId = `Blank_${this.counterBlank++}`;
        const attributes = expression.expressions.map(expr => {
            if (expr.type === "TripleConstraint") {
                return `${expr.predicate}: ${expr.valueExpr.values.join(', ')}`;
            }
            return '';
        }).filter(Boolean).join('\n');

        this.output.push(`class ${uniqueId} {\n${attributes}\n}`);
        if (parentId) {
            this.output.push(`${parentId} --> ${uniqueId}`);
            this.output.push("");  // Añadir una línea en blanco después de la relación
        }
    }

    extractAttributes(className) {
        const regex = new RegExp(`class _?${className} \\{([^}]*)\\}`, 's');
        const match = this.umlText.match(regex);

        if (match && match[1]) {
            return match[1].trim();
        } else {
            return '';
        }
    }
}
