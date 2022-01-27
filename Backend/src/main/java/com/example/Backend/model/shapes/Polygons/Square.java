package com.example.Backend.model.shapes.Polygons;

import java.util.HashMap;

public class Square extends Polygon {
    public Square(String shapeName, HashMap<String, Integer> shapeDimension, HashMap<String, String> shapeStyle) {
        super(shapeName, shapeDimension, shapeStyle);
    }

    // FOR XML SAVE
    public Square() {}
}
