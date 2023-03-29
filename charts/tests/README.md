# Run integration tests

Tests are made by two files:
1. `pulsar-admin-console/templates/tests/test-[TESTNAME].yaml`
1. `tests/test-specs/values-[TESTNAME].yaml`

Before starting the test suite, a k3s cluster is created using docker.
There's no requirements for running tests locally except for helm and docker.

## Run a test

```
pulsar-admin-console/tests/run-tests.sh [TESTNAME]
```

## Run all tests

```
pulsar-admin-console/tests/run-tests.sh
```

