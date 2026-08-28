package com.sumin.knowledgearchive;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;
import com.sumin.knowledgearchive.security.CustomUserDetails;
import com.sumin.knowledgearchive.user.UserDomain;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class KnowledgeArchiveApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	private CustomUserDetails authenticatedUser() {
		UserDomain user = new UserDomain();
		user.setId(1);
		user.setEmail("test@example.com");
		user.setPassword("password");
		return new CustomUserDetails(user);
	}

	@Test
	void contextLoads() {
	}

	@Test
	void materialsPageShouldRenderForAuthenticatedUser() throws Exception {
		mockMvc.perform(get("/materials.html")
				.with(SecurityMockMvcRequestPostProcessors.user(authenticatedUser())))
				.andExpect(status().isOk())
				.andExpect(content().string(containsString("My Material List")));
	}

	@Test
	void materialCreatePageShouldRenderForAuthenticatedUser() throws Exception {
		mockMvc.perform(get("/material-create.html")
				.with(SecurityMockMvcRequestPostProcessors.user(authenticatedUser())))
				.andExpect(status().isOk())
				.andExpect(content().string(containsString("Create Material")));
	}

	@Test
	void materialDetailPageShouldRenderForAuthenticatedUser() throws Exception {
		mockMvc.perform(get("/material-detail.html?id=1")
				.with(SecurityMockMvcRequestPostProcessors.user(authenticatedUser())))
				.andExpect(status().isOk())
				.andExpect(content().string(containsString("Material Detail")));
	}

	@Test
	void materialEditPageShouldRenderForAuthenticatedUser() throws Exception {
		mockMvc.perform(get("/material-edit.html?id=1")
				.with(SecurityMockMvcRequestPostProcessors.user(authenticatedUser())))
				.andExpect(status().isOk())
				.andExpect(content().string(containsString("Edit Material")));
	}

	@Test
	void tagPageShouldRenderForAuthenticatedUser() throws Exception {
		mockMvc.perform(get("/tags.html")
				.with(SecurityMockMvcRequestPostProcessors.user(authenticatedUser())))
				.andExpect(status().isOk())
				.andExpect(content().string(containsString("Manage Tags")));
	}

}
