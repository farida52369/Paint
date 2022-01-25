package com.example.Backend.model.command;

import com.example.Backend.model.service.Singleton;

public abstract class Command {

    public Singleton singleton = Singleton.getInstance();

    public abstract void redo();

    public abstract void undo();

    public abstract boolean execute();

    @Override
    public String toString() {
        return "Command Type: " + this.getClass().getSimpleName();
    }
}
