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

import org.springframework.boot.autoconfigure.security.oauth2.resource.AuthoritiesExtractor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

public class SimpleAuthoritiesExtractor implements AuthoritiesExtractor {

    private final String oauth2AuthoritiesAttribute;

    public SimpleAuthoritiesExtractor(String oauth2AuthoritiesAttribute) {
        this.oauth2AuthoritiesAttribute = oauth2AuthoritiesAttribute;
    }

    @Override
    public List<GrantedAuthority> extractAuthorities(Map<String, Object> map) {
        return Optional.ofNullable((List<String>) map.get(oauth2AuthoritiesAttribute))
            .filter(it -> !it.isEmpty())
            .orElse(Collections.emptyList())
            .stream()
            .map(SimpleGrantedAuthority::new)
            .collect(toList());
    }
}
