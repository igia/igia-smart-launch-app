/**
 * This Source Code Form is subject to the terms of the Mozilla Public License, v.
 * 2.0 with a Healthcare Disclaimer.
 * A copy of the Mozilla Public License, v. 2.0 with the Healthcare Disclaimer can
 * be found under the top level directory, named LICENSE.
 * If a copy of the MPL was not distributed with this file, You can obtain one at
 * http://mozilla.org/MPL/2.0/.
 * If a copy of the Healthcare Disclaimer was not distributed with this file, You
 * can obtain one at the project website https://github.com/igia.
 *
 * Copyright (C) 2018-2019 Persistent Systems, Inc.
 */
package io.igia.smartlaunch.web.rest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import io.igia.smartlaunch.IgiasmartlaunchappApp;
import io.igia.smartlaunch.service.PatientService;
import io.igia.smartlaunch.web.rest.PatientResource;



@RunWith(SpringRunner.class)
@SpringBootTest(classes = IgiasmartlaunchappApp.class)
public class PatientResourceTest {

    @MockBean
    private PatientService patientService;

    private MockMvc mvc;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        PatientResource resource = new PatientResource(patientService);
        this.mvc = MockMvcBuilders.standaloneSetup(resource).build();
    }
    
    @Test
    public void testPatientSelect() throws Exception {
        mvc.perform(get("/api/patient/{id}", "12345").param("token", "test"))
                .andExpect(status().isOk());
    }
    
    @Test
    public void testPatientSelectWithBadRequest() throws Exception {
        mvc.perform(get("/api/patient/{id}", "12345"))
                .andExpect(status().isBadRequest());
    }
    
    @Test
    public void testPatientSearch() throws Exception {
        mvc.perform(get("/api/patient").header("Authorization", "efersgtrhdtyhtjwedQ").param("aud", "http://test:8088/example/api").param("first", "Smith").param("last", "John")
                .param("birthdate", "2000-10-10").param("gender", "FEMALE").param("mrn", "12345"))
                .andExpect(status().isOk());
    }
    
    @Test
    public void testPatientSearchWithBadRequest() throws Exception {
        mvc.perform(get("/api/patient").param("aud", "http://test:8088/example/api").param("first", "Smith").param("last", "John")
                .param("birthdate", "2000-10-10").param("gender", "FEMALE").param("mrn", "12345"))
                .andExpect(status().isBadRequest());
    }

}
