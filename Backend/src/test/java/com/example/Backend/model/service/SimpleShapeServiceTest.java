package com.example.Backend.model.service;

import com.example.Backend.model.shapes.Shape;
import com.example.Backend.model.shapes.ShapeRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace.NONE;

@DataJpaTest
@AutoConfigureTestDatabase(replace = NONE)
class SimpleShapeServiceTest {

    @Autowired
    private ShapeRepo shapeRepo;

    private ShapeService shapeService;

    @Test
    @Rollback(value = false)
    public void testCreationOfShapes() {
        shapeService = new ShapeService(shapeRepo);

        // Test New Drawing
        shapeService.new_();
        assertEquals(shapeService.getAll_shapes().size(), 0);

        HashMap<String, Integer> dimensions = new HashMap<>();
        dimensions.put("start_x", 100);
        dimensions.put("start_y", 150);
        dimensions.put("end_x", 300);
        dimensions.put("end_y", 240);

        HashMap<String, String> styles = new HashMap<>();
        styles.put("strokeStyle", "#fff");
        styles.put("fillStyle", "#ccc");
        styles.put("lineWidth", "2");
        Shape currentShape = new Shape("circle", dimensions, styles);

        HashMap<String, Integer> dimensions_ = new HashMap<>();
        dimensions_.put("start_x", 10);
        dimensions_.put("start_y", 1550);
        dimensions_.put("end_x", 20);
        dimensions_.put("end_y", 4440);

        HashMap<String, String> styles_ = new HashMap<>();
        styles_.put("strokeStyle", "#fcf");
        styles_.put("fillStyle", "#cdc");
        styles_.put("lineWidth", "3");
        Shape currentShape_ = new Shape("triangle", dimensions_, styles_);

        shapeService.create_shape(currentShape);
        shapeService.create_shape(currentShape_);

        // We have Created Two Shapes
        assertEquals(shapeService.getAll_shapes().size(), 2);

        assertNotNull(currentShape.getShapeCode());
        assertNotNull(currentShape_.getShapeCode());

        String id = currentShape.getShapeCode();
        String id_ = currentShape_.getShapeCode();

        // They Already Exist Now in the DataBase
        assertNotNull(shapeRepo.findByShapeCode(id));
        assertNotNull(shapeRepo.findByShapeCode(id_));
    }

    @Test
    @Rollback(value = false)
    public void testDeletionOfShapes() {
        testCreationOfShapes();
        shapeService = new ShapeService(shapeRepo);

        Shape current = shapeRepo.getById(1L);
        Shape current_ = shapeRepo.getById(2L);

        shapeService.delete(current.getShapeCode());
        // We have Deleted One Shape NOW
        assertEquals(shapeService.getAll_shapes().size(), 1);
        assertNotNull(shapeRepo.findByShapeCode(current_.getShapeCode()));

        shapeService.delete(current_.getShapeCode());
        // We have Nothing NOW
        assertEquals(shapeService.getAll_shapes().size(), 0);

        // Undo Test For Deletion
        shapeService.undo();
        assertEquals(shapeService.getAll_shapes().size(), 1);
        assertNotNull(shapeRepo.getById(3L));
        assertEquals(shapeRepo.getById(3L).getShapeCode(), current_.getShapeCode());
        assertEquals(shapeRepo.getById(3L).getShapeDimension(), current_.getShapeDimension());
        assertEquals(shapeRepo.getById(3L).getShapeStyle(), current_.getShapeStyle());

        shapeService.undo();
        assertEquals(shapeService.getAll_shapes().size(), 2);
        assertNotNull(shapeRepo.getById(4L));
        assertEquals(shapeRepo.getById(4L).getShapeCode(), current.getShapeCode());
        assertEquals(shapeRepo.getById(4L).getShapeDimension(), current.getShapeDimension());
        assertEquals(shapeRepo.getById(4L).getShapeStyle(), current.getShapeStyle());

        // Redo Test For Deletion
        shapeService.redo();
        assertEquals(shapeService.getAll_shapes().size(), 1);

        shapeService.redo(); // DB is Clean Now
        assertEquals(shapeService.getAll_shapes().size(), 0);
    }

