package com.example.Backend.model.shapes.Polygons;

import com.example.Backend.model.shapes.Shape;

import java.util.HashMap;

public class Polygon extends Shape {
    public Polygon(String shapeName, HashMap<String, Integer> shapeDimension, HashMap<String, String> shapeStyle) {
        super(shapeName, shapeDimension, shapeStyle);
    }

    // FOR XML SAVE
    public Polygon() {}
}
