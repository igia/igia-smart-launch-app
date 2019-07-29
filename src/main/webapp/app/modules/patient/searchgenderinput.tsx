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
/* tslint:disable-next-line */
import SelectField from 'terra-form-select/lib/SelectField';
import { Translate, translate } from 'react-jhipster';

const getLabel = <Translate contentKey="patient.search.labels.gender">Gender</Translate>;
const getGenderDisplay = value => translate('patient.search.gender.' + value, null, value);

interface IPatientSearchGenderProps {
  gender: string;
  onGenderInputChange: any;
}

class PatientSearchGender extends React.Component<IPatientSearchGenderProps, {}> {
  constructor(props: IPatientSearchGenderProps) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.props.onGenderInputChange('gender', value);
  }

  render() {
    return (
      <SelectField label={getLabel} selectId="select-gender" value={this.props.gender} onChange={this.handleChange}>
        <SelectField.Option value="male" display={getGenderDisplay('male')} />
        <SelectField.Option value="female" display={getGenderDisplay('female')} />
        <SelectField.Option value="other" display={getGenderDisplay('other')} />
        <SelectField.Option value="unknown" display={getGenderDisplay('unknown')} />
      </SelectField>
    );
  }
}

export default PatientSearchGender;
