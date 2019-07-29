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

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;

import io.igia.smartlaunch.service.PatientService;
import io.igia.smartlaunch.service.dto.PatientDTO;

@EnableResourceServer
@RestController
@RequestMapping("/api")
public class PatientResource {

    private final Logger log = LoggerFactory.getLogger(PatientResource.class);
    
    private final PatientService patientService;

    public PatientResource(PatientService patientService) {

        this.patientService = patientService;
    }
    
    @GetMapping("/patient")
    @Timed
    public ResponseEntity<List<PatientDTO>> searchPatients(
    		@RequestHeader("Authorization") String bearer,
    		@RequestParam(required = true) String aud, @RequestParam String mrn,
    		@RequestParam(required = false) String first, @RequestParam(required = false) String last, 
    		@RequestParam(required = false) String birthdate, @RequestParam(required = false) String gender) {    	
        log.debug("REST request to search Patient : {}", mrn);
        
        return new ResponseEntity<>(
        		patientService.findPatients(bearer, aud, mrn, first, last, birthdate, gender), 
        		HttpStatus.OK);
    }
    
    @GetMapping("/patient/{id}")
    @Timed
    public ResponseEntity<String> selectPatient(@PathVariable String id, @RequestParam String token) {    	
        log.debug("REST request to select Patient : {}", id);
        
        //TODO keycloak location redirect
        Map<String, String> claims = new HashMap<String, String>();
        claims.put("patient", id);
        String location;
		try {
			location = patientService.selectPatient(claims, token);
		} catch (IOException e) {
			return ResponseEntity.status(500).build();
		}

        return new ResponseEntity<>(location, HttpStatus.OK);
    }
    
    @Configuration
    protected static class ResourceServerConfiguration
        extends ResourceServerConfigurerAdapter {
      @Override
      public void configure(HttpSecurity http) throws Exception {
        http
          .antMatcher("/api/patient/**")
          .authorizeRequests().anyRequest().authenticated();
      }
    }
}