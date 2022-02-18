package com.example.Backend.controller;


import com.example.Backend.model.service.IShapeService;
import com.example.Backend.model.service.ShapeService;
import com.example.Backend.model.shapes.Shape;
import com.example.Backend.model.shapes.ShapeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/paint")
public class Controller {

    private final IShapeService shapeService;

    @Autowired
    public Controller(ShapeRepo shapeRepo) {
        this.shapeService = new ShapeService(shapeRepo);
    }

    @RequestMapping(value = "/shape", method = RequestMethod.POST)
    public ResponseEntity<Shape> getShape(@RequestBody Shape shape) {
        shapeService.create_shape(shape);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @RequestMapping(value = "/shapes", method = RequestMethod.GET)
    public ResponseEntity<List<Shape>> getAllShapes() {
        return new ResponseEntity<>(shapeService.getAll_shapes(), HttpStatus.OK);
    }


    @RequestMapping(value = "/copy", method = RequestMethod.POST)
    public ResponseEntity<?> copy(@RequestBody Shape shape) {
        shapeService.copy(shape);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @RequestMapping(value = "/move", method = RequestMethod.PUT)
    public ResponseEntity<?> move(@RequestBody Shape shape) {
        shapeService.move_resize(shape);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> delete(@PathVariable(value = "id") String id) {
        shapeService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/undo", method = RequestMethod.GET)
    public ResponseEntity<?> undo() { // I KNOW DEFAULT FOR REQUEST IS GET BUT FOR EASINESS:)
        shapeService.undo();
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/redo", method = RequestMethod.GET)
    public ResponseEntity<?> redo() {
        shapeService.redo();
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/new", method = RequestMethod.GET)
    public ResponseEntity<?> new_() {
        shapeService.new_();
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/save", method = RequestMethod.GET)
    public ResponseEntity<?> save() {
        shapeService.save();
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/load", method = RequestMethod.GET)
    public ResponseEntity<?> load() {
        shapeService.load();
        return new ResponseEntity<>(HttpStatus.OK);
    }
}


/*
 TO TEST THE CONTROLLER USING POSTMAN OR . HTTPIE
 FOR EXAMPLE WRITE IN THE TERMINAL -- GET IS DEFAULT
 $http GET http://localhost:8080/employee/allEmployees OR
 $http GET :8080/employee/allEmployees
 $http GET :8080/employee/find/1
 $http POST :8080/employee/add < data.json
 LET'S ASSUME YOU HAVE A FILE NAMED data.json WHICH HAS THE EMPLOYEE DATA
 $touch data.json
 $vim data.json -- PASTE IN THE TEXT EDITOR THE EMPLOYEE DATA
 $ http PUT :8080/employee/update < data.json
 $ http DELETE :8080/employee/delete/1
 AND SEE THE MAGIC WITH YOUR EYES :)
*/

