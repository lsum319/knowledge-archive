package com.sumin.knowledgearchive.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Knowledge Archive API",
                version = "v1.0",
                description = "Knowledge Archive 프로젝트 API 문서"
        )
)
public class SwaggerConfig {
}