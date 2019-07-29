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
import { NavDropdown } from '../header-components';
import { locales, languages } from 'app/config/translation';

export const LocaleMenu = ({ currentLocale, onClick }) =>
  Object.keys(languages).length > 1 && (
    <NavDropdown icon="flag" name={currentLocale ? languages[currentLocale].name : undefined}>
      {locales.map(locale => (
        <DropdownItem key={locale} value={locale} onClick={onClick}>
          {languages[locale].name}
        </DropdownItem>
      ))}
    </NavDropdown>
  );
