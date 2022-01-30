package com.example.Backend.model.io.json;

import com.example.Backend.model.service.Singleton;
import com.example.Backend.model.io.PaintIO;
import com.example.Backend.model.io.UI;
import com.example.Backend.model.shapes.Shape;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public class PaintLoaderJson implements PaintIO {

    private String path;

    public PaintLoaderJson() {
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
        Singleton uniqueInstance = Singleton.getInstance();
        setPath();

        File targetFile = new File(path); // CREATING FILE
        try {

            // TEST THAT WE DON'T HAVE THE SAME FILE NAME IN THE PATH
            if (!targetFile.createNewFile()) return false;

            ObjectMapper objectMapper = new ObjectMapper();
            // ADDING ALL THE SHAPES IN THE FILE
            Shape[] shape_data = uniqueInstance.getAll_shapes().toArray(new Shape[0]);
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
