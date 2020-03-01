const core = jest.genMockFromModule("@actions/core")

core.debug = console.log

module.exports = core
