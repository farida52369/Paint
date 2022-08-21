package com.example.Backend.model.command;

import com.example.Backend.model.shapes.Shape;
import com.example.Backend.model.shapes.ShapeRepo;

public class DeleteCommand extends Command {

    private final String id;
    private Shape shape;

    public DeleteCommand(ShapeRepo shapeRepo, String id) {
        super(shapeRepo);
        this.id = id;
    }

    @Override
    public void undo() {
        Shape undoDelete = shape.clone();
        // undoDelete.setId(null); // To get new Primary Key
        shapeRepo.save(undoDelete);

        System.out.println("Adding (Undo Deleting) ... \n" + undoDelete);
    }

    @Override
    public boolean execute() {
        Shape shapeToDelete = shapeRepo.findByCode(id);

        // For undo
        shape = shapeToDelete.clone(); // Hard Copy
        shapeRepo.delete(shapeToDelete);

        System.out.println("Deleting Shape ...\n" + shapeToDelete);
        return true;
    }
}
