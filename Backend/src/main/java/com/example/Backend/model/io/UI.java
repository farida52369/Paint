package com.example.Backend.model.io;

import javax.swing.*;
import javax.swing.filechooser.FileNameExtensionFilter;
import java.awt.*;
import java.io.File;
import java.io.IOException;

public class UI {

    private static String path;

    public UI() {
    }

    private void getPathForSave() {
        // For Swing To Work With Spring Boot
        System.setProperty("java.awt.headless", "false");
        String extension, pathName;  // Path Variables

        JFrame frame = new JFrame();  // The Frame -- Swing FrameWork
        frame.setSize(800, 600);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setPreferredSize(new Dimension(800, 600));
        fileChooser.setVisible(true);
        frame.setAlwaysOnTop(true);
        fileChooser.setDialogTitle("Specify a folder to save in:");
        fileChooser.addChoosableFileFilter(new FileNameExtensionFilter(".json", "json"));
        fileChooser.addChoosableFileFilter(new FileNameExtensionFilter(".xml", "xml"));
        fileChooser.removeChoosableFileFilter(fileChooser.getAcceptAllFileFilter());

        int userSelect = fileChooser.showSaveDialog(frame);
        if (userSelect == JFileChooser.APPROVE_OPTION) {
            File targetFileName = fileChooser.getSelectedFile();
            extension = fileChooser.getFileFilter().getDescription();
            try {
                pathName = targetFileName.getCanonicalPath();
                frame.remove(fileChooser);
                path = pathName + extension;
            } catch (IOException e) {
                e.printStackTrace();
                path = "No Such Place";
            }
        } else if (userSelect == JFileChooser.CANCEL_OPTION) {
            fileChooser.setVisible(false);
            frame.remove(fileChooser);
            path = "No Such Place";
        }
    }

    private void getPathForUpload() {
        System.setProperty("java.awt.headless", "false");
        String pathName;
        JFrame frame = new JFrame();
        frame.setSize(800, 600);

        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setPreferredSize(new Dimension(800, 600));

        fileChooser.setVisible(true);
        frame.setAlwaysOnTop(true);
        fileChooser.setDialogTitle("Specify a file to upload:");
        fileChooser.addChoosableFileFilter(new FileNameExtensionFilter(".json", "json"));
        fileChooser.addChoosableFileFilter(new FileNameExtensionFilter(".xml", "xml"));
        fileChooser.removeChoosableFileFilter(fileChooser.getAcceptAllFileFilter());

        int userSelection = fileChooser.showSaveDialog(frame);
        if (userSelection == JFileChooser.APPROVE_OPTION) {
            File fileToLoad = fileChooser.getSelectedFile();
            try {
                pathName = fileToLoad.getCanonicalPath();
                frame.remove(fileChooser);
                path = pathName; // Set The Path
            } catch (IOException e) {
                e.printStackTrace();
                path = "No Such Place";
            }
        } else if (userSelection == JFileChooser.CANCEL_OPTION) {
            fileChooser.setVisible(false);
            frame.remove(fileChooser);
            path = "No Such Place";
        }
    }

    public void setPath(String type) {
        if (type.equalsIgnoreCase("save")) getPathForSave();
        else if (type.equalsIgnoreCase("load")) getPathForUpload();
    }

    public static String getPath() {
        System.out.println("The Path Inside UI: " + path);
        return path;
    }
}
