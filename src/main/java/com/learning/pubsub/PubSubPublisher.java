package com.learning.pubsub;

import com.google.api.gax.core.CredentialsProvider;
import com.google.cloud.pubsub.v1.Publisher;
import com.google.protobuf.ByteString;
import com.google.pubsub.v1.ProjectTopicName;
import com.google.pubsub.v1.PubsubMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PubSubPublisher {

    private final CredentialsProvider credentialsProvider;

    private final String projectId = "platinum-trees-391313";
    private final String topicId = "c2c-lms";

    public void publishMessage(String message) {
        ProjectTopicName topicName = ProjectTopicName.of(projectId, topicId);
        Publisher publisher = null;
        try {
            publisher = Publisher.newBuilder(topicName)
                    .setCredentialsProvider(credentialsProvider)
                    .build();

            log.info("Publishing message to topic: {}", message);
            ByteString data = ByteString.copyFromUtf8(message);
            PubsubMessage pubsubMessage = PubsubMessage.newBuilder().setData(data).build();

            publisher.publish(pubsubMessage).get();
            log.info("Message published successfully");

        } catch (Exception e) {
            log.error("Failed to publish message", e);
        } finally {
            if (publisher != null) {
                try {
                    publisher.shutdown();
                    // publisher.awaitTermination(1, TimeUnit.MINUTES); // optionally wait for graceful shutdown
                } catch (Exception ex) {
                    log.error("Error shutting down publisher", ex);
                }
            }
        }

    }
}
