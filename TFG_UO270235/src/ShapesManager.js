export function obtainLogicShapes(data) {
    const logicShapes = [];

    if(data.start){
        if(data.start.shapeExprs != undefined){
        logicShapes.push({
            id:"start",
            type:data.start.type,
            shapeExpr:data.start.shapeExprs
        })}
        else if(data.start.shapeExprs == undefined && data.start.shapeExpr!=undefined){
            logicShapes.push({
                id:"start",
                type:data.start.type,
                shapeExpr:data.start.shapeExpr
            })
        }
        else if(data.start.shapeExprs == undefined && data.start.shapeExpr==undefined){
            logicShapes.push({
                id:"start",
                type:"UniqueStart",
                shapeExpr:data.start
            })
        }
        
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
