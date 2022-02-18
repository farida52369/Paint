package com.example.Backend.model.command;

import com.example.Backend.model.shapes.Shape;
import com.example.Backend.model.shapes.ShapeRepo;

public class ChangeCommand extends Command {

    private final Shape shape;
    private Shape changedShape;

    private final String id;

    public ChangeCommand(ShapeRepo shapeRepo, Shape shape) {
        super(shapeRepo);
        this.id = shape.getShapeCode();
        this.shape = shape;
    }

    @Override
    public void undo() {
        Shape shape = shapeRepo.findByShapeCode(id);
        shape.setShapeDimension(changedShape.getShapeDimension());
        shape.setShapeStyle(changedShape.getShapeStyle());
        shapeRepo.save(shape);

        System.out.println("Undo Moving or Resizing (Changed) Shape ...\n" + shape);
    }

    @Override
    public boolean execute() {
        Shape movedShape = shapeRepo.findByShapeCode(id);

        // For undo
        changedShape = movedShape.clone();

        movedShape.setShapeDimension(shape.getShapeDimension());
        movedShape.setShapeStyle(shape.getShapeStyle());
        shapeRepo.save(movedShape);

        System.out.println("Moving or Resizing (Original) Shape ...\n" + movedShape);
        return true;
    }
}
