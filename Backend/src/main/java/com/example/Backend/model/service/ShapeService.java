package com.example.Backend.model.service;

import com.example.Backend.model.command.*;
import com.example.Backend.model.io.PaintIO;
import com.example.Backend.model.io.UI;
import com.example.Backend.model.io.json.PaintLoaderJson;
import com.example.Backend.model.io.xml.PaintLoaderXml;
import com.example.Backend.model.shapes.Shape;
import com.example.Backend.model.shapes.ShapeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Service
public class ShapeService implements IShapeService {

    // Save & Load Variables
    private UI uiSaveLoad;
    private PaintIO paintIOJson;
    private PaintIO paintIOXml;

    // Command -- FOR UNDO REDO STACK
    private CommandHistory history;

    // SQL -- INSTEAD OF A LIST<SHAPE>
    private final ShapeRepo shapeRepo;

    @Autowired
    public ShapeService(ShapeRepo shapeRepo) {
        this.shapeRepo = shapeRepo;
        this.helperToNew();
    }

    // ExecuteCommand to push the command in the Stack.
    private void executeCommand(Command command) {
        if (command.execute()) {
            history.pushUndo(command);
        }
    }

    private void restartTable() {
        try {
            // Change The Two Arguments Depending On your SQL
            Connection connection = DriverManager.getConnection(
                    "jdbc:mysql://localhost:3306/shapes", "username", "password");
            Statement statement = connection.createStatement();
            statement.execute("REPAIR TABLE shapes.shape"); // TO REPAIR THE TABLE CONTINUOUSLY
            statement.execute("TRUNCATE TABLE shape"); // DELETE ALL THE ENTITIES AND RESET PK
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private void helperToNew() {
        // Save & Load Variables Initialization
        this.uiSaveLoad = new UI();
        this.paintIOXml = new PaintLoaderXml(shapeRepo);
        this.paintIOJson = new PaintLoaderJson(shapeRepo);

        // Command
        this.history = new CommandHistory();
    }

    @Override
    public List<Shape> getAll_shapes() {
        // shapeRepo.findAll().forEach(System.out::println);
        return shapeRepo.findAll();
    }

    @Override
    public void redo() {
        if (history.isEmptyRedo()) return;

        Command command = history.popRedo();
        if (command != null) {
            System.out.println("Redo For ...\n" + command);
            command.redo();
            history.pushUndo(command);
        }
    }

    @Override
    public void undo() {
        if (history.isEmptyUndo()) return;

        Command command = history.popUndo();
        if (command != null) {
            System.out.println("Undo For ...\n" + command);
            command.undo();
            history.pushRedo(command);
        }
    }

    @Override
    public void create_shape(Shape shape) {
        // Add Shape Command
        executeCommand(new CreateCommand(shapeRepo, shape));
    }

    @Override
    public void copy(Shape shape) {
        // Copy Command
        shape.setId(null);
        executeCommand(new CreateCommand(shapeRepo, shape));
    }

    @Override
    public void move_resize(Shape shape) {
        // Move & Resize Command
        executeCommand(new ChangeCommand(shapeRepo, shape));
    }

    @Override
    public void delete(String id) {
        // Delete Command
        executeCommand(new DeleteCommand(shapeRepo, id));
    }

    @Override
    public void new_() {
        // Clear The DB
        // shapeRepo.deleteAll();
        helperToNew();
        restartTable();
    }

    @Override
    public void load() {
        uiSaveLoad.setPath("load");
        String path = UI.getPath();

        if (!path.equalsIgnoreCase("No Such Place")) {
            Optional<String> file = Optional.of(path)
                    .filter(ele -> ele.contains("."))
                    .map(ele -> ele.substring(path.lastIndexOf(".") + 1));

            Shape[] shapes = new Shape[0];
            if (file.isPresent()) {
                if (file.get().equalsIgnoreCase("json"))
                    shapes = paintIOJson.load();
                else if (file.get().equalsIgnoreCase("xml"))
                    shapes = paintIOXml.load();
            }

            new_();
            for (Shape shape : shapes) { // DRAW THE SHAPES
                executeCommand(new CreateCommand(shapeRepo, shape));
            }
        }
    }

    @Override
    public void save() {
        uiSaveLoad.setPath("save");

        String path = UI.getPath();
        if (!path.equalsIgnoreCase("No Such Place")) {
            Optional<String> file = Optional.of(path)
                    .filter(ele -> ele.contains("."))
                    .map(ele -> ele.substring(path.lastIndexOf(".") + 1));

            if (file.isPresent()) {
                if (file.get().equalsIgnoreCase("json"))
                    paintIOJson.save();
                else if (file.get().equalsIgnoreCase("xml"))
                    paintIOXml.save();
            }
        }
    }
}