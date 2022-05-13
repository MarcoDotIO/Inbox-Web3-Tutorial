require('dotenv').config()

const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const { abi, evm } = require('./compile');

const provider = new HDWalletProvider(
    process.env.HD_WALLET_MNEMONIC,
    process.env.RINKEBY_TEST_URL
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    const deployerAccount = accounts[0];

    console.log('Attempting to deploy from account - ', deployerAccount);

    const gas = '1000000';
    const initialMessage = "Hello world!";

    const inbox = await new web3.eth.Contract(abi)
        .deploy({ 
            data: evm.bytecode.object, 
            arguments: [initialMessage] 
        })
        .send({ 
            from: deployerAccount, 
            gas 
        });

    console.log('Contract deployed to - ', inbox.options.address);
    
    provider.engine.stop();
};

deploy();