package com.kheyma;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableDiscoveryClient
@EnableAspectJAutoProxy
@EnableMongoAuditing
public class KheymaApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(KheymaApplication.class, args);
    }
}