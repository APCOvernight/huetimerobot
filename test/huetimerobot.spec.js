/* eslint-disable no-unused-expressions */

const chai = require('chai')
chai.use(require('sinon-chai'))
const expect = chai.expect
const sinon = require('sinon')
const HueTimeRobot = require('../')

let mockConfig
let hueTimeRobot
let sentryStub
let changeStub

describe('HueTimeRobot Class', function () {
  beforeEach(() => {
    mockConfig = {
      name: 'huetimerobot',
      uptimeRobotApiKey: 'm1234567-1235214535345323452',
      pollInterval: 5000,
      light: 'Hue color lamp 2'
    }

    hueTimeRobot = new HueTimeRobot(mockConfig, {})
  })

  it('It should set up the sentry api client', async () => {
    expect(hueTimeRobot.config).to.be.an('object')
    expect(hueTimeRobot.robot).to.be.undefined

    hueTimeRobot._setUpConfig()

    expect(hueTimeRobot.robot).to.be.an('object')
  })

  it('It should set status to warning if there are no monitors', async () => {
    const hueTimeRobot = new HueTimeRobot(mockConfig, {})
    hueTimeRobot._setUpConfig()
    sentryStub = sinon.stub(hueTimeRobot.robot, 'getMonitors').resolves([])
    changeStub = sinon.stub(hueTimeRobot, 'change').resolves(true)

    await hueTimeRobot._pollUptime()

    expect(sentryStub).to.be.calledWith()
    expect(changeStub).to.be.calledWith('warning', 'No monitor(s) found')

    sentryStub.restore()
    changeStub.restore()
  })

  it('It should set status to ok if there are no monitors down (multiple monitors key)', async () => {
    mockConfig.uptimeRobotApiKey = 'u14114141-124123141134124124'
    const hueTimeRobot = new HueTimeRobot(mockConfig, {})
    hueTimeRobot._setUpConfig()
    sentryStub = sinon.stub(hueTimeRobot.robot, 'getMonitors').resolves([{ status: '2' }])
    changeStub = sinon.stub(hueTimeRobot, 'change').resolves(true)

    await hueTimeRobot._pollUptime()

    expect(sentryStub).to.be.calledWith()
    expect(changeStub).to.be.calledWith('ok', 'All monitors up')

    sentryStub.restore()
    changeStub.restore()
  })

  it('It should set status to ok if there are no monitors down', async () => {
    const hueTimeRobot = new HueTimeRobot(mockConfig, {})
    hueTimeRobot._setUpConfig()
    sentryStub = sinon.stub(hueTimeRobot.robot, 'getMonitors').resolves([{ status: '2' }])
    changeStub = sinon.stub(hueTimeRobot, 'change').resolves(true)

    await hueTimeRobot._pollUptime()

    expect(sentryStub).to.be.calledWith()
    expect(changeStub).to.be.calledWith('ok', 'Monitor up')

    sentryStub.restore()
    changeStub.restore()
  })

  it('It should set status to alert if there are monitors down', async () => {
    const hueTimeRobot = new HueTimeRobot(mockConfig, {})
    hueTimeRobot._setUpConfig()
    sentryStub = sinon.stub(hueTimeRobot.robot, 'getMonitors').resolves([{ friendlyName: 'My Monitor', status: '8' }, { friendlyName: 'Another Monitor', status: '9' }])
    changeStub = sinon.stub(hueTimeRobot, 'change').resolves(true)

    await hueTimeRobot._pollUptime()

    expect(sentryStub).to.be.calledWith()
    expect(changeStub).to.be.calledWith('alert', 'My Monitor, Another Monitor monitor(s) down')

    sentryStub.restore()
    changeStub.restore()
  })

  it('It should set status to building if there are monitors not checked', async () => {
    const hueTimeRobot = new HueTimeRobot(mockConfig, {})
    hueTimeRobot._setUpConfig()
    sentryStub = sinon.stub(hueTimeRobot.robot, 'getMonitors').resolves([{ friendlyName: 'My Monitor', status: '2' }, { friendlyName: 'Another Monitor', status: '1' }])
    changeStub = sinon.stub(hueTimeRobot, 'change').resolves(true)

    await hueTimeRobot._pollUptime()

    expect(sentryStub).to.be.calledWith()
    expect(changeStub).to.be.calledWith('building', 'Another Monitor monitor(s) not checked yet')

    sentryStub.restore()
    changeStub.restore()
  })

  it('Should throw when config variable is missing', () => {
    mockConfig.uptimeRobotApiKey = undefined
    const hueTimeRobot = new HueTimeRobot(mockConfig, {})
    expect(() => { hueTimeRobot._setUpConfig() }).to.throw('UptimeRobot uptimeRobotApiKey config value not set')
  })

  it('Should generate instance name based on org and project', () => {
    const hueTimeRobot = new HueTimeRobot(mockConfig, {})
    expect(hueTimeRobot.instanceName).to.equal('UptimeRobot: m1234567')
  })

  it('Should poll every x seconds', async () => {
    this.clock = sinon.useFakeTimers()
    const hueTimeRobot = new HueTimeRobot(mockConfig, {})
    hueTimeRobot._setUpConfig()

    sinon.stub(hueTimeRobot, '_pollUptime')

    await hueTimeRobot.start()

    this.clock.tick(3000)

    expect(hueTimeRobot._pollUptime).to.not.be.called

    this.clock.tick(3000)

    expect(hueTimeRobot._pollUptime).to.be.calledOnce

    this.clock.tick(3000)

    expect(hueTimeRobot._pollUptime).to.be.calledOnce

    this.clock.tick(3000)

    expect(hueTimeRobot._pollUptime).to.be.calledTwice

    this.clock.restore()
  })

  it('Poll every 2 seconds by default', async () => {
    this.clock = sinon.useFakeTimers()
    mockConfig.pollInterval = undefined
    const hueTimeRobot = new HueTimeRobot(mockConfig, {})
    hueTimeRobot._setUpConfig()

    sinon.stub(hueTimeRobot, '_pollUptime')

    await hueTimeRobot.start()

    this.clock.tick(1200)

    expect(hueTimeRobot._pollUptime).to.not.be.called

    this.clock.tick(1200)

    expect(hueTimeRobot._pollUptime).to.be.calledOnce

    this.clock.tick(1200)

    expect(hueTimeRobot._pollUptime).to.be.calledOnce

    this.clock.tick(1200)

    expect(hueTimeRobot._pollUptime).to.be.calledTwice

    this.clock.restore()
  })

  it('Should throw an error when HueStatus is not found', () => {
    delete require.cache[require.resolve('requireg')]
    delete require.cache[require.resolve('../')]
    const requiregStub = sinon.stub(require('requireg'), 'resolve').throws('Not found')

    expect(() => { require('../') }).to.throw('A HueStatus installation is required -- npm install -g huestatus')

    requiregStub.restore()
  })
})
