Simple standalone patient context selector that allows searching for a patient by identifier (MRN), name, date of birth or gender. This is a React frontend with a JHipster microservice backend. The Keycloak SMART authenticator is configured to redirect to this application for patient selection during the authorization process when 'launch/patient' scope is provided. Communication between Keycloak and the selector is modeled on the mechanism used by Keycloak to communicate with external identity providers, such as Google or Facebook.

The SMART authenticator provides the following query parameters to the launch application on redirect:
1. "aud": Encoded FHIR base URL to search for patients.
2. "access_token": Valid OAuth access token provided by Keycloak to use for patient search against FHIR server. This is required for the Authorization header to the backend Java microservice calls for use in the FHIR client.
3. "token": Keycloak generated callback URL to redirect back to Keycloak after a patient is selected. The encoded URL should include a placeholder parameter with the value "{APP_TOKEN}" for the selector to insert a signed launch context JWT to return to Keycloak.

```
http://localhost:9000/#/patient?token=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Frealms%2Figia%2Fprotocol%2Fsmart-openid-connect%2Fsmart-launch-context%3Fsession_code%3DqgqOShVCjZ0fnUgjP8abPQ9XbrDhNeY933XRfieoBFs%26client_id%3Dsmart-client-app%26tab_id%3D68Hqz1II7mw%26auth_session_id%3Dd0394dcb-4825-40ab-9807-8dc5c22c2ed8%26execution%3D09e7bbea-be91-4a09-bd17-c23f6e43cf60%26app-token%3D%257BAPP_TOKEN%257D&aud=http%3A%2F%2Flocalhost%3A8081%2Fapi&access_token=eyJhbGciO...
```

Any launch context parameters gathered by the app, in this case "patient", will be added as a claim to a JWT token that is signed and sent back to Keycloak in the callback URL {APP_TOKEN} parameter. The JWT token signature will be verified by Keycloak to ensure the callback endpoint is being called by a valid launch app. The launch app backend service should be configured with properties as below, with secret-key and algorithm used to sign the launch context JWT token to send back to Keycloak. The same key should be used in the SMART authenticator configuration property 'External SMART Launch Secret Key' within Keycloak. Currently only HS256 decryption is supported in the authenticator.
The launch app backend service should also be configured with a list of trusted host/ports allowed in the callback URL. If the provided callback URL does not have a match in this list, the service will return a bad request rather than redirecting to the untrusted URL.

```
igia:
  smart-launch:
    secret-key: aSqzP4reFgWR4j94BDT1r+81QYp/NYbY9SBwXtqV1ko=
    alg: HS256
    trusted-redirects:
      - 
        host: localhost
        port: 9080
      - 
        host: keycloak
        port: 9080 
```

This will redirect to Keycloak using the token URL provided in the initial parameters.
```
http://localhost:8080/auth/realms/igia/protocol/smart-openid-connect/smart-launch-context?session_code=qgqOShVCjZ0fnUgjP8abPQ9XbrDhNeY933XRfieoBFs&client_id=smart-client-app&tab_id=68Hqz1II7mw&auth_session_id=d0394dcb-4825-40ab-9807-8dc5c22c2ed8&execution=09e7bbea-be91-4a09-bd17-c23f6e43cf60&app-token=eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjAsIm5iZiI6MCwiaWF0IjowLCJwYXRpZW50IjoiMTIzNDUifQ.edaeLvGPoSfvy51Z-UhHvcdXMjro4Omn6Nl02r8Zyls
```

## Java microservice
Launch app backend service calls

### GET /api/patient
#### Request
|Parameter|cardinality|description|
|--- |--- |--- |--- |--- |
|aud|1..1|FHIR server base URL.|
|mrn|0..1|Patient MRN, to be used to search FHIR Patient resource identifier list.|
|first|0..1|Patient given name. Will be used to search FHIR patient resources using case-insensitive left match.|
|last|0..1|Patient family name. Will be used to search FHIR patient resources using case-insensitive left match.|
|birthdate|0..1|Patient date of birth, in ISO 8601 format yyyy-MM-dd.|
|gender|0..1|Patient gender (male, female, other, unknown).|

#### Response

Content-type: json array

|Field|cardinality|description|
|--- |--- |--- |--- |--- |
|id|1..1|FHIR Patient resource id.|
|mrn|0..1|Value of first item from FHIR Patient resource identifier list.|
|first|0..1|Given name from first item in FHIR Patient resource name list. If multiple given names will return concatenated list.|
|last|0..1|Family name from first item in FHIR Patient resource name list.|
|birthdate|0..1|Patient date of birth in ISO-8601 format, for example "2000-10-10T00:00:00Z".|
|gender|0..1|Patient gender (male, female, other, unknown).|


### GET /api/patient/{id}
#### Request

|Parameter|cardinality|description|
|--- |--- |--- |--- |--- |
|id|1..1|FHIR Patient resource id|
|token|1..1|Callback URL provided by Keycloak. Must include a parameter with value "{APP_TOKEN}". This parameter value will be replaced with a signed, encoded JWT token that includes the context variables provided by the selector as JWT claims.|

#### Response

Body: Callback URL to redirect back to Keycloak, with signed app token.

See Sample igia-smart-launch-app callback above for format of response body.


