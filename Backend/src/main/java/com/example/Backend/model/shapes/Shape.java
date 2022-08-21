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
    private String name;

    private HashMap<String, Integer> dimension;
    private HashMap<String, String> style;
    private String code;

    // FOR XML DECODER AND ENCODER
    public Shape() {
    }

    public Shape(String name,
                 HashMap<String, Integer> dimension,
                 HashMap<String, String> style) {
        this.name = name;
        this.dimension = dimension;
        this.style = style;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }

    public HashMap<String, Integer> getDimension() {
        return dimension;
    }

    public void setDimension(HashMap<String, Integer> dimension) {
        this.dimension = dimension;
    }

    public HashMap<String, String> getStyle() {
        return style;
    }

    public void setStyle(HashMap<String, String> style) {
        this.style = style;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
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
        sb.append("Shape Name: ").append(name).append("\nShape PK in DB: ").append(id);

        sb.append("\nShape Dimensions:\n");
        dimension.forEach((key, value) -> sb.append(key).append(": ").append(value).append("\n"));

        sb.append("Shape Style:\n");
        style.forEach((key, value) -> sb.append(key).append(": ").append(value).append("\n"));

        sb.append("Shape Code (ID): ").append(code).append("\n\n");
        return sb.toString();
    }
}
