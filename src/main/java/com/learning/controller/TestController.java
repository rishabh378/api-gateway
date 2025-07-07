package com.learning.controller;

import com.learning.pubsub.PubSubPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class TestController {

    private final PubSubPublisher publisher;

    @GetMapping("/publish")
    public void publishMessage() {
        publisher.publishMessage("Hello from Spring Boot Pub/Sub publisher!");
    }
}
