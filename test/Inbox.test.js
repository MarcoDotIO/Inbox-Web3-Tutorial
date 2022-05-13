const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { abi, evm } = require('../compile');

let accounts;
let inbox;
let contractOwner;
let initialMessage;
let newMessage;

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    contractOwner = accounts[0];

    initialMessage = "Hello World!";
    newMessage = "Goodbye World!";

    const gas = '1000000';

    inbox = await new web3.eth.Contract(abi)
        .deploy({
            data: evm.bytecode.object,
            arguments: [initialMessage],
        })
        .send({ 
            from: contractOwner, 
            gas 
        });
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        console.log('CONTRACT ADDRESS - ', inbox.options.address);

        assert.ok(inbox.options.address);
    });
    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        console.log('INITIAL MESSAGE - ', message);

        assert.equal(message, initialMessage);
    });
    it('can change the message', async () => {
        const txHash = await inbox.methods.setMessage(newMessage).send({ from: contractOwner });
        console.log('TX HASH - ', txHash);

        assert.ok(txHash);
    });

    it('has changed the message', async () => {
        await inbox.methods.setMessage(newMessage).send({ from: contractOwner });
        const message = await inbox.methods.message().call();
        console.log('NEW MESSAGE - ', message);

        assert.equal(message, newMessage);
    });
});