# Cypress Sandbox

## [![Cypress Tests](https://github.com/bpnash/automation-sandbox-javascript/actions/workflows/cypress-tests.yml/badge.svg)](https://github.com/bpnash/automation-sandbox-javascript/actions/workflows/cypress-tests.yml/) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/bpnash/automation-sandbox-javascript/cypress-tests.yml) ![GitHub](https://img.shields.io/github/license/bpnash/automation-sandbox-javascript) ![GitHub top language](https://img.shields.io/github/languages/top/bpnash/automation-sandbox-javascript)

This repo contains a basic Cypress framework, that is set ups with tests for the [MVC To Do application](http://todomvc-app-for-testing.surge.sh/)

There is a GitHub Actions workflow to run the tests on pushes from develop and merges to main.

## Installation

`npm i`

Tests are located in the `e2e\0-todo-mvc` folder.

The Cypress example tests are included in the repo and can be removed if not required. Located in `e2e\1-getting-started` and `e2e\2-advanced-examples`

## Run tests

When running Cypress for the first time you may be prompted with some set up questions

To run the tests you may use the following scripts:

`npm run cy:open` to open the test runner. Tests can be run individually.

`npm run cy:run:todo-vanilla` will run the basic test suite
