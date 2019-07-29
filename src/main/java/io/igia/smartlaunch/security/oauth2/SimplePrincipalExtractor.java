/**
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
package io.igia.smartlaunch.security.oauth2;

import org.springframework.boot.autoconfigure.security.oauth2.resource.PrincipalExtractor;

import java.util.Map;

public class SimplePrincipalExtractor implements PrincipalExtractor {

    private final String oauth2PrincipalAttribute;

    public SimplePrincipalExtractor(String oauth2PrincipalAttribute) {
        this.oauth2PrincipalAttribute = oauth2PrincipalAttribute;
    }

    @Override
    public Object extractPrincipal(Map<String, Object> map) {
        return map.getOrDefault(oauth2PrincipalAttribute, "unknown");
    }
}
