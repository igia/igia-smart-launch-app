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
import Fieldset from 'terra-form-fieldset/lib/Fieldset';
import { Translate } from 'react-jhipster';

const getFirstLabel = <Translate contentKey="patient.search.labels.first">First name</Translate>;
const getLastLabel = <Translate contentKey="patient.search.labels.last">Last name</Translate>;

interface IPatientSearchNameProps {
  first: string;
  last: string;
  onInputChange: any;
}

class SearchPatientName extends React.Component<IPatientSearchNameProps, {}> {
  constructor(props: IPatientSearchNameProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onInputChange(e);
  }

  render() {
    const first = this.props.first;
    const last = this.props.last;
    return (
      <Fieldset type="checkbox" name="children_present" value="children_present" className="mb-2">
        <Field label={getFirstLabel} isInline htmlFor="first" className="firstName-width">
          <Input id="first" type="text" name="first" value={first} onChange={this.handleChange} />
        </Field>
        <Field label={getLastLabel} isInline htmlFor="last" className="lastName-width">
          <Input type="text" name="last" value={last} onChange={this.handleChange} />
        </Field>
      </Fieldset>
    );
  }
}

export default SearchPatientName;
