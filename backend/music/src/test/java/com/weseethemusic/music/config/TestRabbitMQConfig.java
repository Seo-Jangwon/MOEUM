package com.weseethemusic.music.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;


@TestConfiguration
public class TestRabbitMQConfig {

    private static final Logger log = LoggerFactory.getLogger(TestRabbitMQConfig.class);

    @Bean
    public Queue artistSyncQueue() {
        return new Queue("moeum.queue.artist.sync.test", false);
    }

    @Bean
    public Queue albumSyncQueue() {
        return new Queue("moeum.queue.album.sync.test", false);
    }

    @Bean
    public Queue genreSyncQueue() {
        return new Queue("moeum.queue.genre.sync.test", false);
    }

    @Bean
    public Queue musicSyncQueue() {
        return new Queue("moeum.queue.music.sync.test", false);
    }

    @Bean
    public TopicExchange testExchange() {
        return new TopicExchange("moeum.exchange.test");
    }

    @Bean
    public Binding artistSyncBinding(Queue artistSyncQueue, TopicExchange testExchange) {
        return BindingBuilder.bind(artistSyncQueue)
            .to(testExchange)
            .with("moeum.routing.artist.sync.test");
    }

    @Bean
    public Binding albumSyncBinding(Queue albumSyncQueue, TopicExchange testExchange) {
        return BindingBuilder.bind(albumSyncQueue)
            .to(testExchange)
            .with("moeum.routing.album.sync.test");
    }

    @Bean
    public Binding genreSyncBinding(Queue genreSyncQueue, TopicExchange testExchange) {
        return BindingBuilder.bind(genreSyncQueue)
            .to(testExchange)
            .with("moeum.routing.genre.sync.test");
    }

    @Bean
    public Binding musicSyncBinding(Queue musicSyncQueue, TopicExchange testExchange) {
        return BindingBuilder.bind(musicSyncQueue)
            .to(testExchange)
            .with("moeum.routing.music.sync.test");
    }

    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        template.setConfirmCallback((correlationData, ack, cause) -> {
            if (!ack) {
                log.info("Message didn't reach exchange: {}", cause);
            }
        });
        template.setReturnsCallback(returned -> {
            log.info("Message returned: {}", returned.getMessage());
        });
        return template;
    }
}