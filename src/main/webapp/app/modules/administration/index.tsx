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

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import Logs from './logs/logs';
import Health from './health/health';
import Metrics from './metrics/metrics';
import Configuration from './configuration/configuration';
import Audits from './audits/audits';
import Docs from './docs/docs';
import Gateway from './gateway/gateway';

const Routes = ({ match }) => (
  <div>
    <ErrorBoundaryRoute exact path={`${match.url}/health`} component={Health} />
    <ErrorBoundaryRoute exact path={`${match.url}/gateway`} component={Gateway} />
    <ErrorBoundaryRoute exact path={`${match.url}/metrics`} component={Metrics} />
    <ErrorBoundaryRoute exact path={`${match.url}/docs`} component={Docs} />
    <ErrorBoundaryRoute exact path={`${match.url}/configuration`} component={Configuration} />
    <ErrorBoundaryRoute exact path={`${match.url}/audits`} component={Audits} />
    <ErrorBoundaryRoute exact path={`${match.url}/logs`} component={Logs} />
  </div>
);

export default Routes;
