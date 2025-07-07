package com.learning.pubsub;

import com.google.api.gax.core.CredentialsProvider;
import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.pubsub.v1.Subscriber;
import com.google.cloud.pubsub.v1.Publisher;
import com.google.pubsub.v1.ProjectTopicName;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;

@Slf4j
@Configuration
public class PubSubConfig {

    private final String projectId = "platinum-trees-391313";
    private final String topicId = "c2c-lms";
    private final String credentialsPath = "/home/sakshi/Downloads/clientLibraryConfig-github-provider.json";

    @Bean
    public GoogleCredentials googleCredentials() throws IOException {
        log.info("Loading Google credentials from {}", credentialsPath);
        return GoogleCredentials.fromStream(new FileInputStream(credentialsPath));
    }

    @Bean
    public CredentialsProvider credentialsProvider(GoogleCredentials credentials) {
        return FixedCredentialsProvider.create(credentials);
    }

    @Bean
    public Publisher publisher(CredentialsProvider credentialsProvider) throws IOException {
        ProjectTopicName topicName = ProjectTopicName.of(projectId, topicId);
        log.info("Creating PubSub publisher for topic {}", topicName.toString());
        return Publisher.newBuilder(topicName).setCredentialsProvider(credentialsProvider).build();
    }
}
