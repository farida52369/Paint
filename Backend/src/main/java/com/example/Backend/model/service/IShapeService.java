package com.example.Backend.model.service;

import com.example.Backend.model.shapes.Shape;

import java.util.List;

public interface IShapeService {
    void create_shape(Shape shape);

    List<Shape> getAll_shapes();

    void redo();

    void undo();

    void copy(Shape shape);

    void move_resize(Shape shape);

    void delete(String id);

    void new_();

    void load();

    void save();
}
