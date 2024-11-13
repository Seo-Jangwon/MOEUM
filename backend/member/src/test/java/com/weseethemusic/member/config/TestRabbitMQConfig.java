package com.weseethemusic.member.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

@TestConfiguration
class TestRabbitMQConfig {
    @Bean
    public Queue testQueue() {
        return new Queue("moeum.queue.member.delete.result.test", false);
    }

    @Bean
    public TopicExchange testExchange() {
        return new TopicExchange("moeum.exchange.test");
    }

    @Bean
    public Binding testBinding(Queue testQueue, TopicExchange testExchange) {
        return BindingBuilder.bind(testQueue)
            .to(testExchange)
            .with("moeum.routing.member.delete.result.test");
    }
}