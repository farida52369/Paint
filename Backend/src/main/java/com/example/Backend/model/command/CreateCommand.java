package com.example.Backend.model.command;

import com.example.Backend.model.shapes.Shape;
import com.example.Backend.model.shapes.ShapeRepo;

import java.util.UUID;

public class CreateCommand extends Command {

    private final Shape shape;
    private final String id;

    public CreateCommand(ShapeRepo shapeRepo, Shape shape) {
        super(shapeRepo);
        // this.shape = ShapeFactory.createShape(shape);
        shape.setShapeCode(UUID.randomUUID().toString());

        this.id = shape.getShapeCode();
        this.shape = shape;
    }

    @Override
    public void undo() {
        // shapeRepo.findById(shape.getId()).ifPresent(shapeRepo::delete);
        shapeRepo.delete(shapeRepo.findByShapeCode(id));

        System.out.println("Removing Shape (Undo Creating) ...\n" + shape);
    }

    @Override
    public boolean execute() {
        if (shape != null) {
            shapeRepo.save(shape);

            System.out.println("Creating Shape ...\n" + shape);
            return true;
        }
        return false;
    }
}
