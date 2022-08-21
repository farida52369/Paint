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
        dimensions.put("x_1", 100);
        dimensions.put("y_1", 150);
        dimensions.put("x_2", 300);
        dimensions.put("y_2", 240);

        HashMap<String, String> styles = new HashMap<>();
        styles.put("stroke_style", "#fff");
        styles.put("fill_style", "#ccc");
        styles.put("line_width", "2");
        Shape currentShape = new Shape("circle", dimensions, styles);

        HashMap<String, Integer> dimensions_ = new HashMap<>();
        dimensions_.put("x_1", 10);
        dimensions_.put("y_1", 1550);
        dimensions_.put("x_2", 20);
        dimensions_.put("y_2", 4440);

        HashMap<String, String> styles_ = new HashMap<>();
        styles_.put("stroke_style", "#fcf");
        styles_.put("fill_style", "#cdc");
        styles_.put("line_width", "3");
        Shape currentShape_ = new Shape("triangle", dimensions_, styles_);

        shapeService.create_shape(currentShape);
        shapeService.create_shape(currentShape_);

        // We have Created Two Shapes
        assertEquals(shapeService.getAll_shapes().size(), 2);

        assertNotNull(currentShape.getCode());
        assertNotNull(currentShape_.getCode());

        String id = currentShape.getCode();
        String id_ = currentShape_.getCode();

        // They Already Exist Now in the DataBase
        assertNotNull(shapeRepo.findByCode(id));
        assertNotNull(shapeRepo.findByCode(id_));
    }

    @Test
    @Rollback(value = false)
    public void testDeletionOfShapes() {
        testCreationOfShapes();
        shapeService = new ShapeService(shapeRepo);

        Shape current = shapeRepo.getById(1L);
        Shape current_ = shapeRepo.getById(2L);

        shapeService.delete(current.getCode());
        // We have Deleted One Shape NOW
        assertEquals(shapeService.getAll_shapes().size(), 1);
        assertNotNull(shapeRepo.findByCode(current_.getCode()));

        shapeService.delete(current_.getCode());
        // We have Nothing NOW
        assertEquals(shapeService.getAll_shapes().size(), 0);

        // Undo Test For Deletion
        shapeService.undo();
        assertEquals(shapeService.getAll_shapes().size(), 1);
        assertNotNull(shapeRepo.getById(3L));
        assertEquals(shapeRepo.getById(3L).getCode(), current_.getCode());
        assertEquals(shapeRepo.getById(3L).getDimension(), current_.getDimension());
        assertEquals(shapeRepo.getById(3L).getStyle(), current_.getStyle());

        shapeService.undo();
        assertEquals(shapeService.getAll_shapes().size(), 2);
        assertNotNull(shapeRepo.getById(4L));
        assertEquals(shapeRepo.getById(4L).getCode(), current.getCode());
        assertEquals(shapeRepo.getById(4L).getDimension(), current.getDimension());
        assertEquals(shapeRepo.getById(4L).getStyle(), current.getStyle());

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
        dimensions.put("x_1", current.getDimension().get("x_1") + 10);
        dimensions.put("y_1", current.getDimension().get("y_1") + 10);
        dimensions.put("x_2", current.getDimension().get("x_2") + 10);
        dimensions.put("y_2", current.getDimension().get("y_2") + 10);

        Shape copiedShape = new Shape(current.getName(), dimensions, current.getStyle());
        copiedShape.setId(current.getId());
        copiedShape.setCode(current.getCode());

        shapeService.copy(copiedShape);

        // Check if We have Done The Job (COPY) properly
        assertNotEquals(copiedShape.getId(), current.getId());
        assertNotEquals(copiedShape.getCode(), current.getCode());
        assertNotEquals(copiedShape.getDimension().values(), current.getDimension().values());
        assertEquals(copiedShape.getStyle().values(), current.getStyle().values());
        assertEquals(shapeService.getAll_shapes().size(), 3);
        assertEquals(copiedShape, shapeRepo.getById(3L));

        // TEST for UNDO Copy Command
        shapeService.undo(); // Return Family of TWO again :)
        assertEquals(shapeService.getAll_shapes().size(), 2);

        // TEST for REDO copy Command
        shapeService.redo(); // Return Family of three
        assertEquals(shapeService.getAll_shapes().size(), 3);
        assertEquals(shapeRepo.findByCode(copiedShape.getCode()), shapeRepo.getById(4L));
    }

    @Test
    @Rollback(value = false)
    public void testMoveOfShapes() {
        testCreationOfShapes();
        shapeService = new ShapeService(shapeRepo);

        Shape current = shapeRepo.getById(1L).clone();

        // Take Action Move For Current Shape
        HashMap<String, Integer> dimensions = new HashMap<>();
        dimensions.put("x_1", 444);
        dimensions.put("y_1", 333);
        dimensions.put("x_2", 222);
        dimensions.put("y_2", 444);

        HashMap<String, String> styles = new HashMap<>();
        styles.put("stroke_style", "#fcdf");
        styles.put("fill_style", "#cdca");
        styles.put("line_width", "5");

        Shape movedShape = new Shape(current.getName(), dimensions, styles);
        movedShape.setId(current.getId());
        movedShape.setCode(current.getCode());

        shapeService.move_resize(movedShape);
        // Test After MOVING SHAPE
        assertEquals(shapeService.getAll_shapes().size(), 2);
        assertEquals(shapeRepo.getById(1L).getId(), current.getId());
        assertEquals(shapeRepo.getById(1L).getCode(), current.getCode());
        assertNotEquals(shapeRepo.getById(1L).getDimension().values(), current.getDimension().values());
        assertNotEquals(shapeRepo.getById(1L).getStyle().values(), current.getStyle().values());

        // UNDO For MOVING Command
        shapeService.undo();
        assertEquals(shapeService.getAll_shapes().size(), 2);
        assertEquals(shapeRepo.getById(1L).getId(), current.getId());
        assertEquals(shapeRepo.getById(1L).getCode(), current.getCode());
        assertEquals(shapeRepo.getById(1L).getDimension().values(), current.getDimension().values());
        assertEquals(shapeRepo.getById(1L).getStyle().values(), current.getStyle().values());

        // REDO for MOVING Command
        shapeService.redo();
        assertEquals(shapeService.getAll_shapes().size(), 2);
        assertEquals(shapeRepo.getById(1L).getId(), movedShape.getId());
        assertEquals(shapeRepo.getById(1L).getCode(), movedShape.getCode());
        assertEquals(shapeRepo.getById(1L).getDimension().values(), movedShape.getDimension().values());
        assertEquals(shapeRepo.getById(1L).getStyle().values(), movedShape.getStyle().values());
    }
}