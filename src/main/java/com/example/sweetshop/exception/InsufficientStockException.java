package com.example.sweetshop.exception;

public class InsufficientStockException extends RuntimeException{
    public InsufficientStockException(String sweetName, int available, int requested){
        super("Insufficient stock for " + sweetName + ". Available: " + available + ", Requested: " + requested);
    }
}
