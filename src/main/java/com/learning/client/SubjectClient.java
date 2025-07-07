/*
package com.learning.client;

import com.learning.shared.Subject;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "subject-client", url = "http://localhost:8080/subjects")
public interface SubjectClient {
	@GetMapping("/{id}")
	public Subject getAllSubjects(@PathVariable("id") String id);
	
	@PostMapping
	public void addSubject(@RequestBody Subject subject);
	
	@PutMapping("/{id}")
	public void updateSubject(@PathVariable("id") String id, @RequestBody Subject subject);

	@DeleteMapping("/{id}")
	public void deleteSubject(@PathVariable("id") String id);

}
*/
