# Shareholder Rights Management on a Permissioned Blockchain
The repository accompanies the academic paper:

[Luke Riley, Grammateia Kotsialou, Amrita Dhillon, Toktam Mahmoodi, Peter McBurney, Richard Pearce: Deploying a Shareholder Rights Management System onto a Distributed Ledger. AAMAS 2019: 2381-2383](https://dl.acm.org/citation.cfm?id=3332119)

The code was demoed at the [AAMAS Conference](http://aamas2019.encs.concordia.ca/accdemos.html). To see a video of the demo, go [here](https://www.youtube.com/watch?v=zD51J4YcnO0).

This software was developed using [the Quorum blockchain](https://github.com/jpmorganchase/quorum), [the truffle framework](https://github.com/trufflesuite/truffle) and [nodejs](https://github.com/nodejs).

The code creates a permissioned blockchain system, where the architecture can be seen in [Architecture](Fig1.pdf). That is, there are multiple access points to the data, through multiple agents, where each agent runs provides a server and website access point.

## Blockchain Setup

Make sure that you have an instance of the Quorum or Ethereum blockchain running and that truffle is correctly connecting to it through its [truffle-config.js](TruffleVersion/truffle-config.js) file.

Next, navigate to the TruffleVersion folder, and migrate the contracts using Truffle. Afterwards you can test the contracts were deployed, again by using Truffle.

## Server Setups

To spin up two servers for different different agent's access points, run the [ServerForTruffle.js](TruffleVersion/src/ServerForTruffle.js) and [ServerForTruffle2.js](TruffleVersion/src/ServerForTruffle2.js) files in separate terminals.

You should then be able to access the website through the IP address printed on the terminal.

## Website Instructions

I recommend watching the previously mentioned [video](https://www.youtube.com/watch?v=zD51J4YcnO0), to be clear on how the website can be used. Not that a few features need to be implemented and improved. Basic instructions are as follows:

When you connect to the website, you will see a login screen. There are currently no username and passwords connected, so just proceed straight in. Note that each agent terminal connects to a different blockchain node (and uses a different public-private key pair - as far as I remember). In the future, better management of keys in all of the servers should be added.

Now that you are logged in, we need to upload some data. Go to the Data Upload page. Upload one of the company data files from the [TestData](TestData) folder. You now have some data in the system.

You can now proceed to create elections for the company you have uploaded, by going to the Initiate Event page and selecting Create a Vote. Proceed to fill in the required parameters. 

Once an election has been implemented, you can analyse the results by going to the report page. Here you can vote also. 
