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
import './footer.scss';

import React from 'react';
import { Translate } from 'react-jhipster';
import { Col, Row } from 'reactstrap';

const Footer = props => (
  <div className="footer d-flex align-items-center">
    <div className="container-fluid">
      <span className="d-flex justify-content-center">
        &copy;&nbsp;
        <Translate contentKey="footer.copyright.year">2018-2019</Translate>
        &nbsp;
        <Translate contentKey="footer.copyright.persistent">Persistent Systems</Translate>
      </span>
    </div>
  </div>
);

export default Footer;
