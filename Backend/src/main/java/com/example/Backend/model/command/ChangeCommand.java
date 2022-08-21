package com.example.Backend.model.command;

import com.example.Backend.model.shapes.Shape;
import com.example.Backend.model.shapes.ShapeRepo;

public class ChangeCommand extends Command {

    private final Shape shape;
    private Shape changedShape;

    private final String id;

    public ChangeCommand(ShapeRepo shapeRepo, Shape shape) {
        super(shapeRepo);
        this.id = shape.getCode();
        this.shape = shape;
    }

    @Override
    public void undo() {
        Shape shape = shapeRepo.findByCode(id);
        shape.setDimension(changedShape.getDimension());
        shape.setStyle(changedShape.getStyle());
        shapeRepo.save(shape);

        System.out.println("Undo Moving or Resizing (Changed) Shape ...\n" + shape);
    }

    @Override
    public boolean execute() {
        Shape movedShape = shapeRepo.findByCode(id);

        // For undo
        changedShape = movedShape.clone();

        movedShape.setDimension(shape.getDimension());
        movedShape.setStyle(shape.getStyle());
        shapeRepo.save(movedShape);

        System.out.println("Moving or Resizing (Original) Shape ...\n" + movedShape);
        return true;
    }
}
