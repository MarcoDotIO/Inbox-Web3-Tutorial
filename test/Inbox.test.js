// contract test code will go here
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { interface, bytecode } = require('../compile');

const web3 = new Web3(ganache.provider());

// Test examples

// class Car {
//     park() {
//         return 'stopped';
//     }

//     drive() {
//         return 'vroom';
//     }
// }

// let car;

// beforeEach(() => {
//     car = new Car();
// });

// describe('Car', () => {
//     it('can park', () => {
//         assert.equal(car.park(), 'stopped');
//     });

//     it('can drive', () => {
//         assert.equal(car.drive(), 'vroom');
//     });
// });

let accounts = [];
let inbox;
let contractOwner;
let initialMessage;
let newMessage;

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    contractOwner = accounts[0];

    initialMessage = 'Hello world!';
    newMessage = 'Goodbye world!';

    const gas = '1000000';

    // Use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ 
            data: bytecode, 
            arguments: [initialMessage] 
        })
        .send({ 
            from: contractOwner, 
            gas 
        });
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        console.log('DEBUG: ADDRESS - ', inbox.options.address);
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        console.log('DEBUG: INITIAL MESSAGE - ', message);
        assert.equal(message, initialMessage);
    });

    it('can set the new message', async () => {
        const txHash = await inbox.methods.setMessage(newMessage).send({ from: contractOwner });
        console.log('DEBUG: TX HASH - ', txHash);
        assert.ok(txHash);
    });

    it('has set the new message', async () => {
        await inbox.methods.setMessage(newMessage).send({ from: contractOwner });

        const message = await inbox.methods.message().call();
        console.log('DEBUG: NEW MESSAGE - ', message);
        assert.equal(message, newMessage);
    });
});