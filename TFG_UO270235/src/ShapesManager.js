export function obtainLogicShapes(data) {
    const logicShapes = [];

    data.shapes.forEach(shape => {
        if (shape.shapeExpr.type === "ShapeOr" || shape.shapeExpr.type === "ShapeAnd") {
            logicShapes.push({
                id: shape.id,
                type: shape.shapeExpr.type,
                shapeExprs: shape.shapeExpr.shapeExprs
            });
        }
        else if(shape.shapeExpr.type === "ShapeNot"){
            logicShapes.push({
                id: shape.id,
                type: shape.shapeExpr.type,
                shapeExpr: shape.shapeExpr.shapeExpr
            });
        }
    });
    
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxx");
    console.log(logicShapes);
    return logicShapes;
}
