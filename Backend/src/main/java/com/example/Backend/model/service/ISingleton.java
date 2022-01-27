package com.example.Backend.model.service;

import com.example.Backend.model.shapes.Shape;

import java.util.List;
import java.util.UUID;

public interface ISingleton {
    void create_shape(Shape shape);

    Shape last_added_shape();

    List<Shape> getAll_shapes();

    void redo();

    void undo();

    void copy(UUID id, String dimensions);

    void move_resize(UUID id, String dimensions);

    void delete(UUID id);

    void new_();

    void load();

    void save();
}
