source ../../.env

pact-broker publish ./pacts --consumer-app-version %npm_package_version% --tag master --broker-base-url ${PACT_BROKER_URL} --broker-username ${PACT_BROKER_USERNAME} --broker-password ${PACT_BROKER_PASSWORD}