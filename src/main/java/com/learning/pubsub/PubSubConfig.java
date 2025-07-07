package com.learning.pubsub;

import com.google.cloud.pubsub.v1.Publisher;
import com.google.pubsub.v1.ProjectTopicName;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Slf4j
@Configuration
public class PubSubConfig {

    private final String projectId = "platinum-trees-391313";
    private final String topicId = "c2c-lms";

    @Bean
    public Publisher publisher() throws IOException {
        ProjectTopicName topicName = ProjectTopicName.of(projectId, topicId);
        // Use default credentials (ADC: Application Default Credentials)
        return Publisher.newBuilder(topicName)
                .build();
    }
}
