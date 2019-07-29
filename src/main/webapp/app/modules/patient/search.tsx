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
import PatientSearchForm from './searchform';
import PatientSearchResultsDataGrid from './searchresults';
import Alert from 'terra-alert';
import { Translate } from 'react-jhipster';
import { Row, Col } from 'reactstrap';

interface IPatientSearchProps {
  handlePatientSearch: any;
  handlePatientSelect: any;
  results: any;
  errormessage: string;
  errortype: string;
}

interface IPatientSearchState {
  mrn: string;
  first: string;
  last: string;
  birthdate: string;
  gender: string;
  submittedValues: any;
  selectedId: string;
}

export default class PatientSearch extends React.Component<IPatientSearchProps, IPatientSearchState> {
  constructor(props: IPatientSearchProps) {
    super(props);

    this.state = {
      mrn: '',
      first: '',
      last: '',
      birthdate: '',
      gender: '',
      submittedValues: {},
      selectedId: undefined
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleRowSelectChange = this.handleRowSelectChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.submitGrid = this.submitGrid.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    } as any);
  }

  handleSelectChange(name, value) {
    this.setState({
      [name]: value
    } as any);
  }

  handleDateChange(event, date) {
    this.setState({ birthdate: date });
  }

  handleRowSelectChange(value) {
    this.setState({
      selectedId: value
    });
  }

  submitGrid(e) {
    e.preventDefault();
    this.props.handlePatientSelect(this.state.selectedId);
  }

  submitForm(values) {
    values.mrn = this.state.mrn;
    values.first = this.state.first;
    values.last = this.state.last;
    values.birthdate = this.state.birthdate;
    values.gender = this.state.gender;
    this.setState({
      submittedValues: values
    });

    this.props.handlePatientSearch(values);
  }

  render() {
    return (
      <div>
        <Row>
          <Col md={{ size: 6, offset: 3 }}>
            <PatientSearchForm
              mrn={this.state.mrn}
              first={this.state.first}
              last={this.state.last}
              birthdate={this.state.birthdate}
              gender={this.state.gender}
              onInputDateChange={this.handleDateChange}
              onSelectInputChange={this.handleSelectChange}
              onInputChange={this.handleInputChange}
              onSubmitForm={this.submitForm}
            />
          </Col>
        </Row>
        {Object.keys(this.props.errormessage).length > 0 && (
          <div>
            <Alert type={this.props.errortype}>
              <Translate contentKey={this.props.errormessage}>{this.props.errormessage}</Translate>
            </Alert>
          </div>
        )}
        {Object.keys(this.props.results).length > 0 && (
          <div>
            <PatientSearchResultsDataGrid
              results={this.props.results}
              onRowSelectChange={this.handleRowSelectChange}
              onSelect={this.submitGrid}
            />
          </div>
        )}
      </div>
    );
  }
}
