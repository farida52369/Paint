package com.example.Backend.model.service;

import com.example.Backend.model.command.ChangeCommand;
import com.example.Backend.model.command.Command;
import com.example.Backend.model.command.CreateCommand;
import com.example.Backend.model.command.DeleteCommand;
import com.example.Backend.model.shapes.Shape;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;

class SimpleSingletonTest {

    Shape currentShape;

    @BeforeEach
    void init() {

        HashMap<String, Integer> dimensions = new HashMap<>();
        dimensions.put("start_x", 100);
        dimensions.put("start_y", 150);
        dimensions.put("end_x", 300);
        dimensions.put("end_y", 240);

        HashMap<String, String> styles = new HashMap<>();
        styles.put("strokeStyle", "#fff");
        styles.put("fillStyle", "#ccc");
        styles.put("lineWidth", "2");
        currentShape = new Shape("circle", dimensions, styles);
    }

    @Test
    void executeCommandCreateDeleteChange() {
        assertNotEquals(null, currentShape);

        // Creation
        Command createCommand = new CreateCommand(currentShape);
        assertTrue(createCommand.execute());
        assertEquals(createCommand.singleton.getAll_shapes().get(0).getShapeName(), currentShape.getShapeName());
        assertEquals(createCommand.singleton.getAll_shapes().get(0).getShapeDimension(), currentShape.getShapeDimension());
        assertEquals(createCommand.singleton.getAll_shapes().get(0).getShapeStyle(), currentShape.getShapeStyle());
        assertNotEquals(null, createCommand.singleton.getAll_shapes().get(0).getId());

        // Set ID for current Shape
        currentShape.setId(createCommand.singleton.getAll_shapes().get(0).getId());

        // Changing
        HashMap<String, Integer> dimensions = new HashMap<>();
        dimensions.put("start_x", 200);
        dimensions.put("start_y", 10);
        dimensions.put("end_x", 200);
        dimensions.put("end_y", 440);

        HashMap<String, String> styles = new HashMap<>();
        styles.put("strokeStyle", "#ddd");
        styles.put("fillStyle", "#cca");
        styles.put("lineWidth", "5");

        Command changeCommand = new ChangeCommand(currentShape.getId(), dimensions, styles);
        assertTrue(changeCommand.execute());
        assertEquals(changeCommand.singleton.getAll_shapes().get(0).getShapeDimension(), dimensions);
        assertEquals(changeCommand.singleton.getAll_shapes().get(0).getShapeStyle(), styles);

        // Undo Change Command
        changeCommand.undo();
        assertEquals(changeCommand.singleton.getAll_shapes().get(0).getShapeDimension(), currentShape.getShapeDimension());
        assertEquals(changeCommand.singleton.getAll_shapes().get(0).getShapeStyle(), currentShape.getShapeStyle());

        // Deleting Current Shape
        Command deleteCommand = new DeleteCommand(currentShape.getId());
        assertTrue(deleteCommand.execute());
        assertNull(deleteCommand.singleton.getAll_shapes().stream()
                .filter(shape -> shape.getId().equals(currentShape.getId())).findAny().orElse(null));

        // Undo Deleting Current Shape
        deleteCommand.undo();
        assertEquals(currentShape.getShapeName(), deleteCommand.singleton.getAll_shapes().get(0).getShapeName());
        assertEquals(currentShape.getId(), deleteCommand.singleton.getAll_shapes().get(0).getId());
        assertEquals(currentShape.getShapeDimension(), deleteCommand.singleton.getAll_shapes().get(0).getShapeDimension());
        assertEquals(currentShape.getShapeStyle(), deleteCommand.singleton.getAll_shapes().get(0).getShapeStyle());

        // Undo Creation __ Bye Bye Bye
        createCommand.undo();
        assertEquals(createCommand.singleton.getAll_shapes().size(), 0);
    }


}