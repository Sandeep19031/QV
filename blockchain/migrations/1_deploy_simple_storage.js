const Qvoting = artifacts.require("Qvoting");

module.exports = function (deployer) {
  deployer.deploy(Qvoting);
};
