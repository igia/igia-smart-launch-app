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
import { Field } from 'react-final-form';
import TerraField from 'terra-form-field';
/* tslint:disable-next-line */
import DatePicker from 'terra-date-picker/lib/DatePicker';
import moment from 'moment';
import { Translate } from 'react-jhipster';

interface IPatientSearchBirthdateProps {
  birthdate: string;
  onDateInputChange: any;
}

const getLabel = <Translate contentKey="patient.search.labels.birthdate">Date of birth</Translate>;

const isValidDate = value => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (value !== '' && !moment(value, moment.ISO_8601, true).isValid()) {
    return <Translate contentKey="patient.search.messages.invalidDate">Invalid date selection</Translate>;
  }

  return undefined;
};

class PatientSearchBirthdate extends React.Component<IPatientSearchBirthdateProps, {}> {
  constructor(props: IPatientSearchBirthdateProps) {
    super(props);

    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleDateChange = input => (event, date) => {
    input.onChange(date);
    this.props.onDateInputChange(event, date);
  };

  render() {
    return (
      <Field name="birthdate" validate={isValidDate}>
        {({ input, meta }) => (
          <TerraField label={getLabel} htmlFor="birthdate" isInvalid={meta.submitFailed && !meta.valid} error={meta.error}>
            <DatePicker
              className="fieldWidth"
              name="birthdate"
              inputAttributes={{
                ...input
              }}
              onChange={this.handleDateChange(input)}
              onChangeRaw={this.handleDateChange(input)}
              maxDate={new Date().toISOString()}
              {...this.props}
            />
          </TerraField>
        )}
      </Field>
    );
  }
}

export default PatientSearchBirthdate;
