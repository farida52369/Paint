import { Dimension, Shape, Style } from "./ShapeAttr";
import { Circle } from "./shapes/Circle";
import { Ellipse } from "./shapes/Ellipse";
import { Equilateral } from "./shapes/Equilateral";
import { IShape } from "./shapes/IShape";
import { Line } from "./shapes/Line";
import { Rectangle } from "./shapes/Rectangle";
import { ShapeName } from "./ShapeName";
import { Triangle } from "./shapes/Triangle";

export class ShapeFactory {

    static draw(shapeName: string, dimension: Dimension, style: Style,
        ctx: any, imageData: any, isDrawing: boolean): Shape {

        let shape: IShape
        switch (shapeName) {
            case ShapeName.Rectangle:
                shape = new Rectangle(dimension, style, ctx, imageData, isDrawing)
                break
            case ShapeName.Line:
                shape = new Line(dimension, style, ctx, imageData, isDrawing)
                break
            case ShapeName.Triangle:
                shape = new Triangle(dimension, style, ctx, imageData, isDrawing)
                break
            case ShapeName.Circle:
                shape = new Circle(dimension, style, ctx, imageData, isDrawing)
                break
            case ShapeName.Ellipse:
                shape = new Ellipse(dimension, style, ctx, imageData, isDrawing)
                break
            default:
                shape = new Equilateral(dimension, style, shapeName, ctx, imageData, isDrawing)
        }
        shape.drawShape()
        return shape.getShape()
    }
}