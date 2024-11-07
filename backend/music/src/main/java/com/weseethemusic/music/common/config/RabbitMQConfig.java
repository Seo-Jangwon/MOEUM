package com.weseethemusic.music.common.config;

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
}