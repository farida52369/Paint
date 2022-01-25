package com.example.Backend.model.command;

import java.util.Stack;

public class CommandHistory {

    private final Stack<Command> undo;
    private final Stack<Command> redo;

    public CommandHistory() {
        undo = new Stack<>();
        redo = new Stack<>();
    }

    public void pushUndo(Command c) {
        undo.push(c);
    }

    public void pushRedo(Command c) {
        redo.push(c);
    }

    public Command popUndo() {
        return undo.pop();
    }

    public Command popRedo() {
        return redo.pop();
    }

    public boolean isEmptyUndo() {
        return undo.isEmpty();
    }

    public boolean isEmptyRedo() {
        return redo.isEmpty();
    }
}
