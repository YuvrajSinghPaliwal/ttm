package com.tcs.User.config;

import java.util.Map;
import java.util.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {


    //@ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFound(UserNotFoundException e) {
        Map<String, String> res = new HashMap<>();
        res.put("message", e.getMessage());
        res.put("timestamp", new Date().toString());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
    }

    //@ExceptionHandler(EmailAlreadyRegisteredException.class)
    public ResponseEntity<Map<String, String>> handleEmailExists(EmailAlreadyRegisteredException e) {
        Map<String, String> res = new HashMap<>();
        res.put("message", e.getMessage());
        res.put("timestamp", new Date().toString());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(res);
    }

    //@ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleInvalidCredentials(InvalidCredentialsException e) {
        Map<String, String> res = new HashMap<>();
        res.put("message", e.getMessage());
        res.put("timestamp", new Date().toString());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(res);
    }

    //@ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception e) {
        Map<String, String> res = new HashMap<>();
        res.put("message", "Unexpected error: " + e.getMessage());
        res.put("timestamp", new Date().toString());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
    }
}
