import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-deploy';

import { HardhatUserConfig } from 'hardhat/config';

/* This loads the variables in your .env file to `process.env` */

const { DEPLOYER_PRIVATE_KEY, INFURA_PROJECT_ID } = process.env;

const config: HardhatUserConfig = {
  solidity: '0.8.3',
  networks: {
    
    matic: {
        url: "https://polygon-mumbai.g.alchemy.com/v2/IhZfXc2eeeAl36aJbpEP17MUaoHy5qH3",
        accounts: ["0xaece8d8da9a28335c29cd164d8c01ce0cbe0bcd0b0f7c4f1ca705e94bcf04b04"]
    }
  },
  namedAccounts: {
    deployer: 0,
  },
};

export default config;