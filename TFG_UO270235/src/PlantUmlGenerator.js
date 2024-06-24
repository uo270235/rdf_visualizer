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
        this.output.push("left to right direction");

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
            if (node.id === "start") {
                this.output.push(`component "Start" as start`);
                if (node.type === "UniqueStart") {
                    if (typeof node.shapeExpr === 'string') {
                        const attributes = this.extractAttributes(node.shapeExpr);
                        this.output.push(`class "${node.shapeExpr}" {\n${attributes}\n}`);
                        this.output.push(`start --> "${node.shapeExpr}"`);
                    } else {
                        this.processNode(node.shapeExpr, "start");
                    }
                }
            } else {
                this.output.push(`class ${node.id} {}`);
            }
            this.processNode(node, node.id);
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
            } else {
                this.output.push(`class ${node} {\n${this.extractAttributes(node)}\n}`);
                this.output.push(`${parentId} --> ${node}`);
            }
        } else if (node.type === "ShapeOr" || node.type === "ShapeAnd" || node.type === "ShapeNot") {
            const typeLabel = node.type.replace('Shape', '').toUpperCase(); // Convert to AND, OR, NOT
            const id = `${typeLabel}_${uniqid()}`;
            this.output.push(`component [ ] as ${id} <<${typeLabel}>>`);
            if (parentId) {
                this.output.push(`${parentId} --> ${id}`);
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
            }
        } else if (node.type === "NodeConstraint") {
            const className = node.datatype || "NodeConstraint";
            const uniqueClassName = `${className}_${uniqid()}`;
            if (node.values && node.values.length > 0) {
                const values = node.values.map(val => typeof val === 'string' ? val : val.value).join(', ');
                this.output.push(`class "${className}" as ${uniqueClassName} {\nvalues: ${values}\n}`);
            } else {
                this.output.push(`class "${className}" as ${uniqueClassName} {}`);
            }
            if (parentId) {
                this.output.push(`${parentId} --> ${uniqueClassName}`);
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
            });
        }
    }

    processTripleConstraint(expression, parentId) {
        let attribute = `:${expression.predicate} [ `;
        if (expression.valueExpr && expression.valueExpr.values && expression.valueExpr.values.length > 0) {
            const values = expression.valueExpr.values.map(val => typeof val === 'string' ? `:${val}` : val.value).join(', ');
            attribute += `${values}`;
        }
        attribute += ' ]';
        this.output.push(`class Blank_${this.counterBlank} {\n${attribute}\n}`);
        if (parentId) {
            this.output.push(`${parentId} --> Blank_${this.counterBlank}`);
        }
        this.counterBlank++;
    }
    

    processEachOf(expression, parentId) {
        const uniqueId = `Blank_${this.counterBlank++}`;
        const attributes = expression.expressions.map(expr => {
            if (expr.type === "TripleConstraint") {
                let attribute = `:${expr.predicate} [ `;
                if (expr.valueExpr && expr.valueExpr.values && expr.valueExpr.values.length > 0) {
                    const values = expr.valueExpr.values.map(val => typeof val === 'string' ? `:${val}` : val.value).join(', ');
                    attribute += `${values}`;
                }
                attribute += ' ]';
                return attribute;
            }
            return '';
        }).filter(Boolean).join('\n');
    
        this.output.push(`class ${uniqueId} {\n${attributes}\n}`);
        if (parentId) {
            this.output.push(`${parentId} --> ${uniqueId}`);
        }
    }
    

    extractAttributes(className) {
        const regex = new RegExp(`class (_?${className}_?|ex_${className}) \\{([^}]*)\\}`, 's');
        const match = this.umlText.match(regex);

        if (match && match[2]) {
            return match[2].trim().split(';').map(attr => attr.trim()).join('\n');
        } else {
            return '';
        }
    }
}
