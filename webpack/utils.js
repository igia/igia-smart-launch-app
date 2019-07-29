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
const fs = require('fs');
const path = require('path');

module.exports = {
  parseVersion,
  root,
  isExternalLib
};

const parseString = require('xml2js').parseString;
// return the version number from `pom.xml` file
function parseVersion() {
  let version = null;
  const pomXml = fs.readFileSync('pom.xml', 'utf8');
  parseString(pomXml, (err, result) => {
    if (result.project.version && result.project.version[0]) {
      version = result.project.version[0];
    } else if (result.project.parent && result.project.parent[0] && result.project.parent[0].version && result.project.parent[0].version[0]) {
      version = result.project.parent[0].version[0];
    }
  });
  if (version === null) {
    throw new Error('pom.xml is malformed. No version is defined');
  }
  return version;
}

const _root = path.resolve(__dirname, '..');

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [_root].concat(args));
}

function isExternalLib(module, check = /node_modules/) {
  const req = module.userRequest;
  if (typeof req !== 'string') {
    return false;
  }
  return req.search(check) >= 0;
}
