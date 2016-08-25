// config setup for different environments

// local_dev - uses mockjax for purely local front end development
// staging - for testing with endpoints hosted across the local network
// production - config items for app deployed to production

(function(global) {
  "use strict";
  var $ = global.jQuery;  // jshint ignore:line
  var GOVUK = global.GOVUK || {};

  GOVUK.config = {
    local_dev: {
      "getApplicationDetail": "/application/",
      "postEmailRequest":     "/message/send"
    },
    staging: {
      "getApplicationDetail": "http://localhost:8003/application/",
      "postEmailRequest":     "http://localhost:8003/message/send"
    }
  };
global.GOVUK = GOVUK;
})(window);


// this variable should be replaced by grunt during the build
var config_mode = '@@config_mode';

//console.log('config_mode set to:' + config_mode);
// set manually to a default in case grunt hasn't replaced the variable
if (config_mode.indexOf('@@') === 0)
{
    config_mode = 'local_dev';
}

//console.log('config_mode is ' + config_mode);

// set the config group to use - keep at local_dev and update in build as required
GOVUK.appConfig = GOVUK.config[config_mode];

//console.log(GOVUK.appConfig);

