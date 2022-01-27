package com.example.Backend.model.shapes.Polygons;

import java.util.HashMap;

public class Line extends Polygon {
    public Line(String shapeName, HashMap<String, Integer> shapeDimension, HashMap<String, String> shapeStyle) {
        super(shapeName, shapeDimension, shapeStyle);
    }

    // FOR XML SAVE
    public Line() {}
}
