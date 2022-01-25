package com.example.Backend.model.command;

import com.example.Backend.model.shapes.Shape;

import java.util.UUID;

public class DeleteCommand extends Command {

    private final Shape shape;

    public DeleteCommand(UUID id) {
        this.shape = singleton.getAll_shapes().stream()
                .filter(shape -> shape.getId().equals(id)).findAny().orElse(null);
    }

    @Override
    public void redo() {
        execute();
    }

    @Override
    public void undo() {
        System.out.println("Adding (Undo Deleting) ... " + shape);
        singleton.getAll_shapes().add(shape);
    }

    @Override
    public boolean execute() {

        System.out.println("Deleting Shape ...\n" + shape);
        singleton.getAll_shapes().remove(shape);
        return true;
    }
}
