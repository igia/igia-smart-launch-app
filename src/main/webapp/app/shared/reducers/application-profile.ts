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

import { SUCCESS } from 'app/shared/reducers/action-type.util';

export const ACTION_TYPES = {
  GET_PROFILE: 'applicationProfile/GET_PROFILE'
};

const initialState = {
  ribbonEnv: '',
  inProduction: true,
  isSwaggerEnabled: false,
  activeProfiles: []
};

export type ApplicationProfileState = Readonly<typeof initialState>;

export default (state: ApplicationProfileState = initialState, action): ApplicationProfileState => {
  switch (action.type) {
    case SUCCESS(ACTION_TYPES.GET_PROFILE):
      const { data } = action.payload;
      return {
        ...state,
        ribbonEnv: data['deploy-mode'] ? data['deploy-mode']['name'] : '',
        inProduction: data.activeProfiles.includes('prod'),
        isSwaggerEnabled: data.activeProfiles.includes('swagger'),
        activeProfiles: data['activeProfiles']
      };
    default:
      return state;
  }
};

export const getProfile = () => ({
  type: ACTION_TYPES.GET_PROFILE,
  payload: axios.get('management/info')
});
