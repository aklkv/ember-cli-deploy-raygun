/* jshint node: true */
'use strict';
var BasePlugin = require('ember-cli-deploy-plugin');
var request = require('request');
var rp = require('request-promise');
var git = require('git-rev-sync');
var Q = require('q');
var path = require('path');
var fs = require('fs');

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
        this.log('Creating Raygun Deployment');
        return rp({
          method: 'POST',
          url: 'https://app.raygun.io/deployments?authToken=' + this.readConfig('token'),
          json: true,
          body: {
            apiKey: this.readConfig('key'),
            version: `${context.project.pkg.version}+${git.long(context.project.root).substring(0, 8)}`,
            scmIdentifier: git.long(context.project.root),
            scmType: this.readConfig('scmType'),
          },
        })
        .then(() => {
          let mapFiles = context.distFiles.filter((file) => file.endsWith('.map'))

          if (mapFiles.length) {
            let prefix = this.readConfig('prefix');
            let appId = this.readConfig('appId');

            if (!prefix) {
              this.log('You must provide prefix config to upload sourcemaps to Raygun - Skipping stage', { color: 'red' });
              return;
            }

            if (!appId) {
              this.log('You must provide appId config to updload sourcemaps to Raygun - Skipping stage', { color: 'red' });
            }

            this.log('Uploading sourcemaps to Raygun');

            let promises = mapFiles.map((file) => {
              // match the sourcemap with the distfile
              let mapFileRoot = file.split('-').slice(0, -1);

              let matchingDistFile = context.distFiles
                .filter((distFile) => !distFile.endsWith('.map'))
                .find((distFile) => {
                  let fingerPrintRegex = /(.*)-[\w]{32}.js/;

                  if(distFile.match(fingerPrintRegex)){
                    var mapFileResults = /(.*)-[\w]{32}.map/.exec(file);
                    var distFileResults = fingerPrintRegex.exec(distFile);

                    return distFileResults[1] === mapFileResults[1]
                  } else if(distFile.endsWith('.js')) {
                    return file.slice(0, -4) === distFile.slice(0, -3);
                  }
                });

              if(!matchingDistFile) {
                this.log(`No matching dist file for ${file}`, { color: 'red' });
                return Q();
              }

              return rp({
                method: 'POST',
                url: `https://app.raygun.io/upload/jssymbols/${this.readConfig('appId')}?authToken=${this.readConfig('token')}`,
                formData: {
                  url: this.readConfig('prefix') + file,
                  file: fs.createReadStream(path.join(context.project.root, context.distDir, file)),
                }
              });
            })

            return Q.all(promises);
          }
        })
        .then(() => {
          this.log('Raygun updated successfully');
        }, (err) => {
          this.log('Error setting deployment' + err.message, {color: 'red'});
        });
      }
    });

    return new DeployPlugin();
  }
};
