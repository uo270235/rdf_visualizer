export function obtainLogicShapes(data) {
    const logicShapes = [];

    data.shapes.forEach(shape => {
        if (shape.shapeExpr.type === "ShapeOr" || shape.shapeExpr.type === "ShapeAnd"
            || shape.shapeExpr.type === "ShapeNot"
        ) {
            logicShapes.push({
                id: shape.id,
                type: shape.shapeExpr.type,
                shapeExprs: shape.shapeExpr.shapeExprs
            });
        }
    });
    
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxx");
    console.log(logicShapes);
    return logicShapes;
}
