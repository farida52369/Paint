package com.example.Backend.model.shapes;

import com.example.Backend.model.shapes.EllipticalShapes.Circle;
import com.example.Backend.model.shapes.EllipticalShapes.Ellipse;
import com.example.Backend.model.shapes.Polygons.*;

import java.util.UUID;

public class ShapeFactory {

    public static Shape createShape(Shape shape, UUID id) {
        Shape requiredShape = null;

        if(shape.getShapeName().equalsIgnoreCase("circle"))
            requiredShape = new Circle(shape.getShapeName(), shape.getShapeDimension(), shape.getShapeStyle());
        else if (shape.getShapeName().equalsIgnoreCase("ellipse"))
            requiredShape = new Ellipse(shape.getShapeName(), shape.getShapeDimension(), shape.getShapeStyle());
        else if (shape.getShapeName().equalsIgnoreCase("hexagon"))
            requiredShape = new Hexagon(shape.getShapeName(), shape.getShapeDimension(), shape.getShapeStyle());
        else if (shape.getShapeName().equalsIgnoreCase("line"))
            requiredShape = new Line(shape.getShapeName(), shape.getShapeDimension(), shape.getShapeStyle());
        else if (shape.getShapeName().equalsIgnoreCase("pentagon"))
            requiredShape = new Pentagon(shape.getShapeName(), shape.getShapeDimension(), shape.getShapeStyle());
        else if (shape.getShapeName().equalsIgnoreCase("rectangle"))
            requiredShape = new Rectangle(shape.getShapeName(), shape.getShapeDimension(), shape.getShapeStyle());
        else if (shape.getShapeName().equalsIgnoreCase("square"))
            requiredShape = new Square(shape.getShapeName(), shape.getShapeDimension(), shape.getShapeStyle());
        else if (shape.getShapeName().equalsIgnoreCase("triangle"))
            requiredShape = new Triangle(shape.getShapeName(), shape.getShapeDimension(), shape.getShapeStyle());

        if (requiredShape != null)
            requiredShape.setId(id);
        return requiredShape;
    }
}
