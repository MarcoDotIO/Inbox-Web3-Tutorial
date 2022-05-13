require('dotenv').config()

// deploy code will go here
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    process.env.HD_WALLET_MNEMONIC,
    process.env.RINKEBY_TEST_URL
);

const web3 = new Web3(provider);

const initialMessage = "Hello world!";

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    const deployerAccount = accounts[0];

    console.log('Attempting to deploy from account - ', deployerAccount);

    const gas = '1000000';

    const inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({
            data: bytecode,
            arguments: [initialMessage]
        })
        .send({
            from: deployerAccount,
            gas
        });

    console.log('Contract successfully deployed to - ', inbox.options.address);

    provider.engine.stop();
};

deploy();