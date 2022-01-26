package com.example.Backend.model.shapes.Polygons;

import java.util.HashMap;

public class Pentagon extends Polygon {
    public Pentagon(String shapeName, HashMap<String, String> shapeDimension, HashMap<String, String> shapeStyle) {
        super(shapeName, shapeDimension, shapeStyle);
    }

    // For Save XML
    public Pentagon() {}
}
