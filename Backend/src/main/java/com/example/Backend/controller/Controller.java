package com.example.Backend.controller;


import com.example.Backend.model.service.ISingleton;
import com.example.Backend.model.service.Singleton;
import com.example.Backend.model.shapes.Shape;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class Controller {

    ISingleton singleton = Singleton.getInstance();

    @RequestMapping(value = "/shape", method = RequestMethod.POST)
    public Shape getShape(@RequestBody Shape shape) {
        singleton.create_shape(shape);
        return singleton.last_added_shape();
    }

    @RequestMapping(value = "/shapes", method = RequestMethod.GET)
    public List<Shape> getAllShapes() {
        return singleton.getAll_shapes();
    }


    @RequestMapping(value = "/copy", method = RequestMethod.POST)
    public Shape copy(@RequestParam(value = "id") String id,
                      @RequestParam(value = "dimension") String dimension) {
        UUID uuid = UUID.fromString(id);
        singleton.copy(uuid, dimension);
        return singleton.last_added_shape();
    }

    @RequestMapping(value = "/move", method = RequestMethod.POST)
    public void move(@RequestParam(value = "id") String id,
                     @RequestParam(value = "dimension") String dimension,
                     @RequestParam(value = "style") String style) {
        UUID uuid = UUID.fromString(id);
        singleton.move_resize(uuid, dimension, style);
    }

    @RequestMapping(value = "/delete", method = RequestMethod.DELETE)
    public void delete(@RequestParam(value = "id") String id) {
        UUID uuid = UUID.fromString(id);
        singleton.delete(uuid);
    }

    @RequestMapping(value = "/undo", method = RequestMethod.GET)
    public void undo() { // I KNOW DEFAULT FOR REQUEST IS GET BUT FOR EASINESS:)
        singleton.undo();
    }

    @RequestMapping(value = "/redo", method = RequestMethod.GET)
    public void redo() {
        singleton.redo();
    }

    @RequestMapping(value = "/new", method = RequestMethod.GET)
    public void new_() {
        singleton.new_();
    }

    @RequestMapping(value = "/save", method = RequestMethod.GET)
    public void save() {
        singleton.save();
    }

    @RequestMapping(value = "/load", method = RequestMethod.GET)
    public void load() {
        singleton.load();
    }
}
