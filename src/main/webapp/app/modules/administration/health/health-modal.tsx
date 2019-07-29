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
import { Table, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const formatDiskSpaceOutput = rawValue => {
  // Should display storage space in an human readable unit
  const val = rawValue / 1073741824;
  if (val > 1) {
    // Value
    return val.toFixed(2) + ' GB';
  } else {
    return (rawValue / 1048576).toFixed(2) + ' MB';
  }
};

const HealthModal = ({ handleClose, healthObject, showModal }) => {
  const data = healthObject.details || {};
  return (
    <Modal isOpen={showModal} modalTransition={{ timeout: 20 }} backdropTransition={{ timeout: 10 }} toggle={handleClose}>
      <ModalHeader toggle={handleClose}>{healthObject.name}</ModalHeader>
      <ModalBody>
        <Table bordered>
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(data).map((key, index) => (
              <tr key={index}>
                <td>{key}</td>
                <td>{healthObject.name === 'diskSpace' ? formatDiskSpaceOutput(data[key]) : JSON.stringify(data[key])}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default HealthModal;
