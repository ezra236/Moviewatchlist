package com.example.movie;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class CloudinaryConfig {
    private static final Logger log = LoggerFactory.getLogger(CloudinaryConfig.class);

    @Value("${cloudinary.cloud_name:#{null}}") private String cloudName;
    @Value("${cloudinary.api_key:#{null}}") private String apiKey;
    @Value("${cloudinary.api_secret:#{null}}") private String apiSecret;

    @PostConstruct
    public void check() {
        log.info("Cloudinary cloud_name = {}", cloudName);
        log.info("Cloudinary api_key = {}", apiKey != null ? apiKey : "null");
        log.info("Cloudinary api_secret set? {}", apiSecret != null ? "yes" : "no");
        // Do NOT log the secret value itself in real deployments
    }

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));
    }
}
