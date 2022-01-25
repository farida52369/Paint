package com.example.Backend.model.shapes;

public enum ShapeName {
    CIRCLE("circle"),
    ELLIPSE("ellipse"),
    HEXAGON("hexagon"),
    LINE("line"),
    POLYGON("polygon"),
    RECTANGLE("rectangle"),
    SQUARE("square"),
    TRIANGLE("triangle");

    private String name;
    ShapeName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return this.name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
