package com.example.Backend.model.shapes;

import com.example.Backend.model.shapes.EllipticalShapes.Circle;
import com.example.Backend.model.shapes.EllipticalShapes.Ellipse;
import com.example.Backend.model.shapes.Polygons.*;

import java.util.UUID;

public class ShapeFactory {

    public static Shape createShape(Shape shape, UUID id) {
        Shape requiredShape = null;

        if(shape.getShapeName() == ShapeName.CIRCLE)
            requiredShape = new Circle(shape.getShapeName(), shape.getShapeDimension(), shape.getShapeStyle());
        else if (shape.getShapeName() == ShapeName.ELLIPSE)
            requiredShape = new Ellipse(shape.getShapeName(), shape.getShapeDimension(), shape.getShapeStyle());
        else if (shape.getShapeName() == ShapeName.HEXAGON)
            requiredShape = new Hexagon(shape.getShapeName(), shape.getShapeDimension(), shape.getShapeStyle());
        else if (shape.getShapeName() == ShapeName.LINE)
            requiredShape = new Line(shape.getShapeName(), shape.getShapeDimension(), shape.getShapeStyle());
        else if (shape.getShapeName() == ShapeName.POLYGON)
            requiredShape = new Polygon(shape.getShapeName(), shape.getShapeDimension(), shape.getShapeStyle());
        else if (shape.getShapeName() == ShapeName.RECTANGLE)
            requiredShape = new Rectangle(shape.getShapeName(), shape.getShapeDimension(), shape.getShapeStyle());
        else if (shape.getShapeName() == ShapeName.SQUARE)
            requiredShape = new Square(shape.getShapeName(), shape.getShapeDimension(), shape.getShapeStyle());
        else if (shape.getShapeName() == ShapeName.TRIANGLE)
            requiredShape = new Triangle(shape.getShapeName(), shape.getShapeDimension(), shape.getShapeStyle());

        if (requiredShape != null)
            requiredShape.setId(id);
        return requiredShape;
    }
}
