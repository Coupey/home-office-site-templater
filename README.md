# gov.uk webpage templating and rendering

This repo is a framework for creating consistent webpages for use with UK Government websites. It is based on the GDS prototyping kit (and uses nunjucks for templating) but allows more flexibility. It assumes you require the pages output as flat HTML/CSS/JS to be used with whatever backend you are using for production - there is no direct nodejs support/running. 

This includes the styles taken from [Gov UK Frontend Toolkit](https://github.com/alphagov/govuk_frontend_toolkit) and sass from [govuk-elements-sass](https://github.com/alphagov/govuk_elements)

## Table of contents
1. [Requirements](#requirements)
2. [Setup](#setup)
3. [Run](#run)
3. [Developer notes](#devnotes)

<a name="requirements"></a>
## Requirements
This repo requires you to have NodeJS installed (version 4.x.x or higher).

### NodeJs & NPM
- Install [NodeJs](nodejs.org)

<a name="setup"></a>
## Setup

- `$ cd <your_project_folder`
- `$ npm install`

<a name="run"></a>
## Run

- Run `$ gulp dev`
- A window will automatically open on `http://localhost:8000` on the page specified in the gulpfile.js file
- the built flat pages will be in the 'build' folder
- specify other grunt targets to build for production (for instance with minification and so on) as needed by your project

<a name="devnotes"></a>
##Developer notes

- uses mockjax to do stubbed responses to ajax requests
- appconfig.js specifies different endpoints for ajax requests - edit as required by your environments and point to the relevant endpoint by setting up an appropriate Grunt 'replace' task
- Chimp has been included to do automated running of unit tests (jasmine) and cucumber