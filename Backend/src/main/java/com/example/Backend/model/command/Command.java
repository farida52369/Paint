package com.example.Backend.model.command;

import com.example.Backend.model.shapes.ShapeRepo;

public abstract class Command {

    public final ShapeRepo shapeRepo;

    public Command(ShapeRepo shapeRepo) {
        this.shapeRepo = shapeRepo;
    }

    public void redo() {
        // Redo Command
        execute();
    }

    public abstract void undo();

    public abstract boolean execute();

    @Override
    public String toString() {
        //
        return "Command Type: " + this.getClass().getSimpleName();
    }
}
