/**
 * AccountController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var ark = require("arkjs");

//required to connect to the specific test net
ark.crypto.setNetworkVersion('0x32');

//the nethash to specify this particular testnet
var nethash = '317aca698d16678d2b047ccdbc1be8029eb833f21001747aa87654f0c14297f8'

var request = require('request');
var syncRequest = require('sync-request');

var escrowpassphrase = 'aunt cute detect monkey skirt copper example easy night crucial swamp pull';
var Patientpassphrase = 'text suspect turkey marine solution accident solution elevator boat push void cinnamon';
var Providerpassphrase= 'slab cream sport call abuse prosper lounge ozone novel gloom despair foster';

var escrowAddress = 'MWJKLzYNRxecHNTUzyezqVpQ4ZVXFVxN8S';
var providerAddress = 'MSDdVYVmph5TeYvsJYTx6xazTNz6kGcz5b';

module.exports = {

  getBalance: function(accountAddress) {
    var response = syncRequest('GET', "http://140.82.63.242:4100/api/accounts?address=" + accountAddress);
    response = JSON.parse(response.getBody());
    return response.account.balance
  },

  getEscrowBalance: async function() {
    console.log('->getEscrowBalance');
    var balance = this.getBalance(escrowAddress);
    console.log('->getEscrowBalance = ' + balance);
    return balance;
  },

  getProviderBalance: async function() {
    console.log('->getProviderBalance');
    var balance = this.getBalance(providerAddress);
    console.log('->getProviderBalance = ' + balance);
    return balance;
  },

  testTransaction: function(req, res) {

    //preparing transaction to escrow wallet
    var transaction = ark.transaction.createTransaction(escrowAddress, 1000000000, null, Patientpassphrase);

    request({
      url: "http://140.82.63.242:4100/peer/transactions",
      json: {
        transactions: [transaction]
      },
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "os": "linux3.2.0-4-amd64",
        "version": "0.3.0",
        "port": 4100,
        "nethash": '317aca698d16678d2b047ccdbc1be8029eb833f21001747aa87654f0c14297f8'
      },
    }, function(error, response, body) {

      if(body.success){
        console.log("sending reoccuring payment")
      }
    });
  },

  checkEscrowWallet: function(req, res) {

    //checks balence of the escrow wallet
    request({
      url: "http://140.82.63.242:4100/api/accounts?address=MWJKLzYNRxecHNTUzyezqVpQ4ZVXFVxN8S",
      method: "GET",
    }, function(error, response, body) {
      // response = JSON.parse(response);
      response = JSON.parse(response.body);
      var balence = response.account.balance
        console.log(balence)
        if(balence >= 10){
          console.log('escrow balence is '+ balence +'! Releasing escrow to provider!');
          release();
        }else{
        console.log('escrow balence is '+ balence +'! Holding until over cap is reached!');
        }
    });

  release = function(){
    var transaction = ark.transaction.createTransaction(providerAddress, 10000000000 , null, escrowpassphrase);

        request({
          url: "http://140.82.63.242:4100/peer/transactions",
          json: {
            transactions: [transaction]
          },
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "os": "linux3.2.0-4-amd64",
            "version": "0.3.0",
            "port": 4100,
            "nethash": '317aca698d16678d2b047ccdbc1be8029eb833f21001747aa87654f0c14297f8'
          },
        }, function(error, response, body) {

          console.log(body);
        });

      }
  }



};
