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
import Field from 'terra-form-field';
import Input from 'terra-form-input';
/* tslint:disable-next-line */
import { Translate } from 'react-jhipster';

// const required = value => (value ? undefined : 'MRN is required');

const getLabel = <Translate contentKey="patient.search.labels.mrn">MRN</Translate>;

interface IPatientSearchMrnProps {
  mrn: string;
  onInputChange: any;
}

class PatientSearchMrn extends React.Component<IPatientSearchMrnProps, {}> {
  constructor(props: IPatientSearchMrnProps) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onInputChange(e);
  }

  render() {
    return (
      <Field label={getLabel} htmlFor="mrn">
        <Input id="mrn" type="text" name="mrn" value={this.props.mrn} onChange={this.handleChange} />
      </Field>
    );
  }
}

export default PatientSearchMrn;
