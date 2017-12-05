# HueTimeRobot

[![NPM Package](https://img.shields.io/npm/v/huetimerobot.svg?maxAge=2592000)](https://npmjs.com/package/huetimerobot) ![License](https://img.shields.io/npm/l/huetimerobot.svg) [![Build Status](https://travis-ci.org/APCOvernight/huetimerobot.svg?branch=master)](https://travis-ci.org/APCOvernight/huetimerobot) [![Coverage Status](https://coveralls.io/repos/github/APCOvernight/huetimerobot/badge.svg?branch=master)](https://coveralls.io/github/APCOvernight/huetimerobot?branch=master) [![Maintainability](	https://img.shields.io/codeclimate/maintainability/APCOvernight/huetimerobot.svg)](https://codeclimate.com/github/APCOvernight/huetimerobot/maintainability) 
[![Dependencies](https://img.shields.io/david/APCOvernight/huetimerobot.svg)](https://david-dm.org/APCOvernight/huetimerobot) [![Greenkeeper badge](https://badges.greenkeeper.io/APCOvernight/huetimerobot.svg)](https://greenkeeper.io/)

Sentry reporter for HueStatus

## Features
- Add individual monitors (by unique api key) or add all
- Set your Hue light to "alert" when a monitor is down.
- Set your Hue light to "building" when a monitor is not yet checked.
- Set your Hue light to "warning" when no monitors are found.
- Set your Hue light to "ok" when all monitors are up.

## Installation

```
npm install -g huestatus huetimerobot
```

Create a .huerc file on your home directory, see [HueStatus Docs](https://www.npmjs.com/package/huestatus) for more info. Add an object like this to the modules array for each of the projects you want to monitor:

```js
{
  "name": "huetimerobot", // Required to tell HueStatus to load this module
  "light": "Hue color lamp 2", // Which Hue light to use
  "uptimeRobotApiKey": "u1231414-12412414145525", // Your Uptime Robot API key. Can be an account or individual monitor api key
  "pollInterval": 2000 // Polling interval in milliseconds
}

```

Then run `huestatus`, each job will be loaded into HueStatus and your selected light(s) changed accordingly.
