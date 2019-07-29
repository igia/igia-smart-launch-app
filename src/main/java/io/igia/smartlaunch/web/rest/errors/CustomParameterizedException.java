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
package io.igia.smartlaunch.web.rest.errors;

import org.zalando.problem.AbstractThrowableProblem;

import java.util.HashMap;
import java.util.Map;

import static org.zalando.problem.Status.BAD_REQUEST;

/**
 * Custom, parameterized exception, which can be translated on the client side.
 * For example:
 *
 * <pre>
 * throw new CustomParameterizedException(&quot;myCustomError&quot;, &quot;hello&quot;, &quot;world&quot;);
 * </pre>
 *
 * Can be translated with:
 *
 * <pre>
 * "error.myCustomError" :  "The server says {{param0}} to {{param1}}"
 * </pre>
 */
public class CustomParameterizedException extends AbstractThrowableProblem {

    private static final long serialVersionUID = 1L;

    private static final String PARAM = "param";

    public CustomParameterizedException(String message, String... params) {
        this(message, toParamMap(params));
    }

    public CustomParameterizedException(String message, Map<String, Object> paramMap) {
        super(ErrorConstants.PARAMETERIZED_TYPE, "Parameterized Exception", BAD_REQUEST, null, null, null, toProblemParameters(message, paramMap));
    }

    public static Map<String, Object> toParamMap(String... params) {
        Map<String, Object> paramMap = new HashMap<>();
        if (params != null && params.length > 0) {
            for (int i = 0; i < params.length; i++) {
                paramMap.put(PARAM + i, params[i]);
            }
        }
        return paramMap;
    }

    public static Map<String, Object> toProblemParameters(String message, Map<String, Object> paramMap) {
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("message", message);
        parameters.put("params", paramMap);
        return parameters;
    }
}
