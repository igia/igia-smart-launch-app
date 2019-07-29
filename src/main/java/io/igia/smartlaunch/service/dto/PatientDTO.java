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
package io.igia.smartlaunch.service.dto;

import java.time.Instant;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class PatientDTO {
	
	@NotBlank
    @Size(min = 1)
    private String id;
	
    private String mrn;

    @Size(max = 50)
    private String first;

    @Size(max = 50)
    private String last;
    
    private Instant birthdate;
    
    private String gender;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getMrn() {
		return mrn;
	}

	public void setMrn(String mrn) {
		this.mrn = mrn;
	}

	public String getFirst() {
		return first;
	}

	public void setFirst(String first) {
		this.first = first;
	}

	public String getLast() {
		return last;
	}

	public void setLast(String last) {
		this.last = last;
	}

	public Instant getBirthdate() {
		return birthdate;
	}

	public void setBirthdate(Instant birthdate) {
		this.birthdate = birthdate;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}
	
    @Override
    public String toString() {
        return "PatientDTO{" +
        	"id='" + id + '\'' +
            "mrn='" + mrn + '\'' +
            ", first='" + first + '\'' +
            ", last='" + last + '\'' +
            ", birthdate=" + birthdate +
            ", gender='" + gender + '\'' +
            "}";
    }

}
