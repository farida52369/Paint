package com.example.Backend.model.shapes.Polygons;

import java.util.HashMap;

public class Hexagon extends Polygon {
    public Hexagon(String shapeName, HashMap<String, Integer> shapeDimension, HashMap<String, String> shapeStyle) {
        super(shapeName, shapeDimension, shapeStyle);
    }

    // For Save XML
    public Hexagon() {}
}
