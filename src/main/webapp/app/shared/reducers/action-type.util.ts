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
/**
 * Appends REQUEST async action type
 */

export const REQUEST = actionType => `${actionType}_PENDING`;

/**
 * Appends SUCCESS async action type
 */

export const SUCCESS = actionType => `${actionType}_FULFILLED`;

/**
 * Appends FAILURE async action type
 */

export const FAILURE = actionType => `${actionType}_REJECTED`;
