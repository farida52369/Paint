package com.example.Backend.model.command;

import com.example.Backend.model.shapes.Shape;
import com.example.Backend.model.shapes.ShapeFactory;

import java.util.UUID;

public class CreateCommand extends Command {

    private final Shape shape;

    public CreateCommand(Shape shape) {
        this.shape = ShapeFactory.createShape(shape, UUID.randomUUID());
    }

    @Override
    public void redo() {
        execute();
    }

    @Override
    public void undo() {
        System.out.println("Removing Shape (Undo Creating) ...\n" + shape);
        Shape removedShape = singleton.getAll_shapes().stream()
                .filter(shape_ -> shape.getId().equals(shape_.getId())).findAny().orElse(null);
        singleton.getAll_shapes().remove(removedShape);
    }

    @Override
    public boolean execute() {
        if (shape != null) {
            singleton.getAll_shapes().add(shape);
            System.out.println("Creating Shape ...\n" + shape);
            return true;
        }
        return false;
    }
}
