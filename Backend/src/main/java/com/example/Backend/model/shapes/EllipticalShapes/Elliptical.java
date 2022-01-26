package com.example.Backend.model.shapes.EllipticalShapes;

import com.example.Backend.model.shapes.Shape;

import java.util.HashMap;

public class Elliptical extends Shape {

    public Elliptical(String shapeName, HashMap<String, String> shapeDimension, HashMap<String, String> shapeStyle) {
        super(shapeName, shapeDimension, shapeStyle);
    }

    // FOR XML SAVE
    public Elliptical() {}
}
