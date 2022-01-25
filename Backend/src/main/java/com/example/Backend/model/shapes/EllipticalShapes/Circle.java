package com.example.Backend.model.shapes.EllipticalShapes;

import com.example.Backend.model.shapes.ShapeName;

import java.util.HashMap;

public class Circle extends Elliptical {
    public Circle(ShapeName shapeName, HashMap<String, String> shapeDimension, HashMap<String, String> shapeStyle) {
        super(shapeName, shapeDimension, shapeStyle);
    }

    // FOR XML SAVE
    public Circle() {}

}
