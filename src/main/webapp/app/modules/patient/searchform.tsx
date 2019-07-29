/*
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
import React from 'react';
import { Form } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
/* tslint:disable-next-line */
import Button from 'terra-button';
import Spacer from 'terra-spacer';
/* tslint:disable-next-line */
import IconSearch from 'terra-icon/lib/icon/IconSearch';
import PatientSearchMrn from './searchmrninput';
import PatientSearchName from './searchnameinput';
import PatientSearchBirthdate from './searchbirthdateinput';
import PatientSearchGender from './searchgenderinput';
import { translate } from 'react-jhipster';
import { Row, Col } from 'reactstrap';
import './patient.scss';

interface IPatientSearchFormProps {
  mrn: string;
  first: string;
  last: string;
  birthdate: string;
  gender: string;
  onSubmitForm: any;
  onInputChange: any;
  onSelectInputChange: any;
  onInputDateChange: any;
}

export default class PatientSearchForm extends React.Component<IPatientSearchFormProps, {}> {
  static defaultProps: Partial<IPatientSearchFormProps>;

  constructor(props: IPatientSearchFormProps) {
    super(props);

    this.submitForm = this.submitForm.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderForm = this.renderForm.bind(this);
  }

  submitForm(values) {
    this.props.onSubmitForm(values);
  }

  handleDateChange(e, date) {
    this.props.onInputDateChange(e, date);
  }

  handleSelectChange(name, value) {
    this.props.onSelectInputChange(name, value);
  }

  handleChange(e) {
    this.props.onInputChange(e);
  }

  renderForm({ handleSubmit }) {
    return (
      <form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <PatientSearchMrn mrn={this.props.mrn} onInputChange={this.handleChange} />
          </Col>
        </Row>
        <Row>
          <Col>
            <PatientSearchName first={this.props.first} last={this.props.last} onInputChange={this.handleChange} />
          </Col>
        </Row>
        <Row>
          <Col>
            <PatientSearchGender gender={this.props.gender} onGenderInputChange={this.handleSelectChange} />
          </Col>
          <Col>
            <PatientSearchBirthdate birthdate={this.props.birthdate} onDateInputChange={this.handleDateChange} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              id="patient-search-btn"
              icon={<IconSearch height="1em" width="1em" />}
              text={translate('patient.search.labels.search', null, 'Search for patient')}
              variant="emphasis"
              className="searchButtonStyle"
              type={Button.Opts.Types.SUBMIT}
            />
          </Col>
        </Row>
      </form>
    );
  }

  render() {
    return (
      <Spacer marginBottom="small" className="form-container">
        <Form onSubmit={this.submitForm} render={this.renderForm} initialValues={{ mrn: '' }} />
      </Spacer>
    );
  }
}
