package com.example.Backend.model.shapes.Polygons;

import java.util.HashMap;

public class Triangle extends Polygon {
    public Triangle(String shapeName, HashMap<String, Integer> shapeDimension, HashMap<String, String> shapeStyle) {
        super(shapeName, shapeDimension, shapeStyle);
    }

    // FOR XML SAVE
    public Triangle() {}
}
