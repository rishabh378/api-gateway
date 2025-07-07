package com.learning.pubsub;

import com.google.api.gax.core.CredentialsProvider;
import com.google.cloud.pubsub.v1.AckReplyConsumer;
import com.google.cloud.pubsub.v1.MessageReceiver;
import com.google.cloud.pubsub.v1.Subscriber;
import com.google.pubsub.v1.ProjectSubscriptionName;
import com.google.pubsub.v1.PubsubMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Slf4j
@Service
@RequiredArgsConstructor
public class PubSubSubscriber {

    private final CredentialsProvider credentialsProvider;
    private final String projectId = "platinum-trees-391313";
    private final String subscriptionId = "c2c-lms";

    @PostConstruct
    public void startSubscriber() {
        ProjectSubscriptionName subscriptionName = ProjectSubscriptionName.of(projectId, subscriptionId);
        log.info("Starting subscriber for subscription: {}", subscriptionName.toString());

        MessageReceiver receiver = (PubsubMessage message, AckReplyConsumer consumer) -> {
            log.info("Received message ID: {}", message.getMessageId());
            log.info("Message data: {}", message.getData().toStringUtf8());
            consumer.ack();
            log.info("Message acknowledged");
        };

        Subscriber subscriber = Subscriber.newBuilder(subscriptionName, receiver)
                .setCredentialsProvider(credentialsProvider)
                .build();

        subscriber.addListener(new Subscriber.Listener() {
            @Override
            public void failed(Subscriber.State from, Throwable failure) {
                log.error("Subscriber failed with state: {}, error: {}", from, failure.getMessage(), failure);
            }
        }, Runnable::run);

        subscriber.startAsync().awaitRunning();
        log.info("Subscriber is now listening for messages...");
    }
}
