package com.example.Backend.model.service;

import com.example.Backend.model.command.*;
import com.example.Backend.model.io.PaintIO;
import com.example.Backend.model.io.UI;
import com.example.Backend.model.io.json.PaintLoaderJson;
import com.example.Backend.model.io.xml.PaintLoaderXml;
import com.example.Backend.model.shapes.Shape;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.util.*;

public class Singleton implements ISingleton {

    private List<Shape> all_shapes;
    private static Singleton uniqueInstance;

    // Save & Load Variables
    private UI uiSaveLoad;
    private PaintIO paintIOJson;
    private PaintIO paintIOXml;

    // Command
    private CommandHistory history;

    private Singleton() {
        this.new_();
    }

    public static synchronized Singleton getInstance() {
        if (uniqueInstance == null) {
            uniqueInstance = new Singleton();
        }
        return uniqueInstance;
    }


    public List<Shape> getAll_shapes() {
        // All Shapes (get)
        return all_shapes;
    }

    public void setAll_shapes(List<Shape> all_shapes) {
        // All Shapes (set)
        this.all_shapes = all_shapes;
    }

    public HashMap<String, String> fromJSONObjectToHashMap(String JSONString) {
        return new Gson().fromJson(JSONString,
                new TypeToken<HashMap<String, String>>() {
                }.getType());
    }

    public Shape last_added_shape() {
        return all_shapes.get(all_shapes.size() - 1);
    }

    // ExecuteCommand to push the command in the Stack.
    private void executeCommand(Command command) {
        if (command.execute()) {
            history.pushUndo(command);
            // backup is EMPTY!
        }
    }

    @Override
    public void redo() {
        if (history.isEmptyRedo()) return;

        Command command = history.popRedo();
        if (command != null) {
            System.out.println("Undo For ...\n" + command);
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
        executeCommand(new CreateCommand(shape));
    }

    @Override
    public void copy(UUID id, String dimensions) {
        HashMap<String, String> dim = fromJSONObjectToHashMap(dimensions);
        Shape copiedShape = all_shapes.stream()
                .filter(shape -> shape.getId().equals(id)).findAny().orElse(null);

        assert copiedShape != null;
        Shape tempCopied = (Shape) copiedShape.clone();
        tempCopied.setShapeDimension(dim);
        executeCommand(new CreateCommand(tempCopied));
    }

    @Override
    public void move_resize(UUID id, String dimensions) {
        executeCommand(new ChangeCommand(id, fromJSONObjectToHashMap(dimensions)));
    }

    @Override
    public void delete(UUID id) {
        executeCommand(new DeleteCommand(id));
    }

    @Override
    public void new_() {
        this.all_shapes = new ArrayList<>();

        // Save & Load Variables Initialization
        this.uiSaveLoad = new UI();
        this.paintIOXml = new PaintLoaderXml();
        this.paintIOJson = new PaintLoaderJson();

        // Command
        this.history = new CommandHistory();
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
            setAll_shapes(new ArrayList<>());
            for (Shape shape : shapes) { // DRAW THE SHAPES
                executeCommand(new CreateCommand(shape));
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