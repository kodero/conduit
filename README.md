# Generic Angular Webpack seed frontend

**Generic Frontend** is an open source, admin dashboard template for [Bootstrap](http://getbootstrap.com/) originally created by [Start Bootstrap](http://startbootstrap.com/).

You can find a demo [here](http://generic-frontend.corvidpartnersltd.com). A full Java backend can also be bootstraped from [here](http://github.com/kodero/generic-java-backed)


## Features

* Angular 1.6, core, router, resource, ocLazyLoad, angular-strap, angular-filter, fully bootstraped
* Navbar with left and right menu + Sidebar(metis menu)
* FontAwesome Icons (Version 4.6)
* Tabbed Panels with optional Dropdowns
* Scripts to run a dev server localy, package production builds, and deploy to jboss application server
* JS and CSS packaging built-in
* Bundled angular-websockets for events driven UI
* Already talks to a Java backend


## Getting Started

To use this template, choose one of the following options to get started:

* Download the latest release as ZIP file from GitHub
* Clone this repository from GitHub
* Install using [Webpack](https://webpack.js.org)


### Webpack Install

[Install Webpack 2.x](https://webpack.js.org/guides/installation/) if you don't already have it present on your system:

    $ npm install webpack --save-dev #You can do -g to install in global mode

## Developing
To develop inside the project(```cd GenericFrontEnd```), simply run the  commands below to install the dev server, project dependencies and run the bundler in watch mode:

    $ npm install -g http-server #to install the http-server for development
    $ npm install #to install the project dependencies
    $ npm run bundle 

That runs the webpack bundler and creates application binary files inside dist folder.

On another terminal, run 

    $ npm start 

and navigate to [localhost:8000](localhost:8000) to see the application running locally.

## Production build
To perform production builds, run the any of the below commands

    $ npm run bundle-prod #bundle the js/css assets for production environment

package the production assets into .war file, ready to be deployed on any java application server

    $ npm run package 

Bonus! Package and deploy to [Wildfly](http://wildfly.org/) application server (You need to export $WILDFLY_HOME as an environment variable)

    $ npm run package-deploy

## Bugs and Issues

Have a bug or an issue with this template? [Open a new issue](https://github.com/kodero/generic-angular-frontend/issues) here on GitHub.

One known bug is with the angular-websocket module where it includes 'ws' module. The issue is documented [here](https://github.com/AngularClass/angular-websocket/issues/82). A simple solution is to remove the 'ws' dependency in the file node_modules/angular-websocket/dist/angular-websocket.js like so

    $ define(['module', 'exports', 'angular'/*, 'ws'*/], factory);

## Contributors / Credits

**Generic Frontend** is based on [Starmin](http://startbootstrap.com/template-overviews/startmin/) from [Start Bootstrap](http://startbootstrap.com/).

This template is based on the [Bootstrap](http://getbootstrap.com/) framework created by [Mark Otto](https://twitter.com/mdo) and [Jacob Thorton](https://twitter.com/fat).
It makes use of the [FontAwesome](http://fontawesome.io/) icons by [Dave Gandy](https://twitter.com/davegandy). 

Many thanks to the creator of and the snippet contributors at [Bootsnipp](http://bootsnipp.com/). 


## Copyright and License

Copyright 2017-2016 Kennedy O Odero / Corvid Partners Ltd.

Code released under the [Apache 2.0](https://github.com/IronSummitMedia/startbootstrap-sb-admin-2/blob/gh-pages/LICENSE) license.
