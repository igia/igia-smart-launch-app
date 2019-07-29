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
import { connect } from 'react-redux';

import { IRootState } from 'app/shared/reducers';
import Base from 'terra-base';
import PatientSearchForm from './search';
import { FORM_ERROR } from 'final-form';
import axios from 'axios';
import queryString from 'query-string';
import { Translate, TranslatorContext } from 'react-jhipster';
import './patient.scss';

export interface IPatientProps extends StateProps, DispatchProps {}

export interface IPatientState {
  results: any;
  errormessage: string;
  errortype: string;
}

const audParameter = location => {
  const params = queryString.parse(location.search);
  return params.aud;
};

const accessToken = location => {
  const params = queryString.parse(location.search);
  return params.access_token;
};

export class Patient extends React.Component<IPatientProps, IPatientState> {
  state: IPatientState = {
    results: {},
    errormessage: '',
    errortype: ''
  };

  constructor(props: IPatientProps) {
    super(props);

    this.validateSearch = this.validateSearch.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {}

  validateSearch(values) {
    const errors = {};

    if (!values.mrn && !values.birthdate && (!values.first || !values.last)) {
      errors[FORM_ERROR] = 'patient.search.messages.invalidInputs';
      return errors;
    }

    return undefined;
  }

  handleSearch(values) {
    const errors = this.validateSearch(values);
    if (errors) {
      this.setState({
        errormessage: errors[FORM_ERROR],
        errortype: 'error',
        results: {}
      });
      return;
    }

    this.setState({
      errormessage: 'patient.search.messages.searching',
      errortype: 'info',
      results: {}
    });

    axios
      .get('/api/patient', {
        params: {
          aud: audParameter(this.props.location),
          mrn: values.mrn,
          first: values.first,
          last: values.last,
          birthdate: values.birthdate,
          gender: values.gender
        },
        headers: { Authorization: 'Bearer ' + accessToken(this.props.location) }
      })
      .then(response => {
        if (response.data.length === 0) {
          this.setState({
            errormessage: 'patient.search.messages.noResults',
            errortype: 'info',
            results: {}
          });
        } else {
          this.setState({
            results: response.data,
            errormessage: '',
            errortype: ''
          });
        }
      })
      .catch(error => {
        if (error.response.status === 401) {
          this.setState({
            errormessage: 'patient.search.messages.errorTokenExpired',
            errortype: 'error',
            results: {}
          });
        } else {
          this.setState({
            errormessage: 'patient.search.messages.error',
            errortype: 'error',
            results: {}
          });
        }
      });
  }

  handleSelect(selectedId) {
    const params = queryString.parse(this.props.location.search);
    /* tslint:disable-next-line */
    console.debug('/api/patient/' + encodeURIComponent(selectedId) + '?token=' + encodeURIComponent(params.token));
    axios
      .get('api/patient/' + encodeURIComponent(selectedId) + '?token=' + encodeURIComponent(params.token), {
        headers: { Authorization: 'Bearer ' + accessToken(this.props.location) }
      })
      .then(response => {
        /* tslint:disable-next-line */
        console.debug(response.headers.location);
        window.location.href = response.data as string;
      })
      .catch(error => {
        /* tslint:disable-next-line */
        console.debug(error);
        this.setState({
          errormessage: 'patient.search.messages.errorSelect',
          errortype: 'error'
        });
      });
  }

  render() {
    const locale = TranslatorContext.context.locale || (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
    return (
      <div>
        <h4 className="patientSearchHeader">
          <Translate contentKey="patient.title">Search for patient</Translate>
        </h4>
        <Base locale={locale}>
          <PatientSearchForm
            handlePatientSearch={this.handleSearch}
            handlePatientSelect={this.handleSelect}
            results={this.state.results}
            errormessage={this.state.errormessage}
            errortype={this.state.errortype}
          />
        </Base>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = { location };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Patient);
