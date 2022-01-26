package com.example.Backend.model.shapes;

import java.util.HashMap;
import java.util.UUID;


public class Shape implements Cloneable {

    private String shapeName;
    private HashMap<String, String> shapeDimension;
    private HashMap<String, String> shapeStyle;
    private UUID id;

    // FOR XML DECODER AND ENCODER
    public Shape() {
    }

    public Shape(String shapeName,
                 HashMap<String, String> shapeDimension,
                 HashMap<String, String> shapeStyle) {
        this.shapeName = shapeName;
        this.shapeDimension = shapeDimension;
        this.shapeStyle = shapeStyle;
    }


    public String getShapeName() {
        // Shape Name (get)
        return this.shapeName;
    }

    public void setShapeName(String shapeName) {
        // Shape Name (set)
        this.shapeName = shapeName;
    }

    public HashMap<String, String> getShapeDimension() {
        // Shape Dimension (get)
        return shapeDimension;
    }

    public void setShapeDimension(HashMap<String, String> shapeDimension) {
        // Shape Dimension (set)
        this.shapeDimension = shapeDimension;
    }

    public HashMap<String, String> getShapeStyle() {
        // Shape Style (get)
        return shapeStyle;
    }

    public void setShapeStyle(HashMap<String, String> shapeStyle) {
        // Shape Style (set)
        this.shapeStyle = shapeStyle;
    }

    public UUID getId() {
        // Shape ID (get)
        return id;
    }

    public void setId(UUID id) {
        // Shape ID (set)
        this.id = id;
    }

    public Object clone() {
        try {
            return super.clone();
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Shape Name: ").append(shapeName).append("\nShape ID: ").append(id);

        sb.append("\nShape Dimensions:\n");
        shapeDimension.forEach((key, value) -> sb.append(key).append(": ").append(value).append("\n"));

        sb.append("Shape Style:\n");
        shapeStyle.forEach((key, value) -> sb.append(key).append(": ").append(value).append("\n"));
        return sb.toString();
    }
}
