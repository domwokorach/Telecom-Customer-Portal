package com.portfolio.telecom;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class PortalControllerTest {
    @Autowired MockMvc mvc;

    @Test void requiresAuthentication() throws Exception {
        mvc.perform(get("/api/v1/portal")).andExpect(status().isUnauthorized());
    }

    @Test void providesSeededAccountData() throws Exception {
        mvc.perform(get("/api/v1/portal").with(httpBasic("demo", "Demo123!")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.customer.name").value("Alex Morgan"))
            .andExpect(jsonPath("$.plans.length()").value(3));
    }

    @Test void rejectsInvalidPlan() throws Exception {
        mvc.perform(patch("/api/v1/plan").with(httpBasic("demo", "Demo123!"))
                .contentType(MediaType.APPLICATION_JSON).content("{\"planId\":\"unknown\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test void validatesSupportTicket() throws Exception {
        mvc.perform(post("/api/v1/tickets").with(httpBasic("demo", "Demo123!"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"subject\":\"x\",\"message\":\"short\",\"category\":\"Billing\"}"))
            .andExpect(status().isBadRequest());
    }
}
