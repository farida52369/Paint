package com.example.Backend.model.command;

import com.example.Backend.model.shapes.Shape;

import java.util.HashMap;
import java.util.UUID;

public class ChangeCommand extends Command {

    private Shape shape;
    private final UUID id;
    private final HashMap<String, Integer> dimensions;

    public ChangeCommand(UUID id, HashMap<String, Integer> dimensions) {
        this.id = id;
        this.dimensions = dimensions;
    }

    @Override
    public void undo() {
        System.out.println("Undo Moving or Resizing Shape ...\n" + shape);
        Shape changedShape = singleton.getAll_shapes().stream()
                .filter(shape_ -> shape.getId().equals(shape_.getId())).findAny().orElse(null);
        assert changedShape != null;
        changedShape.setShapeDimension(shape.getShapeDimension());
    }

    @Override
    public boolean execute() {
        Shape changedShape = singleton.getAll_shapes().stream()
                .filter(shape_ -> id.equals(shape_.getId())).findAny().orElse(null);
        // Clone
        assert changedShape != null;
        shape = (Shape) changedShape.clone();
        changedShape.setShapeDimension(dimensions);
        System.out.println("Moving or Resizing Shape ...\n" + changedShape);
        return true;
    }
}
