[![Code Climate](https://codeclimate.com/github/aklkv/ember-cli-deploy-raygun/badges/gpa.svg)](https://codeclimate.com/github/aklkv/ember-cli-deploy-raygun)
[![Issue Count](https://codeclimate.com/github/aklkv/ember-cli-deploy-raygun/badges/issue_count.svg)](https://codeclimate.com/github/aklkv/ember-cli-deploy-raygun)
# Ember-cli-deploy-raygun

Ember-cli-deploy plugin to upload source maps and submit deployment information to [Raygun](http://raygun.com).

## Installation
------------------------------------------------------------------------------

`ember install ember-cli-deploy-raygun`

## Configuration

```javascript
// config/deploy.js

var ENV = {
  …
  raygun: {
    key: '', //  Raygun apiKey
    token: '', // Raygun External Access Token
    prefix: '', // optional url prefix for (used for sourcemaps only)
    appId: '', // optional application id (used for sourcemaps only)
  },
  ...
};

```

### Where to find stuff

- **API Key** can be found on application settings page.
- [**Token**](https://raygun.com/docs/workflow/external-access-token)
- **Prefix** is url pointing to where your files are stored (e.g `https://s3-eu-west-1.amazonaws.com/<bucketName>/`).
- **Application ID** is the last portion of Ragun dashboard url (e.g `https://app.raygun.com/dashboard/<appId>`).

## Sourcemaps

In order for sourcemaps to work enable sourcemaps generation in `ember-cli-build.js` as follows:

```javascript
// ./ember-cli-build.js

sourcemaps: {
      enabled: true
    }

```
### Linting

- `npm run lint:hbs`
- `npm run lint:js`
- `npm run lint:js -- --fix`

### Running tests

- `ember test` – Runs the test suite on the current Ember version
- `ember test --server` – Runs the test suite in "watch mode"
- `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

- `ember serve`
- Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

### License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
