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
import axios from 'axios';

import { TranslatorContext, Storage } from 'react-jhipster';

export const ACTION_TYPES = {
  SET_LOCALE: 'locale/SET_LOCALE'
};

const initialState = {
  currentLocale: undefined
};

export type LocaleState = Readonly<typeof initialState>;

export default (state: LocaleState = initialState, action): LocaleState => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOCALE:
      const currentLocale = action.locale;
      if (state.currentLocale !== currentLocale) {
        TranslatorContext.setLocale(currentLocale);
      }
      return {
        currentLocale
      };
    default:
      return state;
  }
};

export const setLocale = locale => async dispatch => {
  if (!Object.keys(TranslatorContext.context.translations).includes(locale)) {
    const response = await axios.get(`i18n/${locale}.json?buildTimestamp=${process.env.BUILD_TIMESTAMP}`, { baseURL: '' });
    TranslatorContext.registerTranslations(locale, response.data);
  }
  dispatch({
    type: ACTION_TYPES.SET_LOCALE,
    locale
  });
};
