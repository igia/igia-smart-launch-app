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
// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved, import/extensions
import DataGrid from 'terra-clinical-data-grid';
/* tslint:disable-next-line */
import Button from 'terra-button';
import Spacer from 'terra-spacer';
import { Translate } from 'react-jhipster';

import ContentCellLayout from './ContentCellLayout';
import './patient.scss';

const getLabel = <Translate contentKey="patient.search.labels.select">Select</Translate>;

interface IPatientSearchResultsProps {
  results: any;
  onRowSelectChange: any;
  onSelect: any;
}

interface IPatientSearchResultsState {
  selectedRow: any;
}

class PatientSearchResultsDatagrid extends React.Component<IPatientSearchResultsProps, IPatientSearchResultsState> {
  constructor(props: IPatientSearchResultsProps) {
    super(props);

    this.state = { selectedRow: {} };

    this.buildSection = this.buildSection.bind(this);
    this.buildRows = this.buildRows.bind(this);
    this.buildCell = this.buildCell.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  buildCell(key, rowVal) {
    let cell = {};
    if (!(key as string).match('id')) {
      cell = {
        columnId: `Column-${key}`,
        component: <ContentCellLayout text={`${rowVal[key]}`} />
      };
    } else {
      cell = { columnId: `Column-${key}` };
    }
    return cell;
  }

  buildRows(sectionId, results) {
    const rows = results.map((rowVal, rowIndex) => ({
      id: `${rowVal['id']}`,
      isSelectable: true,
      isSelected:
        this.state.selectedRow && this.state.selectedRow.sectionId === sectionId && this.state.selectedRow.rowId === `${rowVal['id']}`,
      cells: Object.keys(rowVal)
        .map((cellVal, cellIndex) => cellVal)
        .map(key => this.buildCell(key, rowVal))
    }));

    return rows;
  }

  buildSection(sectionId, results) {
    return {
      id: sectionId,
      rows: this.buildRows(sectionId, results)
    };
  }

  handleRowSelect(sectionId, rowId) {
    if (this.state.selectedRow && this.state.selectedRow.sectionId === sectionId && this.state.selectedRow.rowId === rowId) {
      // unselect
      this.state.selectedRow.sectionId = null;
      this.state.selectedRow.rowId = null;
      this.props.onRowSelectChange(null);
      return;
    }
    // select
    this.state.selectedRow.sectionId = sectionId;
    this.state.selectedRow.rowId = rowId;
    this.props.onRowSelectChange(rowId);
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.selectedRow.rowId) {
      this.props.onSelect(e);
    }
  }

  getOverFlowColumns() {
    let containerWidth;
    let columnWidth = 200;
    if (document.getElementById('patient-search-results')) {
      containerWidth = document.getElementById('patient-search-results').clientWidth - 40;
    }
    if (containerWidth > 1000) {
      columnWidth = containerWidth / 5;
    }
    const columns = [
      {
        id: 'Column-mrn',
        width: columnWidth,
        text: <Translate contentKey="patient.search.labels.mrn">MRN</Translate>
      },
      {
        id: 'Column-first',
        width: columnWidth,
        text: <Translate contentKey="patient.search.labels.first">First name</Translate>
      },
      {
        id: 'Column-last',
        width: columnWidth,
        text: <Translate contentKey="patient.search.labels.last">Last name</Translate>
      },
      {
        id: 'Column-birthdate',
        width: columnWidth,
        text: <Translate contentKey="patient.search.labels.birthdate">Date of birth</Translate>
      },
      {
        id: 'Column-gender',
        width: columnWidth,
        text: <Translate contentKey="patient.search.labels.gender">Gender</Translate>
      }
    ];
    return columns;
  }

  render() {
    return (
      <div>
        <DataGrid
          id="patient-search-results"
          overflowColumns={this.getOverFlowColumns()}
          hasSelectableRows
          sections={[this.buildSection('section_0', this.props.results)]}
          onRowSelect={this.handleRowSelect}
        />
        <Spacer paddingTop="large+2" marginBottom="small">
          <form onSubmit={this.handleSubmit}>
            <Button
              text={getLabel}
              variant="emphasis"
              type={Button.Opts.Types.SUBMIT}
              id="patient-select-btn"
              className="searchButtonStyle"
              isDisabled={!this.state.selectedRow.rowId}
            />
          </form>
        </Spacer>
      </div>
    );
  }
}

export default PatientSearchResultsDatagrid;
