package com.example.sweetshop.exception;

public class SweetNotFoundException extends RuntimeException{

    public SweetNotFoundException(Long id){
        super("Sweet with ID " + id + " not found.");
    }
}
