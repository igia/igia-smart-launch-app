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
package io.igia.smartlaunch.service;
import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.Enumerations.AdministrativeGender;
import org.hl7.fhir.dstu3.model.HumanName;
import org.hl7.fhir.dstu3.model.IdType;
import org.hl7.fhir.dstu3.model.Identifier;
import org.hl7.fhir.dstu3.model.Patient;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.util.SocketUtils;
import org.springframework.util.StreamUtils;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.client.WireMock;

import ca.uhn.fhir.context.FhirContext;
import io.igia.smartlaunch.config.ApplicationProperties;
import io.igia.smartlaunch.config.ApplicationProperties.TrustedRedirect;
import io.igia.smartlaunch.service.PatientService;
import io.igia.smartlaunch.service.dto.PatientDTO;
import io.igia.smartlaunch.web.rest.errors.BadRequestAlertException;


public class PatientServiceTest {

	@InjectMocks
	private PatientService patienService;

	@Mock
	private ApplicationProperties properties;

	private WireMockServer wireMockServer;

	private int mockServerPort;

	private FhirContext ctx;

	@Before
	public void startMockServer() throws IOException, ParseException {
		MockitoAnnotations.initMocks(this);       
		this.ctx = FhirContext.forDstu3();

		mockServerPort = SocketUtils.findAvailableTcpPort();    	
		wireMockServer = new WireMockServer(wireMockConfig().port(mockServerPort));
		configureWireMock();
		wireMockServer.start();
	}

	@After
	public void stopMockServer() {
		if (wireMockServer != null && wireMockServer.isRunning()) {
			wireMockServer.stop();
		}
	}

	private void configureWireMock() throws IOException, ParseException {
		// load a JSON file from the classpath
		String metadata = StreamUtils.copyToString(getClass().getResourceAsStream("/__files/metadata.json"), StandardCharsets.UTF_8);
		// respond to GET for metadata
		wireMockServer.stubFor(WireMock.get("/metadata")
				.willReturn(aResponse()
						.withBody(metadata)
						.withHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)));
		
		// respond to patient search
		Bundle results = getPatientResourceBundle();
		String body = ctx.newJsonParser().encodeResourceToString(results);
		wireMockServer.stubFor(
			WireMock.get("/Patient?identifier=1212&given=John&family=Smith&gender%3Aexact=male&birthdate=2000-10-10")
			.withHeader("Authorization", WireMock.equalTo("Bearer 57678yvhbbjkhj78678yhvghjkgghf"))
			.willReturn(aResponse()
					.withBody(body)
					.withHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)));
	}


	@Test
	public void testSearchPatient() throws IOException, ParseException {
		String fhirServerBase = "http://localhost:" + mockServerPort;
		List<PatientDTO> patients = patienService.findPatients("Bearer 57678yvhbbjkhj78678yhvghjkgghf", 
				fhirServerBase, "1212", "John", "Smith", "2000-10-10", "male");
		assertEquals(1, patients.size());
		assertEquals("1212", patients.get(0).getId());
		assertEquals("1234344434", patients.get(0).getMrn());
		assertThat(patients.get(0).getFirst()).isEqualTo("John");
		assertThat(patients.get(0).getLast()).isEqualTo("Smith");
		assertThat(patients.get(0).getGender()).isEqualTo("MALE");
	}

	private Bundle getPatientResourceBundle() throws ParseException {
		Patient patient = new Patient();
		HumanName hn = new HumanName();
		hn.setFamily("Smith");
		hn.addGiven("John");
		patient.addName(hn);
		patient.setGender(AdministrativeGender.MALE);
		Date dt = getDate("2000-10-10", "yyyy-MM-dd");
		patient.setBirthDate(dt);
		Identifier t = new Identifier();
		t.setValue("1234344434");
		patient.addIdentifier(t);
		IdType theId = new IdType();
		theId.setValueAsString("1212");
		patient.setId(theId);
		Bundle result = new Bundle();
		result.addEntry().setResource(patient);
		return result;
	}

	private Date getDate(String dateString, String dateFormat) throws ParseException {
		SimpleDateFormat inputFormat = new SimpleDateFormat(dateFormat);
		return inputFormat.parse(dateString);
	}

	@Test
	public void testSelectPatient() throws IOException{
		Map<String, String> claims = new HashMap<String, String>();
		claims.put("patient", "12345");
		Mockito.when(properties.getSecretKey()).thenReturn("aSqzP4reFgWR4j94BDT1r+81QYp/NYbY9SBwXtqV1ko=");
		Mockito.when(properties.getAlg()).thenReturn("HS256");
		List<TrustedRedirect> trustedRedirects = new ArrayList<>();
		TrustedRedirect redirect = new TrustedRedirect();
		redirect.setHost("localhost");
		redirect.setPort(9080);
		trustedRedirects.add(redirect);
		Mockito.when(properties.getTrustedRedirects()).thenReturn(trustedRedirects);
		
		String token = "http://localhost:9080/test?app-token=%7BAPP_TOKEN%7D";    
		String result  = patienService.selectPatient(claims, token);
		String actual = "http://localhost:9080/test?app-token=eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjAsIm5iZiI6MCwiaWF0IjowLCJwYXRpZW50IjoiMTIzNDUifQ.edaeLvGPoSfvy51Z-UhHvcdXMjro4Omn6Nl02r8Zyls";
		assertEquals(actual,result);
	}
	
	@Test(expected = BadRequestAlertException.class)
	public void testSelectPatientUntrustedUrl() throws IOException{
		Map<String, String> claims = new HashMap<String, String>();
		claims.put("patient", "12345");
		Mockito.when(properties.getSecretKey()).thenReturn("aSqzP4reFgWR4j94BDT1r+81QYp/NYbY9SBwXtqV1ko=");
		Mockito.when(properties.getAlg()).thenReturn("HS256");
		List<TrustedRedirect> trustedRedirects = new ArrayList<>();
		TrustedRedirect redirect = new TrustedRedirect();
		redirect.setHost("localhost");
		redirect.setPort(9080);
		trustedRedirects.add(redirect);
		Mockito.when(properties.getTrustedRedirects()).thenReturn(trustedRedirects);
		
		String token = "http://localhost:8080/test?app-token=%7BAPP_TOKEN%7D";    
		patienService.selectPatient(claims, token);
	}
}
