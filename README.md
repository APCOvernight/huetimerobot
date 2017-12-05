# HueTry

[![NPM Package](https://img.shields.io/npm/v/huetry.svg?maxAge=2592000)](https://npmjs.com/package/huetry) ![License](https://img.shields.io/npm/l/huetry.svg) [![Build Status](https://travis-ci.org/APCOvernight/huetry.svg?branch=master)](https://travis-ci.org/APCOvernight/huetry) [![Coverage Status](https://coveralls.io/repos/github/APCOvernight/huetry/badge.svg?branch=master)](https://coveralls.io/github/APCOvernight/huetry?branch=master) [![Maintainability](	https://img.shields.io/codeclimate/maintainability/APCOvernight/huetry.svg)](https://codeclimate.com/github/APCOvernight/huetry/maintainability) 
[![Dependencies](https://img.shields.io/david/APCOvernight/huetry.svg)](https://david-dm.org/APCOvernight/huetry) [![Greenkeeper badge](https://badges.greenkeeper.io/APCOvernight/huetry.svg)](https://greenkeeper.io/)

Sentry reporter for HueStatus

## Features
- Set your Hue light to "alert" when an unresolved and unassigned issue is found on Sentry.
- Then back to "Ok" when issues are assigned or resolved.

## Installation

```
npm install -g huestatus huetry
```

Create a .huerc file on your home directory, see [HueStatus Docs](https://www.npmjs.com/package/huestatus) for more info. Add an object like this to the modules array for each of the projects you want to monitor:

```js
{
  "name": "huetry", // Required to tell HueStatus to load this module
  "light": "Hue color lamp 2", // Which Hue light to use
  "sentryApiKey": "3abxxxxxxxxxxxxxxxxx0f5", // Your sentry API key. You will need Project Read and Event Read priveleges
  "project": "", // Project Slug
  "organisation": "" // Organisation slug
}

```

Then run `huestatus`, each job will be loaded into HueStatus and your selected light(s) changed accordingly.
