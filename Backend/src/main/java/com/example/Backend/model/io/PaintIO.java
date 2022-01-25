package com.example.Backend.model.io;

import com.example.Backend.model.shapes.Shape;

public interface PaintIO {
    Shape[] load();

    boolean save();

    void setPath();

}
