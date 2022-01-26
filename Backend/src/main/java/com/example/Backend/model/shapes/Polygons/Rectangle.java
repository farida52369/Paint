package com.example.Backend.model.shapes.Polygons;

import java.util.HashMap;

public class Rectangle extends Polygon {
    public Rectangle(String shapeName, HashMap<String, String> shapeDimension, HashMap<String, String> shapeStyle) {
        super(shapeName, shapeDimension, shapeStyle);
    }

    // FOR XML SAVE
    public Rectangle() {}
}
