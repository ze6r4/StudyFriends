package com.example.StudyFriends.controllers;

import com.example.StudyFriends.services.BookService;
import com.example.StudyFriends.services.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class BookController {
    @Autowired
    private SessionService sessionService;

    @Autowired
    private BookService bookService;

    @GetMapping("/books/{id}")
    public ResponseEntity<?> getBook(@PathVariable Long id){
        return ResponseEntity.ok(bookService.getBook(id));
    }

}


