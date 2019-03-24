<template>
    <div style="height: 100%">
        <md-tabs class="md-primary" md-alignment="centered">
            <md-tab id="tab-seller" md-label="Seller" to="/components/tabs/seller">
                <md-button id="create" class="md-primary" @click="createStore">Create store</md-button>
                <md-field v-if="show_input" style="width: 50%; margin-top: 10%">
                    <label style="font-size: 12px"></label>
                    <md-input style="cursor: pointer;" v-model="store_address" disabled></md-input>
                    <span class="md-helper-text">Save this address for next step!</span>
                </md-field>
                <hr>
                <md-field style="width: 50%; margin-top: 10%">
                    <label style="font-size: 12px">Enter contract address</label>
                    <md-input v-model="address"></md-input>
                </md-field>
                <md-button id="orders" class="md-primary" @click="check_orders">Check new orders</md-button>
                <md-button id="rating" class="md-primary" @click="rating">Rating</md-button>
                <md-button id="rating" class="md-primary" @click="feedbeck">Test</md-button>
            </md-tab>



            <md-tab id="tab-buyer" md-label="Buyer" to="/components/tabs/buyer">
                <p>2Unde provident nemo reiciendis officia, possimus repellendus. Facere dignissimos dicta quis rem.
                    Aliquam aspernatur dolor atque nisi id deserunt laudantium quam repellat.</p>
            </md-tab>




            <md-tab id="tab-ratings" md-label="Ratings" to="/components/tabs/ratings">
                <Rating/>
            </md-tab>
        </md-tabs>
    </div>
</template>


