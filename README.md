SODALES y2 review GUI
================

Technologies
------------

* [AngularJS](http://angularjs.org/)
* [Bootstrap](http://getbootstrap.com/)
* [Jersey](https://jersey.java.net/)
* [Spring Security](http://projects.spring.io/spring-security/)
* [Hibernate](http://hibernate.org/)
* [D3JS](http://d3js.org/)

Running
-------

Make sure [Maven](http://maven.apache.org/) >= 2.2.1 is installed on your system. 
Go into the project dir and type `mvn jetty:run`, then point your browser to `http://localhost:8080`.

'bower install' for js dependencies

Based
-------

https://github.com/philipsorst/angular-rest-springsecurity


mvn -Djetty.port=9999 jetty:run


Integrate:
https://bitbucket.org/infinit-group/cvdb/overview
https://github.com/ppp21/spring-websockets.git


Installation
-------
Javascript dependencies:
$ npm install bower --save-dev
For tests: 
Install Karma:
$ npm install karma --save-dev
# Install plugins that your project needs:
$ npm install karma-jasmine karma-chrome-launcher --save-dev

Adding new features in Angular
-------
* Create partial view
* Create controller
* Create service
* Add controller and view in app.js config
* Add js libs to index.html
