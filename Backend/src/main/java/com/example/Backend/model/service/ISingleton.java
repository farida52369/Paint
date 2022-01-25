package com.example.Backend.model.service;

import com.example.Backend.model.shapes.Shape;

import java.util.UUID;

public interface ISingleton {
    void redo();

    void undo();

    void create_shape(Shape shape);

    void copy(UUID id, String dimensions);

    void move_resize(UUID id, String dimensions);

    void delete(UUID id);

    void new_();

    void load();

    void save();
}
