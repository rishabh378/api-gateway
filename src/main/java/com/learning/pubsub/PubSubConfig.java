package com.learning.pubsub;

import com.google.api.gax.core.CredentialsProvider;
import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.GoogleCredentials;
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
    public GoogleCredentials googleCredentials() throws IOException {
        // Load external account credentials
        log.info("Loading Google credentials from GOOGLE_APPLICATION_CREDENTIALS");
        return GoogleCredentials.getApplicationDefault();
    }

    @Bean
    public CredentialsProvider credentialsProvider(GoogleCredentials credentials) {
        return FixedCredentialsProvider.create(credentials);
    }

    @Bean
    public Publisher publisher(CredentialsProvider credentialsProvider) throws IOException {
        ProjectTopicName topicName = ProjectTopicName.of(projectId, topicId);
        return Publisher.newBuilder(topicName)
                .setCredentialsProvider(credentialsProvider)
                .build();
    }
}
