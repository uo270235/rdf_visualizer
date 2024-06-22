export class PlantUMLGenerator {
    constructor(json) {
      this.json = json;
      this.counter = 0;
      this.output = [];
      this.initializeSkinParams();
    }
  
    initializeSkinParams() {
      this.output.push("@startuml");
      this.output.push("allowmixing");
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
        this.processNode(node, node.id);
      });
      this.output.push("@enduml");
      return this.output.join("\n");
    }
  
    processNode(node, parentId) {
      if (node.type === "ShapeOr" || node.type === "ShapeAnd" || node.type === "ShapeNot") {
        const typeLabel = node.type.replace('Shape', '').toUpperCase(); // Convert to AND, OR, NOT
        const id = `${typeLabel}_${this.counter++}`;
        this.output.push(`component [ ] as ${id} <<${typeLabel}>>`);
        if (parentId) {
          this.output.push(`${parentId} --> ${id}`);
        }
        if (node.shapeExprs && Array.isArray(node.shapeExprs)) {
          node.shapeExprs.forEach(child => {
            this.processNode(child, id);
          });
        } else if (node.shapeExpr && typeof node.shapeExpr === 'object') {
          this.processNode(node.shapeExpr, id);
        }
      } else if (node.type === "NodeConstraint") {
        const className = node.datatype;
        this.output.push(`class ${className} {}`);
        if (parentId) {
          this.output.push(`${parentId} --> ${className}`);
        }
      }
    }
  }


 