<script>
    import Eth from 'ethjs-query'
    import EthContract from 'ethjs-contract'
    import Rating from './Ratings'

    window.addEventListener('load', function () {

        async function isInstalled() {
            if (typeof web3 !== 'undefined') {
                console.log('MetaMask is installed');
                window.web3js = new Web3(web3.currentProvider);
            }
            else {
                console.log('MetaMask is not installed');
            }
        }

        async function getBalance() {
            //Balance
            web3js.eth.getAccounts((err, res) => {
                web3js.eth.getBalance(res[0], function (error, result) {
                    if (!error)
                        console.log(JSON.stringify(result));
                    else
                        console.error(error);
                })
            });
        }

        function isLocked() {
            web3js.eth.getAccounts(function (err, accounts) {
                if (err != null) {
                    console.log(err)
                }
                else if (accounts.length === 0) {
                    console.log('MetaMask is locked')
                }
                else {
                    console.log('MetaMask is unlocked')
                }
            });
        }

        isInstalled();
        getBalance();
        isLocked();
        if (web3js) {
            switch (web3js.version.network) {
                case '1':
                    console.log('This is mainnet');
                    break;
                case '2':
                    console.log('This is the deprecated Morden test network.');
                    break;
                case '3':
                    console.log('This is the ropsten test network.');
                    break;
                case '4':
                    console.log('This is the Rinkeby test network.');
                    break;
                case '42':
                    console.log('This is the Kovan test network.');
                    break;
                default:
                    console.log('This is an unknown network.');
            }
        }
        const getAccount = () => {
            // check if web3 present
            if (web3js) {
                // return default account
                return web3js.eth.accounts[0];
            }
            return undefined;
        };

        let account = getAccount();
        let accountInterval = setInterval(() => {
            if (getAccount() !== account) {
                account = getAccount();
                // update UI, state, pull data
                updateEverything();
            }
        }, 1000);
    });


    export default {
        name: 'Home',
        data: function () {
            return {
                show_input: false,
                new_contract: '',
                address: '',
                contract: '',
                storeABI: [
                    {
                        "constant": false,
                        "inputs": [
                            {
                                "name": "owner",
                                "type": "address"
                            }
                        ],
                        "name": "reg_New_store",
                        "outputs": [
                            {
                                "name": "",
                                "type": "address"
                            }
                        ],
                        "payable": false,
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
            {
                "constant": true,
                "inputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
                "name": "store_addresses",
                "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "getter_addresses",
                "outputs": [
                {
                    "name": "",
                    "type": "address[]"
                }
            ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                {
                    "indexed": false,
                    "name": "store_address",
                    "type": "address"
                }
            ],
                "name": "NewStore",
                "type": "event"
            }
        ]



            [
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "id",
                            "type": "uint64"
                        }
                    ],
                    "name": "getter_public_keys",
                    "outputs": [
                        {
                            "name": "",
                            "type": "bytes"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "",
                            "type": "uint64"
                        }
                    ],
                    "name": "data",
                    "outputs": [
                        {
                            "name": "",
                            "type": "bytes"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "positive_karma",
                    "outputs": [
                        {
                            "name": "",
                            "type": "uint64"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "",
                            "type": "uint64"
                        }
                    ],
                    "name": "offers",
                    "outputs": [
                        {
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "order_id",
                            "type": "uint64"
                        },
                        {
                            "name": "new_data",
                            "type": "bytes"
                        }
                    ],
                    "name": "send_id_data",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "value",
                            "type": "bool"
                        }
                    ],
                    "name": "vote",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "negative_karma",
                    "outputs": [
                        {
                            "name": "",
                            "type": "uint64"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "name": "opened_transactions",
                    "outputs": [
                        {
                            "name": "",
                            "type": "uint64"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "recipient",
                            "type": "address"
                        },
                        {
                            "name": "value",
                            "type": "uint256"
                        }
                    ],
                    "name": "charge_out",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "",
                            "type": "uint64"
                        }
                    ],
                    "name": "price",
                    "outputs": [
                        {
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "id",
                            "type": "uint64"
                        },
                        {
                            "name": "set_price",
                            "type": "uint256"
                        }
                    ],
                    "name": "create_id",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "order_id",
                            "type": "uint64"
                        },
                        {
                            "name": "pub_key",
                            "type": "bytes"
                        }
                    ],
                    "name": "pay_order",
                    "outputs": [],
                    "payable": true,
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "total_orders",
                    "outputs": [
                        {
                            "name": "",
                            "type": "uint64"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "name": "new_owner",
                            "type": "address"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "name": "id",
                            "type": "uint64"
                        },
                        {
                            "indexed": false,
                            "name": "sender",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "name": "public_key",
                            "type": "bytes"
                        }
                    ],
                    "name": "Payed_order",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "name": "data",
                            "type": "bytes"
                        }
                    ],
                    "name": "New_data",
                    "type": "event"
                }
            ],
                abi: [
                    {
                        "constant": false,
                        "inputs": [
                            {
                                "name": "owner",
                                "type": "address"
                            }
                        ],
                        "name": "reg_New_store",
                        "outputs": [
                            {
                                "name": "",
                                "type": "address"
                            }
                        ],
                        "payable": false,
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [
                            {
                                "name": "",
                                "type": "uint256"
                            }
                        ],
                        "name": "store_addresses",
                        "outputs": [
                            {
                                "name": "",
                                "type": "address"
                            }
                        ],
                        "payable": false,
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [],
                        "name": "getter_addresses",
                        "outputs": [
                            {
                                "name": "",
                                "type": "address[]"
                            }
                        ],
                        "payable": false,
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "anonymous": false,
                        "inputs": [
                            {
                                "indexed": false,
                                "name": "store_address",
                                "type": "address"
                            }
                        ],
                        "name": "NewStore",
                        "type": "event"
                    }
                ],
            }
        },
        // 0xdf932f86fad0451ec89b2dca0336a1b46a64a72f
        computed: {
            store_address() {
                return this.new_contract;
            }
        },
        components: {
          Rating
        },
        methods: {
            async createStore() {
                let tokenContractAddress = "0x5db6c48179504076514902fd94b26b3b6767d482";
                this.contract = await web3js.eth.contract(this.abi).at(tokenContractAddress);
                let account;
                let self = this;
                web3js.eth.getAccounts((err, res) => {
                    account = res[0];
                    self.contract.reg_New_store(account, (error, result) => {
                        console.log(`%c txHash = ${result}`, 'color: orange; font-weight: bold');
                    });
                    self.contract.NewStore((error, event) => {
                        this.$toast.success({
                            title: 'Created',
                            message: 'Your store created!'
                        });
                        this.new_contract = event.args['store_address'];
                        this.show_input = true;
                    })
                })
            },
            async parseRatings(address) {
                let contract = await web3js.eth.contract(this.storeABI).at(address);
                let self = this;
                let account;


                contract.positive_karma((error, result) => {
                    console.log(result.toNumber())
                });
                contract.negative_karma((error, result) => {
                    console.log(result.toNumber())
                });
                contract.total_orders((error, result) => {
                    console.log(result.toNumber())
                })
            },

            async rating() {
                let tokenContractAddress = "0x5db6c48179504076514902fd94b26b3b6767d482";
                this.contract = await web3js.eth.contract(this.abi).at(tokenContractAddress);
                let account;
                let self = this;
                web3js.eth.getAccounts((err, res) => {
                    account = res[0];
                    self.contract.getter_addresses((error, result) => {
                        Object.keys(result).map(function (item) {
                            self.parseRatings(result[item]);
                        });
                        console.log(`%c address = ${result}`, 'color: orange; font-weight: bold');
                    });
                })
            },

            async encr(data, contract_addr) {
                const publicKey = 0; //Get from Contract
                const NodeRSA = require('node-rsa');
                const key = new NodeRSA();

                key.importKey(publicKey, 'pkcs8-public-der');
                const encrypted = key.encrypt(data, 'base64'); // Send it to the store contract
                console.log(encrypted);

                // this.contract = await web3js.eth.contract(this.storeABI).at(contract_addr);
                // let accaunt;
                // let self = this;
                // web3js.eth.getAccounts((err, res) => {
                //     account = res[0];
                //     // self.contract.send_id_data((error, result) => {
                //     //     Object.keys(result).map(function (item) {
                //     //         self.parseRatings(result[item]);
                //     //     });
                //     //     console.log(`%c address = ${result}`, 'color: orange; font-weight: bold');
                //     });
                // })

            },

            ///Function for user

            async add_data(testBuffer, ipfs) {
                ipfs.files.add(testBuffer, function (err, file) {
                    if (err) {
                        console.log(err);
                    }
                    console.log(file)
                })
            },

            async get_data(validCID, ipfs) {
                ipfs.files.get(validCID, function (err, files) {
                    files.forEach((file) => {
                        console.log(file.path)
                        console.log(file.content.toString('utf8'))
                    })
                })
            },

            async feedbeck() {
                const ipfsAPI = require('ipfs-api');
                const fs = require('fs');

                const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

                //Reading file from computer
                let testFile = fs.readFileSync("/test.txt", "utf8");
                //Creating buffer for ipfs function to add file to the system
                let testBuffer = new Buffer(testFile);

                this.add_data(testBuffer, ipfs);
            },

            async decr(privateKey) {
                const NodeRSA = require('node-rsa');
                const key = new NodeRSA();
                const encrypted = 0; //Get from contract

                key.importKey(privateKey, 'pkcs1');
                const decrypted = key.decrypt(encrypted, 'utf8'); //Show a data in the screen
                console.log('decrypted: ', decrypted);
            },

            async create_keys() {
                const NodeRSA = require('node-rsa');
                const key = new NodeRSA({b: 512});


                const publicKey = key.exportKey('pkcs8-public-der'); //Send it to the store function

                console.log(publicKey);
                const privateKey = key.exportKey('pkcs1'); //Show it to the screen
                console.log("Private Key", privateKey);

            },



            //End users function


            async check_orders() {
                console.log(this.address);
                if (this.address.length !== 42) {
                    this.$toast.error({
                        title: 'Address',
                        message: 'Not valid address!'
                    });
                }
                else {
                    // let tokenContractAddress = "0x5db6c48179504076514902fd94b26b3b6767d482";
                    this.contract = await web3js.eth.contract(this.storeABI).at(this.address);
                    // let account;
                    // let self = this;
                    // web3js.eth.getAccounts((err, res) => {
                    //     account = res[0];
                    //     self.contract.create_id(0, 1, (error, result) => {
                    //         console.log(`%c Something happend = ${result}`, 'color: orange; font-weight: bold');
                    //     });
                    // })
                }
            }
        }
    }
</script>

<style>
    .md-tabs {
        margin-bottom: 24px;
    }

    #create {
     margin-top: 50px;
    }

    #create, #orders {
        background-color: #448aff;
        color: white;
    }

    #tab-seller {
        display: flex !important;
        flex-direction: column;
        justify-content: center !important;
        align-items: center;
    }
    hr {
        width: 80%;
        margin-top: 50px;
    }
</style>
