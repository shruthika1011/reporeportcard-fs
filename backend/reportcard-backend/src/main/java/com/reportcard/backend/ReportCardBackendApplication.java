package com.reportcard.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class ReportCardBackendApplication extends SpringBootServletInitializer {

    // This is required for WAR deployment in external Tomcat
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(ReportCardBackendApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(ReportCardBackendApplication.class, args);
    }
}
