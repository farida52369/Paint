package com.example.Backend.model.shapes.Polygons;

import com.example.Backend.model.shapes.ShapeName;

import java.util.HashMap;

public class Hexagon extends Polygon {
    public Hexagon(ShapeName shapeName, HashMap<String, String> shapeDimension, HashMap<String, String> shapeStyle) {
        super(shapeName, shapeDimension, shapeStyle);
    }

    // For Save XML
    public Hexagon() {}
}
