/*
package com.learning.controller;

import com.learning.client.SubjectClient;
import com.learning.shared.Subject;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/api-gateway/subjects")
public class SubjectController {

	private final SubjectClient subjectClient;

	public SubjectController(SubjectClient subjectClient) {
		this.subjectClient = subjectClient;
	}
	
	@GetMapping("/{id}")
	public Subject getAllSubjects(@PathVariable("id") String id){
		return subjectClient.getAllSubjects(id);
	}

	@PostMapping
	public void addSubject(@RequestBody Subject subject) {
		subjectClient.addSubject(subject);
	}
	
	@PutMapping("/{id}")
	public void updateSubject(@PathVariable("id") String id, @RequestBody Subject subject) {
		subjectClient.updateSubject(id,subject);
	}
	
	@DeleteMapping("/{id}")
	public void deleteSubject(@PathVariable("id") String id) {
		subjectClient.deleteSubject(id);
	}
}
*/
