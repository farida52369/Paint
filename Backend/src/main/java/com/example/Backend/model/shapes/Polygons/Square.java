package com.example.Backend.model.shapes.Polygons;

import com.example.Backend.model.shapes.ShapeName;

import java.util.HashMap;

public class Square extends Polygon {
    public Square(ShapeName shapeName, HashMap<String, String> shapeDimension, HashMap<String, String> shapeStyle) {
        super(shapeName, shapeDimension, shapeStyle);
    }

    // FOR XML SAVE
    public Square() {}
}
