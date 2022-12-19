package com.learning.controller;

import com.learning.client.BookClient;
import com.learning.shared.Book;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController 
@RequestMapping("/api-gateway/book")
public class BookController {

	private final BookClient bookClient;
	
	public BookController(BookClient bookClient) {
		this.bookClient = bookClient;
	}

	@GetMapping("/{id}")
	public Book getBookById(@PathVariable("id") int id) {
		return bookClient.getBookById(id);
	}

	@PostMapping
	public String saveBook(@RequestBody Book book) {
		bookClient.saveBook(book);
		return "Added book with id: " + book.getId();
	}
	
	@PutMapping("/{id}")
	public String updateBook(@PathVariable("id") int id, @RequestBody Book book) {
//		boolean idExist = bookClient.updateBook(id, book);
		String ref = bookClient.updateBook(id, book);
		if (ref != null && ref.length() > 0 ) {
			return "Updated book with id:" + id;
		}
		return "id not found";
	}
	
	@DeleteMapping("/{id}")
	public String deleteBookById(@PathVariable("id") int id) {
		bookClient.deleteBookById(id);
		return "delete book with id:" + id;
	}
}
