package com.example.Backend.model.shapes.EllipticalShapes;

import com.example.Backend.model.shapes.ShapeName;

import java.util.HashMap;

public class Ellipse extends Elliptical {
    public Ellipse(ShapeName shapeName, HashMap<String, String> shapeDimension, HashMap<String, String> shapeStyle) {
        super(shapeName, shapeDimension, shapeStyle);
    }

    // FOR XML SAVE
    public Ellipse() {}
}
