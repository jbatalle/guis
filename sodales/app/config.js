'use strict';

angular.module('mqnaasApp.config', [])
    .constant('AUTHENTICATION', 'http://127.0.0.1:5000/')
    .value('BACKEND', 'http://127.0.0.1:9100/')
    .constant('ARN_ENDPOINT', 'http://fibratv.dtdns.net:41080/cgi-bin/xml-parser.cgi')
    .value('CPE_ENDPOINT', 'http://fibratv.dtdns.net:41081/');
