package com.example.Backend.model.io.xml;

import com.example.Backend.model.service.Singleton;
import com.example.Backend.model.io.PaintIO;
import com.example.Backend.model.io.UI;
import com.example.Backend.model.shapes.Shape;

import java.beans.XMLDecoder;
import java.beans.XMLEncoder;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class PaintLoaderXml implements PaintIO {

    private String path;

    public PaintLoaderXml() {
    }

    @Override
    public Shape[] load() {
        setPath();

        File targetFile = new File(path); // CREATE TARGET FILE
        // SHAPE TO HOLD THE SHAPES THEN DRAW TO GET A UNIQUE ID FOR EACH
        Shape[] shapes;
        // FILE INPUT STREAM
        FileInputStream fileStream;
        try {
            fileStream = new FileInputStream(targetFile);
            XMLDecoder decoder = new XMLDecoder(fileStream);
            shapes = (Shape[]) decoder.readObject();
            decoder.close();
            fileStream.close();
            return shapes;
        } catch (IOException e) {
            e.printStackTrace();
            return new Shape[0];
        }
    }

    @Override
    public boolean save() {
        Singleton uniqueInstance = Singleton.getInstance();
        setPath();

        // SERIALIZE OR ENCODE JAVA OBJECT INTO XML FILE
        File targetFile = new File(path);  // CREATING FILE

        // TEST THAT WE DON'T HAVE THE SAME FILE NAME IN THE PATH
        try {
            if (!targetFile.createNewFile()) return false;

            // ADDING ALL THE SHAPES IN THE FILE
            Shape[] shapes = uniqueInstance.getAll_shapes().toArray(new Shape[0]);

            // FILE OUT STREAM IS REQUIRED FOR XML_ENCODER
            FileOutputStream fileStream = new FileOutputStream(targetFile);
            XMLEncoder encoder = new XMLEncoder(fileStream);

            encoder.setExceptionListener(e -> System.out.println("Error! Exception"));

            encoder.writeObject(shapes);

            // CLOSING THE ENCODER AND FILE OUT STREAM REQUIRE CLOSING TOO
            encoder.close();
            fileStream.close();
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public void setPath() {
        this.path = UI.getPath();
        System.out.println("Setting the path inside Paint Loader XML to be: " + path);
    }

}
