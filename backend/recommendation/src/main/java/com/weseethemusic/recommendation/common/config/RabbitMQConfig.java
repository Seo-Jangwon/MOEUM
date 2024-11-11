package com.weseethemusic.recommendation.common.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.ExchangeBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class RabbitMQConfig {

    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.queue.member-delete}")
    private String memberDeleteQueue;

    @Value("${rabbitmq.routing.member-delete}")
    private String memberDeleteRoutingKey;

    @Value("${rabbitmq.queue.member-delete-result}")
    private String memberDeleteResultQueue;

    @Value("${rabbitmq.routing.member-delete-result}")
    private String memberDeleteResultRoutingKey;

    @Bean
    public Queue memberDeleteResultQueue() {
        return QueueBuilder
            .durable(memberDeleteResultQueue)
            .withArgument("x-dead-letter-exchange", exchangeName + ".dlx")
            .withArgument("x-dead-letter-routing-key", "dead.member.delete.result")
            .withArgument("x-message-ttl", 30000)
            .build();
    }

    @Bean
    public Binding memberDeleteResultBinding() {
        return BindingBuilder
            .bind(memberDeleteResultQueue())
            .to(moeumExchange())
            .with(memberDeleteResultRoutingKey);
    }

    @Bean
    public TopicExchange moeumExchange() {
        return ExchangeBuilder
            .topicExchange(exchangeName)
            .durable(true)
            .build();
    }

    @Bean
    public Queue memberDeleteQueue() {
        return QueueBuilder
            .durable(memberDeleteQueue)
            .withArgument("x-dead-letter-exchange", exchangeName + ".dlx")
            .withArgument("x-dead-letter-routing-key", "dead.member.delete")
            .withArgument("x-message-ttl", 30000)
            .build();
    }

    @Bean
    public Queue deadLetterQueue() {
        return QueueBuilder
            .durable(memberDeleteQueue + ".dlq")
            .build();
    }

    @Bean
    public DirectExchange deadLetterExchange() {
        return ExchangeBuilder
            .directExchange(exchangeName + ".dlx")
            .durable(true)
            .build();
    }

    @Bean
    public Binding deadLetterBinding() {
        return BindingBuilder
            .bind(deadLetterQueue())
            .to(deadLetterExchange())
            .with("dead.member.delete");
    }

    @Bean
    public Binding memberDeleteBinding() {
        return BindingBuilder
            .bind(memberDeleteQueue())
            .to(moeumExchange())
            .with(memberDeleteRoutingKey);
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

    // 음악 관련
    @Value("${rabbitmq.queue.genre-sync}")
    private String genreSyncQueue;

    @Value("${rabbitmq.routing.genre-sync}")
    private String genreSyncRoutingKey;

    @Value("${rabbitmq.queue.genre-sync-result}")
    private String genreSyncResultQueue;

    @Value("${rabbitmq.routing.genre-sync-result}")
    private String genreSyncResultRoutingKey;

    @Value("${rabbitmq.queue.music-sync}")
    private String musicSyncQueue;

    @Value("${rabbitmq.routing.music-sync}")
    private String musicSyncRoutingKey;

    @Value("${rabbitmq.queue.music-sync-result}")
    private String musicSyncResultQueue;

    @Value("${rabbitmq.routing.music-sync-result}")
    private String musicSyncResultRoutingKey;

    @Value("${rabbitmq.queue.album-sync}")
    private String albumSyncQueue;

    @Value("${rabbitmq.queue.album-sync-result}")
    private String albumSyncResultQueue;

    @Value("${rabbitmq.routing.album-sync}")
    private String albumSyncRoutingKey;

    @Value("${rabbitmq.routing.album-sync-result}")
    private String albumSyncResultRoutingKey;

    @Value("${rabbitmq.queue.artist-sync}")
    private String artistSyncQueue;

    @Value("${rabbitmq.queue.artist-sync-result}")
    private String artistSyncResultQueue;

    @Value("${rabbitmq.routing.artist-sync}")
    private String artistSyncRoutingKey;

    @Value("${rabbitmq.routing.artist-sync-result}")
    private String artistSyncResultRoutingKey;

    @Bean
    public Queue genreSyncQueue() {
        return QueueBuilder
            .durable(genreSyncQueue)
            .withArgument("x-dead-letter-exchange", exchangeName + ".dlx")
            .withArgument("x-dead-letter-routing-key", "dead.genre.sync")
            .withArgument("x-message-ttl", 30000)
            .build();
    }

    @Bean
    public Queue genreSyncResultQueue() {
        return QueueBuilder
            .durable(genreSyncResultQueue)
            .withArgument("x-dead-letter-exchange", exchangeName + ".dlx")
            .withArgument("x-dead-letter-routing-key", "dead.genre.sync.result")
            .withArgument("x-message-ttl", 30000)
            .build();
    }

    @Bean
    public Queue musicSyncQueue() {
        return QueueBuilder
            .durable(musicSyncQueue)
            .withArgument("x-dead-letter-exchange", exchangeName + ".dlx")
            .withArgument("x-dead-letter-routing-key", "dead.music.sync")
            .withArgument("x-message-ttl", 30000)
            .build();
    }

    @Bean
    public Queue musicSyncResultQueue() {
        return QueueBuilder
            .durable(musicSyncResultQueue)
            .withArgument("x-dead-letter-exchange", exchangeName + ".dlx")
            .withArgument("x-dead-letter-routing-key", "dead.music.sync.result")
            .withArgument("x-message-ttl", 30000)
            .build();
    }

    @Bean
    public Binding genreSyncBinding() {
        return BindingBuilder
            .bind(genreSyncQueue())
            .to(moeumExchange())
            .with(genreSyncRoutingKey);
    }

    @Bean
    public Binding genreSyncResultBinding() {
        return BindingBuilder
            .bind(genreSyncResultQueue())
            .to(moeumExchange())
            .with(genreSyncResultRoutingKey);
    }

    @Bean
    public Binding musicSyncBinding() {
        return BindingBuilder
            .bind(musicSyncQueue())
            .to(moeumExchange())
            .with(musicSyncRoutingKey);
    }

    @Bean
    public Binding musicSyncResultBinding() {
        return BindingBuilder
            .bind(musicSyncResultQueue())
            .to(moeumExchange())
            .with(musicSyncResultRoutingKey);
    }

    @Bean
    public Queue genreSyncDeadLetterQueue() {
        return QueueBuilder
            .durable(genreSyncQueue + ".dlq")
            .build();
    }

    @Bean
    public Queue musicSyncDeadLetterQueue() {
        return QueueBuilder
            .durable(musicSyncQueue + ".dlq")
            .build();
    }

    @Bean
    public Binding genreSyncDeadLetterBinding() {
        return BindingBuilder
            .bind(genreSyncDeadLetterQueue())
            .to(deadLetterExchange())
            .with("dead.genre.sync");
    }

    @Bean
    public Binding musicSyncDeadLetterBinding() {
        return BindingBuilder
            .bind(musicSyncDeadLetterQueue())
            .to(deadLetterExchange())
            .with("dead.music.sync");
    }

    @Bean
    public Queue albumSyncQueue() {
        return QueueBuilder
            .durable(albumSyncQueue)
            .withArgument("x-dead-letter-exchange", exchangeName + ".dlx")
            .withArgument("x-dead-letter-routing-key", "dead.album.sync")
            .withArgument("x-message-ttl", 30000)
            .build();
    }

    @Bean
    public Queue albumSyncResultQueue() {
        return QueueBuilder
            .durable(albumSyncResultQueue)
            .withArgument("x-dead-letter-exchange", exchangeName + ".dlx")
            .withArgument("x-dead-letter-routing-key", "dead.album.sync.result")
            .withArgument("x-message-ttl", 30000)
            .build();
    }

    @Bean
    public Binding albumSyncBinding() {
        return BindingBuilder
            .bind(albumSyncQueue())
            .to(moeumExchange())
            .with(albumSyncRoutingKey);
    }

    @Bean
    public Binding albumSyncResultBinding() {
        return BindingBuilder
            .bind(albumSyncResultQueue())
            .to(moeumExchange())
            .with(albumSyncResultRoutingKey);
    }

    @Bean
    public Queue artistSyncQueue() {
        return QueueBuilder
            .durable(artistSyncQueue)
            .withArgument("x-dead-letter-exchange", exchangeName + ".dlx")
            .withArgument("x-dead-letter-routing-key", "dead.artist.sync")
            .withArgument("x-message-ttl", 30000)
            .build();
    }

    @Bean
    public Queue artistSyncResultQueue() {
        return QueueBuilder
            .durable(artistSyncResultQueue)
            .withArgument("x-dead-letter-exchange", exchangeName + ".dlx")
            .withArgument("x-dead-letter-routing-key", "dead.artist.sync.result")
            .withArgument("x-message-ttl", 30000)
            .build();
    }

    @Bean
    public Binding artistSyncBinding() {
        return BindingBuilder
            .bind(artistSyncQueue())
            .to(moeumExchange())
            .with(artistSyncRoutingKey);
    }

    @Bean
    public Binding artistSyncResultBinding() {
        return BindingBuilder
            .bind(artistSyncResultQueue())
            .to(moeumExchange())
            .with(artistSyncResultRoutingKey);
    }

}