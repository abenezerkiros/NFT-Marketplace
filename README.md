# NidhiDAO-marketplace-frontend


## 🚀 Run locally
```shell
git clone https://github.com/NidhiDAO/NidhiDAO-marketplace
```

run hardhat node in NidhiDAO-marketplace repo and keep node in the terminal
```shell
npm i & npx hardhat node
```

in another terminal window - deploy the contracts to your local node
```shell
npx hardhat run scripts/deploy.js --network localhost
```

clone one more repo and choose needed branch
```shell
git clone https://github.com/NidhiDAO/Balarama-contracts
```

in `scripts/deployAllTest.js`
- set the `firstEpochBlock` to `1000`
- set `createdPairAddress` to `0x0Ec2cf1bEa8ef02eecA91edD948AAe78ffFd75e8`
- remove `frax` from `Treasury.deploy`

then in Balarama-contracts add .env file and run
```shell
npx hardhat run scripts/deployAllTest.js --network localhost
```

in the NidhiDAO-marketplace repo create .env file with. Just replace the addresses with your local ones
```shell
GURU_ADDRESS=
SGURU_ADDRESS=
STAKING_CONTRACT_ADDRESS=
```

#### ⚠️ in NidhiDAO-marketplace-frontend repo src/constants.ts set all constants

## How to run the Client
1. Run `npm install` to install all dependencies.
2. Run `npm start` to start the app
   open your browser in http://localhost:3000/

set `localhost:8545` in Metamask networks.

#### 🎉 Frontend ready to develop 

### AND ONE MAIN POINT in `src/pages/MyNft.js` set needed network
```javascript
const web3Modal = new Web3Modal({
      network: "localhost",
      cacheProvider: true,
})
```


