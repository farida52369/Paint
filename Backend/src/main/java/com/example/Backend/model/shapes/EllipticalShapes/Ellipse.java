package com.example.Backend.model.shapes.EllipticalShapes;

import java.util.HashMap;

public class Ellipse extends Elliptical {
    public Ellipse(String shapeName, HashMap<String, Integer> shapeDimension, HashMap<String, String> shapeStyle) {
        super(shapeName, shapeDimension, shapeStyle);
    }

    // FOR XML SAVE
    public Ellipse() {}
}
