package com.example.Backend.model.shapes;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashMap;

@Entity
@Table(name = "shape")
public class Shape implements Serializable, Cloneable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;

    @Column(nullable = false, updatable = false, length = 20)
    private String shapeName;

    private HashMap<String, Integer> shapeDimension;
    private HashMap<String, String> shapeStyle;
    private String shapeCode;

    // FOR XML DECODER AND ENCODER
    public Shape() {
    }

    public Shape(String shapeName,
                 HashMap<String, Integer> shapeDimension,
                 HashMap<String, String> shapeStyle) {
        this.shapeName = shapeName;
        this.shapeDimension = shapeDimension;
        this.shapeStyle = shapeStyle;
    }

    public Long getId() {
        // Shape ID (get)
        return id;
    }

    public void setId(Long id) {
        // Shape ID (set)
        this.id = id;
    }


    public String getShapeName() {
        // Shape Name (get)
        return this.shapeName;
    }

    public void setShapeName(String shapeName) {
        // Shape Name (set)
        this.shapeName = shapeName;
    }

    public HashMap<String, Integer> getShapeDimension() {
        // Shape Dimension (get)
        return shapeDimension;
    }

    public void setShapeDimension(HashMap<String, Integer> shapeDimension) {
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

    public String getShapeCode() {
        return shapeCode;
    }

    public void setShapeCode(String shapeCode) {
        this.shapeCode = shapeCode;
    }

    @Override
    public Shape clone() {
        try {
            return (Shape) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("\n...... Shape ......\n");
        sb.append("Shape Name: ").append(shapeName).append("\nShape PK in DB: ").append(id);

        sb.append("\nShape Dimensions:\n");
        shapeDimension.forEach((key, value) -> sb.append(key).append(": ").append(value).append("\n"));

        sb.append("Shape Style:\n");
        shapeStyle.forEach((key, value) -> sb.append(key).append(": ").append(value).append("\n"));

        sb.append("Shape Code (ID): ").append(shapeCode);
        return sb.toString();
    }
}
