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
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink as Link } from 'react-router-dom';
import { NavDropdown } from '../header-components';
import { Translate, translate } from 'react-jhipster';

const adminMenuItems = (
  <>
    <DropdownItem tag={Link} to="/admin/gateway">
      <FontAwesomeIcon icon="road" fixedWidth /> <Translate contentKey="global.menu.admin.gateway">Gateway</Translate>
    </DropdownItem>
    <DropdownItem tag={Link} to="/admin/metrics">
      <FontAwesomeIcon icon="tachometer-alt" fixedWidth /> <Translate contentKey="global.menu.admin.metrics">Metrics</Translate>
    </DropdownItem>
    <DropdownItem tag={Link} to="/admin/health">
      <FontAwesomeIcon icon="heart" fixedWidth /> <Translate contentKey="global.menu.admin.health">Health</Translate>
    </DropdownItem>
    <DropdownItem tag={Link} to="/admin/configuration">
      <FontAwesomeIcon icon="list" fixedWidth /> <Translate contentKey="global.menu.admin.configuration">Configuration</Translate>
    </DropdownItem>
    <DropdownItem tag={Link} to="/admin/audits">
      <FontAwesomeIcon icon="bell" fixedWidth /> <Translate contentKey="global.menu.admin.audits">Audits</Translate>
    </DropdownItem>
    {/* jhipster-needle-add-element-to-admin-menu - JHipster will add entities to the admin menu here */}
    <DropdownItem tag={Link} to="/admin/logs">
      <FontAwesomeIcon icon="tasks" fixedWidth /> <Translate contentKey="global.menu.admin.logs">Logs</Translate>
    </DropdownItem>
  </>
);

const swaggerItem = (
  <DropdownItem tag={Link} to="/admin/docs">
    <FontAwesomeIcon icon="book" fixedWidth /> <Translate contentKey="global.menu.admin.apidocs">API</Translate>
  </DropdownItem>
);

const databaseItem = (
  <DropdownItem tag="a" href="./h2-console" target="_tab">
    <FontAwesomeIcon icon="hdd" fixedWidth /> <Translate contentKey="global.menu.admin.database">Database</Translate>
  </DropdownItem>
);

export const AdminMenu = ({ showSwagger, showDatabase }) => (
  <NavDropdown icon="user-plus" name={translate('global.menu.admin.main')} style={{ width: '140%' }} id="admin-menu">
    {adminMenuItems}
    {showSwagger && swaggerItem}

    {showDatabase && databaseItem}
  </NavDropdown>
);

export default AdminMenu;
