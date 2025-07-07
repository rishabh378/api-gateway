/*
package com.learning.client;

import com.learning.shared.Book;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@FeignClient(name = "book-client", url = "http://localhost:8081/book")
public interface BookClient {

	@GetMapping("/{id}")
	public Book getBookById(@PathVariable("id") int id);

	@PostMapping
	public String saveBook(@RequestBody Book book);
	
	@PutMapping("/{id}")
	public String updateBook(@PathVariable("id") int id, @RequestBody Book book);
	
	@DeleteMapping("/{id}")
	public String deleteBookById(@PathVariable("id") int id);

}
*/
