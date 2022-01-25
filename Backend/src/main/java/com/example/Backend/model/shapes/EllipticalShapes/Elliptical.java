package com.example.Backend.model.shapes.EllipticalShapes;

import com.example.Backend.model.shapes.Shape;
import com.example.Backend.model.shapes.ShapeName;

import java.util.HashMap;

public class Elliptical extends Shape {

    public Elliptical(ShapeName shapeName, HashMap<String, String> shapeDimension, HashMap<String, String> shapeStyle) {
        super(shapeName, shapeDimension, shapeStyle);
    }

    // FOR XML SAVE
    public Elliptical() {}
}
