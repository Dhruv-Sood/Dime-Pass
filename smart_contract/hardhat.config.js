// https://eth-sepolia.g.alchemy.com/v2/671wcez_2PsTp5ilQH7M9pdDeMtjcimI

require('@nomiclabs/hardhat-waffle')
require('dotenv').config()

module.exports = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/671wcez_2PsTp5ilQH7M9pdDeMtjcimI",
      accounts: [
        process.env.PRIVATE_KEY,
      ],
    },
  },
};