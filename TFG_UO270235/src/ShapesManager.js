export function obtainLogicShapes(data) {
    const logicShapes = [];

    if(data.start){
        logicShapes.push({
            id:"start",
            type:data.start.type,
            shapeExpr:data.start.shapeExprs
        })
    }

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
    
    return logicShapes;
}
