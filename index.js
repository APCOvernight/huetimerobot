let BaseModule

try {
  BaseModule = require(require('requireg').resolve('huestatus/src/Module'))
} catch (e) {
  throw new Error('A HueStatus installation is required -- npm install -g huestatus')
}

const Robot = require('uptime-robot')

class HueTry extends BaseModule {
  /**
   * Generate instance name based on project and organisation
   * @return {String} [description]
   */
  generateInstanceName () {
    if (this.config.uptimeRobotApiKey && this.config.uptimeRobotApiKey[0] === 'm') {
      return `UptimeRobot: ${this.config.uptimeRobotApiKey.split('-')[0]}`
    }

    return `UptimeRobot: *`
  }

  /**
   * Start method, called on huestatus start. Loops through api polling
   */
  async start () {
    this._setUpConfig()
    setInterval(this._pollUptime.bind(this), this.config.pollInterval || 2000)
  }

  /**
   * Check for config variables and create Uptime API Client
   * @throws error when required config value is not set
   */
  _setUpConfig () {
    ['uptimeRobotApiKey'].map(configItem => {
      if (!this.config[configItem]) {
        throw new Error(`UptimeRobot ${configItem} config value not set`)
      }
    })

    this.robot = new Robot(this.config.uptimeRobotApiKey)
  }

  /**
   * Make a request to the sentry API, check for unresolved issues, then filter out already assigned issues
   * @return {Promise}
   */
  async _pollUptime () {
    const monitors = await this.robot.getMonitors()
    const failing = []
    const building = []

    if (!monitors.length) {
      return this._warning()
    }

    monitors.map(monitor => {
      const status = parseInt(monitor.status)

      if (status === 1) {
        building.push(monitor.friendlyName)
      }

      if (status > 2) {
        failing.push(monitor.friendlyName)
      }
    })

    if (failing.length) {
      return this._alert(failing)
    }

    if (building.length) {
      return this._building(building)
    }

    return this._ok()
  }

  /**
   * Set the status to ok
   * @return {Promise}
   */
  async _ok () {
    await this.change('ok', `${this.config.uptimeRobotApiKey[0] === 'm' ? 'Monitor' : 'All monitors'} up`)
  }

  /**
   * Set the status to alert and log the number of issues
   * @param  {Array.String}  monitorNames Name of issue to report on
   * @return {Promise}
   */
  async _alert (monitorNames) {
    monitorNames = monitorNames.join(', ')
    await this.change('alert', `${monitorNames} monitor(s) down`)
  }

  /**
   * Set the status to alert and log the number of issues
   * @param  {Array.String}  monitorNames Name of issue to report on
   * @return {Promise}
   */
  async _building (monitorNames) {
    monitorNames = monitorNames.join(', ')
    await this.change('building', `${monitorNames} monitor(s) not checked yet`)
  }

  /**
   * Set the status to warning if no monitors are found
   * @return {Promise}
   */
  async _warning () {
    await this.change('warning', 'No monitor(s) found')
  }
}

module.exports = HueTry
