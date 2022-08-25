/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.9",
  networks: {
    matic: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/ftHgEfZAtXS0jOLTm1YpjXbWONX1xdHI`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};
