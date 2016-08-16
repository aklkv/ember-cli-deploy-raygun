/* jshint node: true */
'use strict';
var BasePlugin = require('ember-cli-deploy-plugin');
var request = require('request');
var rp = require('request-promise');
var git = require('git-rev-sync');

module.exports = {
  name: 'ember-cli-deploy-raygun',
  createDeployPlugin: function(options) {
    var DeployPlugin = BasePlugin.extend({
      name: options.name,
      requiredConfig: ['key', 'token'],
      defaultConfig: {
        scmType: 'GitHub',
      },

      didDeploy: function(context) {
        console.log({
          apiKey: this.readConfig('key'),
          version: `${context.project.pkg.version}+${git.long(context.project.root).substring(0, 8)}`,
          scmIdentifier: git.long(context.project.root),
          scmType: this.readConfig('scmType'),
        })
        return rp({
          method: 'POST',
          url: 'https://app.raygun.io/deployments?authToken=' + this.readConfig('token'),
          json: true,
          body: {
            apiKey: this.readConfig('key'),
            version: `${context.project.pkg.version}+${git.long(context.project.root).substring(0, 8)}`,
            scmIdentifier: git.long(context.project.root),
            scmType: this.readConfig('scmType'),
          }
        }).then((res) => {
          this.log('Successfully sent deployment');
        }, (err) => {
          this.log('Error setting deployment' + err.message, {color: 'red'});
          throw err;
        });
      }
    });

    return new DeployPlugin();
  }
};