    @Test
    public void testCopyOfShapes() {
        testCreationOfShapes();

        shapeService = new ShapeService(shapeRepo);

        Shape current = shapeRepo.getById(1L).clone();

        // Copy Current Shape __ Shallow Copies everyWhere __ Watch OUT
        HashMap<String, Integer> dimensions = new HashMap<>();
        dimensions.put("start_x", current.getShapeDimension().get("start_x") + 10);
        dimensions.put("start_y", current.getShapeDimension().get("start_y") + 10);
        dimensions.put("end_x", current.getShapeDimension().get("end_x") + 10);
        dimensions.put("end_y", current.getShapeDimension().get("end_y") + 10);

        Shape copiedShape = new Shape(current.getShapeName(), dimensions, current.getShapeStyle());
        copiedShape.setId(current.getId());
        copiedShape.setShapeCode(current.getShapeCode());

        shapeService.copy(copiedShape);

        // Check if We have Done The Job (COPY) properly
        assertNotEquals(copiedShape.getId(), current.getId());
        assertNotEquals(copiedShape.getShapeCode(), current.getShapeCode());
        assertNotEquals(copiedShape.getShapeDimension().values(), current.getShapeDimension().values());
        assertEquals(copiedShape.getShapeStyle().values(), current.getShapeStyle().values());
        assertEquals(shapeService.getAll_shapes().size(), 3);
        assertEquals(copiedShape, shapeRepo.getById(3L));

        // TEST for UNDO Copy Command
        shapeService.undo(); // Return Family of TWO again :)
        assertEquals(shapeService.getAll_shapes().size(), 2);

        // TEST for REDO copy Command
        shapeService.redo(); // Return Family of three
        assertEquals(shapeService.getAll_shapes().size(), 3);
        assertEquals(shapeRepo.findByShapeCode(copiedShape.getShapeCode()), shapeRepo.getById(4L));
    }

    @Test
    @Rollback(value = false)
    public void testMoveOfShapes() {
        testCreationOfShapes();
        shapeService = new ShapeService(shapeRepo);

        Shape current = shapeRepo.getById(1L).clone();

        // Take Action Move For Current Shape
        HashMap<String, Integer> dimensions = new HashMap<>();
        dimensions.put("start_x", 444);
        dimensions.put("start_y", 333);
        dimensions.put("end_x", 222);
        dimensions.put("end_y", 444);

        HashMap<String, String> styles = new HashMap<>();
        styles.put("strokeStyle", "#fcdf");
        styles.put("fillStyle", "#cdca");
        styles.put("lineWidth", "5");

        Shape movedShape = new Shape(current.getShapeName(), dimensions, styles);
        movedShape.setId(current.getId());
        movedShape.setShapeCode(current.getShapeCode());

        shapeService.move_resize(movedShape);
        // Test After MOVING SHAPE
        assertEquals(shapeService.getAll_shapes().size(), 2);
        assertEquals(shapeRepo.getById(1L).getId(), current.getId());
        assertEquals(shapeRepo.getById(1L).getShapeCode(), current.getShapeCode());
        assertNotEquals(shapeRepo.getById(1L).getShapeDimension().values(), current.getShapeDimension().values());
        assertNotEquals(shapeRepo.getById(1L).getShapeStyle().values(), current.getShapeStyle().values());

        // UNDO For MOVING Command
        shapeService.undo();
        assertEquals(shapeService.getAll_shapes().size(), 2);
        assertEquals(shapeRepo.getById(1L).getId(), current.getId());
        assertEquals(shapeRepo.getById(1L).getShapeCode(), current.getShapeCode());
        assertEquals(shapeRepo.getById(1L).getShapeDimension().values(), current.getShapeDimension().values());
        assertEquals(shapeRepo.getById(1L).getShapeStyle().values(), current.getShapeStyle().values());

        // REDO for MOVING Command
        shapeService.redo();
        assertEquals(shapeService.getAll_shapes().size(), 2);
        assertEquals(shapeRepo.getById(1L).getId(), movedShape.getId());
        assertEquals(shapeRepo.getById(1L).getShapeCode(), movedShape.getShapeCode());
        assertEquals(shapeRepo.getById(1L).getShapeDimension().values(), movedShape.getShapeDimension().values());
        assertEquals(shapeRepo.getById(1L).getShapeStyle().values(), movedShape.getShapeStyle().values());
    }
}