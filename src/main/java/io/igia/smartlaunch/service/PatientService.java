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

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.lang.StringUtils;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.Patient;
import org.hl7.fhir.instance.model.api.IBaseBundle;
import org.keycloak.common.util.Base64;
import org.keycloak.crypto.JavaAlgorithm;
import org.keycloak.crypto.KeyWrapper;
import org.keycloak.crypto.MacSignatureSignerContext;
import org.keycloak.crypto.SignatureSignerContext;
import org.keycloak.jose.jws.JWSBuilder;
import org.keycloak.representations.JsonWebToken;
import org.springframework.stereotype.Service;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.interceptor.BearerTokenAuthInterceptor;
import ca.uhn.fhir.rest.gclient.DateClientParam;
import ca.uhn.fhir.rest.gclient.IQuery;
import ca.uhn.fhir.rest.gclient.StringClientParam;
import ca.uhn.fhir.rest.gclient.TokenClientParam;
import io.igia.smartlaunch.config.ApplicationProperties;
import io.igia.smartlaunch.config.ApplicationProperties.TrustedRedirect;
import io.igia.smartlaunch.service.dto.PatientDTO;
import io.igia.smartlaunch.web.rest.errors.BadRequestAlertException;

@Service
public class PatientService {
	private FhirContext ctx;
	private ApplicationProperties properties;

	public PatientService(ApplicationProperties properties) {
		this.properties = properties;
		this.ctx = FhirContext.forDstu3();
	}

	public List<PatientDTO> findPatients(String bearer, String fhirServerBase, String mrn, String first, String last, String birthdate, String gender) {
		ca.uhn.fhir.rest.client.api.IGenericClient gc = ctx.newRestfulGenericClient(fhirServerBase);
		gc.registerInterceptor(new BearerTokenAuthInterceptor(bearer.substring(7)));
		
		IQuery<IBaseBundle> query = gc.search().forResource(Patient.class);
		
		if(null != mrn && !StringUtils.isEmpty(mrn.trim())) {
			query = query.where(new TokenClientParam(Patient.SP_IDENTIFIER).exactly().code(mrn));
		}
		if(null != first && !StringUtils.isEmpty(first.trim())) {
			query = query.where(new StringClientParam(Patient.SP_GIVEN).matches().value(first));
		}
		if(null != last && !StringUtils.isEmpty(last.trim())) {
			query = query.where(new StringClientParam(Patient.SP_FAMILY).matches().value(last));
		}
		if(null != gender && !StringUtils.isEmpty(gender.trim())) {
			query = query.where(new StringClientParam(Patient.SP_GENDER).matchesExactly().value(gender));
		}
		if(birthdate != null) {
			query = query.where(new DateClientParam(Patient.SP_BIRTHDATE).exactly().day(birthdate));
		}
		
		Bundle results = query
			.returnBundle(Bundle.class)
			.execute();
		
		List<PatientDTO> patientDtos = new ArrayList<PatientDTO>();
		
		results.getEntry().forEach(component->{
			Patient patient = (Patient) component.getResource();
			PatientDTO p = new PatientDTO();
			p.setId(patient.getIdElement().getIdPart());
			//TODO find actual MRN, check nulls
			p.setMrn(patient.getIdentifierFirstRep().getValue());	
			if(patient.getNameFirstRep() != null) {
				p.setFirst(patient.getNameFirstRep().getGivenAsSingleString());
				p.setLast(patient.getNameFirstRep().getFamily());
			}
			if(patient.getBirthDate() != null) {
				p.setBirthdate(patient.getBirthDate().toInstant());
			}
			if(patient.getGender() != null) {
				p.setGender(patient.getGender().toString());
			}
			patientDtos.add(p);
		});	

		return patientDtos;
	}
	
	public String selectPatient(Map<String, String> claims, String tokenUrl) throws IOException {	
		//check tokenUrl in trusted list
		if(!isTrustedRedirectUrl(tokenUrl)) {
		      throw new BadRequestAlertException("Error constructing redirect URL: untrusted host.", "Patient", "untrustedredirect");
		}
		
		// add launch context claims to token
	    JsonWebToken tokenSentBack = new JsonWebToken();	    
	    for(Entry<String, String> entry : claims.entrySet()) {
	    	String decodedValue = URLDecoder.decode(entry.getValue(), "UTF-8");
	    	tokenSentBack.setOtherClaims(entry.getKey(), decodedValue);
	    }
	    
	    // create token signer
	    SecretKeySpec hmacSecretKeySpec = new SecretKeySpec(Base64.decode(properties.getSecretKey()), 
	    		JavaAlgorithm.getJavaAlgorithm(properties.getAlg()));
	    KeyWrapper keyWrapper = new KeyWrapper();
	    keyWrapper.setAlgorithm(properties.getAlg());
        keyWrapper.setSecretKey(hmacSecretKeySpec);
	    SignatureSignerContext signer = new MacSignatureSignerContext(keyWrapper);
	    
	    // sign and encode launch context token
	    String appToken = new JWSBuilder().jsonContent(tokenSentBack)
	    		.sign(signer);//.hmac256(hmacSecretKeySpec);
	    String encodedToken = URLEncoder.encode(appToken, "UTF-8");

	    // replace placeholder in redirect URL
	    String decodedUrl = URLDecoder.decode(tokenUrl, "UTF-8");
	    return decodedUrl.replace("{APP_TOKEN}", encodedToken);
	}
	
	private boolean isTrustedRedirectUrl(String tokenUrl) throws MalformedURLException, UnsupportedEncodingException {
		URL url = new URL(URLDecoder.decode(tokenUrl, "UTF-8"));
		for(TrustedRedirect trusted : properties.getTrustedRedirects()){
			if(trusted.getHost().equalsIgnoreCase(url.getHost())) {
				if(trusted.getPort() == url.getPort()) {
					return true;
				}
			}
		}
		
		return false;
	}
}
