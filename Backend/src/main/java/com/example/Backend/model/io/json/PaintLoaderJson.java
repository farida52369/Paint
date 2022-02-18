package com.example.Backend.model.io.json;

import com.example.Backend.model.io.PaintIO;
import com.example.Backend.model.io.UI;
import com.example.Backend.model.shapes.Shape;
import com.example.Backend.model.shapes.ShapeRepo;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public class PaintLoaderJson implements PaintIO {

    private String path;

    private final ShapeRepo shapeRepo;

    public PaintLoaderJson(ShapeRepo shapeRepo) {
        this.shapeRepo = shapeRepo;
    }

    @Override
    public Shape[] load() {
        setPath();

        try (InputStream inputStream = new FileInputStream(path)) {
            ObjectMapper objectMapper = new ObjectMapper();
            TypeReference<List<Shape>> typeReference = new TypeReference<>() {
            };
            List<Shape> shapes = objectMapper.readValue(inputStream, typeReference);

            return shapes.toArray(new Shape[0]);
        } catch (IOException e) {
            e.printStackTrace();
            return new Shape[0];
        }
    }

    @Override
    public boolean save() {
        setPath();

        File targetFile = new File(path); // CREATING FILE
        try {

            // TEST THAT WE DON'T HAVE THE SAME FILE NAME IN THE PATH
            if (!targetFile.createNewFile()) return false;

            ObjectMapper objectMapper = new ObjectMapper();
            // ADDING ALL THE SHAPES IN THE FILE
            Shape[] shape_data = shapeRepo.findAll().toArray(new Shape[0]);
            objectMapper.writeValue(targetFile, shape_data);
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public void setPath() {
        this.path = UI.getPath();
        // System.out.println("Setting the path inside Paint Loader Json to be: " + path);
    }

}
