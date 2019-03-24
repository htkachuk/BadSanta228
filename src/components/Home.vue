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
                <md-field style="width: 50%">
                    <label style="font-size: 12px">Id</label>
                    <md-input v-model="idOrder"></md-input>
                </md-field>
                <md-field style="width: 50%">
                    <label style="font-size: 12px">Price</label>
                    <md-input v-model="price"></md-input>
                </md-field>
                <md-button id="orders" class="md-primary" @click="add_orders">Add new goods</md-button>
                <hr>
                <md-field style="width: 50%; margin-top: 10%">
                    <label style="font-size: 12px">Enter contract address</label>
                    <md-input v-model="checkOrders"></md-input>
                </md-field>
                <md-button id="checkOrders" class="md-primary" @click="check_orders">Check orders</md-button>

                <md-field v-if="haveItems_1" style="width: 50%; margin-top: 10%">
                    <label style="font-size: 12px">Enter data</label>
                    <md-input v-model="haveItems"></md-input>
                </md-field>
                <md-button id="haveItems" v-if="haveItems_1" class="md-primary" @click="encr">Encrypt data</md-button>
            </md-tab>


            <md-tab id="tab-buyer" md-label="Buyer" to="/components/tabs/buyer">
                <md-field v-if="privateKey" style="width: 50%">
                    <label style="font-size: 12px">Private key</label>
                    <md-input v-model="privateKey" disabled></md-input>
                    <span class="md-helper-text">Save this key for next steps!</span>
                </md-field>
                <md-button id="keyPair" class="md-primary" @click="create_keys">Create keys</md-button>
                <hr>
                <md-field style="width: 50%">
                    <label style="font-size: 12px">Enter seller`s address</label>
                    <md-input v-model="sellerAddress"></md-input>
                </md-field>
                <md-field style="width: 50%">
                    <label style="font-size: 12px">Order ID</label>
                    <md-input v-model="sellerId"></md-input>
                </md-field>
                <md-field style="width: 50%">
                    <label style="font-size: 12px">Amount</label>
                    <md-input v-model="amount"></md-input>
                </md-field>
                <md-button id="buy" class="md-primary" @click="buy">Buy</md-button>
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
    import ipfsAPI from 'ipfs-api'
    import Rating from './Ratings'
    import NodeRSA from 'node-rsa'

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
                currentContractAddress: '',
                encrResult: '',
                haveItems: '',
                haveItems_1: false,
                checkOrders: '',
                amount: 0,
                sellerId: '',
                sellerAddress: '',
                publicKey: '',
                privateKey: false,
                show_input: false,
                new_contract: '',
                address: '',
                contract: '',
                idOrder: '',
                price: '',
                storeABI:
                    [
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
                            "name": "getter_offers",
                            "outputs": [
                                {
                                    "name": "",
                                    "type": "uint64[]"
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
        //0xb156e7584116e2bb5bc52e31eb650a0dee563023, 0, 123

        computed: {
            store_address() {
                return this.new_contract;
            }
        },
        components: {
            Rating
        },
        methods: {
            async check_orders () {
                this.contract = await web3js.eth.contract(this.storeABI).at(this.checkOrders);
                let account;
                web3js.eth.getAccounts((err, res) => {
                    account = res[0];
                    this.contract.getter_offers((error, result) => {
                        Object.keys(result).map((item) => {
                            this.contract.offers(result[item].toNumber(), (error, res) => {
                                if (Number(res) > Number(0x0000000000000000000000000000000000000001)) {
                                    this.encrResult = result[item].toNumber();
                                    this.currentContractAddress = this.checkOrders;
                                    this.haveItems_1 = true;
                                }

                            })
                        });
                    });
                })
            },

            async buy() {
                let arr = [];
                Object.keys(this.publicKey).map((item) => {
                    arr.push('0x' + (this.publicKey[item]).toString(16))
                });
                this.contract = await web3js.eth.contract(this.storeABI).at(this.sellerAddress);
                let account;
                web3js.eth.getAccounts((err, res) => {
                    account = res[0];
                    this.contract.pay_order(this.sellerId, arr, {value: this.amount}, (err, res) => {console.log(res)})
                })
            },

            async createStore() {
                let tokenContractAddress = "0xbbd7818b85f2b436b63e229d642714b2619f83a5";
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

            encr() {
                // this.encrResult
                console.log(this.encrResult)
                this.contract = web3js.eth.contract(this.storeABI).at(this.currentContractAddress);
                let account;

                web3js.eth.getAccounts((err, res) => {
                    account = res[0];
                    this.contract.getter_public_keys(this.encrResult, (error, result) => {
                        console.log("contract ",result);
                        const publicKey = result; //Get from Contract
                        const key = new NodeRSA();

                        key.importKey(publicKey, 'pkcs8-public-der');
                        const encrypted = key.encrypt(this.haveItems, 'base64'); // Send it to the store contract
                        console.log("encrypt data ",encrypted);
                    });
                });


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
                        console.log(file.path);
                        console.log(file.content.toString('utf8'))
                    })
                })
            },

            async feedback() {
                const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

                //Reading file from computer
                //Creating buffer for ipfs function to add file to the system
                let testBuffer = new Buffer(testFile);

                this.add_data(testBuffer, ipfs);
            },

            async decr(privateKey) {
                const key = new NodeRSA();
                const encrypted = 0; //Get from contract

                key.importKey(privateKey, 'pkcs1');
                const decrypted = key.decrypt(encrypted, 'utf8'); //Show a data in the screen
                console.log('decrypted: ', decrypted);
            },

            create_keys() {
                const key = new NodeRSA({b: 512});


                const publicKey = key.exportKey('pkcs8-public-der'); //Send it to the store function

                console.log(publicKey);
                this.publicKey = publicKey;
                const privateKey = key.exportKey('pkcs1'); //Show it to the screen
                console.log("Private Key", privateKey);
                this.privateKey = privateKey;
            },


            //End users function


            async add_orders() {
                console.log(this.address);
                if (this.address.length !== 42) {
                    this.$toast.error({
                        title: 'Address',
                        message: 'Not valid address!'
                    });
                }
                else {
                    this.contract = await web3js.eth.contract(this.storeABI).at(this.address);
                    let account;
                    web3js.eth.getAccounts((err, res) => {
                        account = res[0];
                        this.contract.create_id(this.idOrder, this.price, (error, result) => {
                            if (error) {
                                console.log(error);
                                this.$toast.error({
                                    title: 'Owner',
                                    message: error
                                });
                            }
                        });
                    })
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

    #create, #orders, #keyPair, #buy, #checkOrders {
        background-color: #448aff;
        color: white;
    }

    #tab-seller, #tab-buyer, #buy, #haveItems {
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
