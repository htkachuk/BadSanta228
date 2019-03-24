<template>
    <div>
        <table class="table-fill">
            <thead>
            <tr>
                <th class="text-left">Address</th>
                <th class="text-left">Positive karma</th>
                <th class="text-left">Negative karma</th>
                <th class="text-left">Total orders</th>
            </tr>
            </thead>
            <tbody class="table-hover">
            <tr v-for="seller in sellers">
                <td class="text-left">{{ seller.address }}</td>
                <td class="text-left">{{ seller.positive }}</td>
                <td class="text-left">{{ seller.negative }}</td>
                <td class="text-left">{{ seller.orders }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        rating: 'TableSort',
        data: () => ({
            storeABI: [
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
            sellers: []
        }),
        created() {
            this.isInstalled();
            this.rating();
            setTimeout(() => this.$forceUpdate(), 500)
        },
        computed: {
            sellersComputed() {
                return this.sellers;
            }
        },
        methods: {
            async isInstalled() {
                if (typeof web3 !== 'undefined') {
                    console.log('MetaMask is installed');
                    window.web3js = new Web3(web3.currentProvider);
                }
                else {
                    console.log('MetaMask is not installed');
                }
            },

            parseRatings(address) {
                let mapping = {};

                mapping.address = address;
                let contract = web3js.eth.contract(this.storeABI).at(address);
                contract.positive_karma((error, result) => {
                    mapping.positive = result.toNumber();
                });
                contract.negative_karma((error, result) => {
                    mapping.negative = result.toNumber();
                });
                contract.total_orders((error, result) => {
                    mapping.orders = result.toNumber();
                });
                return mapping;
            },

            async rating() {
                let tokenContractAddress = "0x5db6c48179504076514902fd94b26b3b6767d482";
                this.contract = await web3js.eth.contract(this.abi).at(tokenContractAddress);
                let account;
                let self = this;
                web3js.eth.getAccounts((err, res) => {
                    account = res[0];
                    self.contract.getter_addresses((error, result) => {
                        Object.keys(result).map((item) => {
                            let res = this.parseRatings(result[item]);
                            this.sellers.push(res);
                        });
                    });
                })
            },
        }
    }
</script>
<style>
    @import url(https://fonts.googleapis.com/css?family=Roboto:400,500,700,300,100);

    div.table-title {
        display: block;
        margin: auto;
        max-width: 600px;
        padding: 5px;
        width: 100%;
    }

    .table-title h3 {
        color: #fafafa;
        font-size: 30px;
        font-weight: 400;
        font-style: normal;
        font-family: "Roboto", helvetica, arial, sans-serif;
        text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
        text-transform: uppercase;
    }

    /*** Table Styles **/
    .table-fill {
        background: white;
        border-radius: 3px;
        border-collapse: collapse;
        height: 320px;
        margin: auto;
        max-width: 600px;
        padding: 5px;
        width: 100%;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
        animation: float 5s infinite;
    }

    th {
        color: #D5DDE5;
        background: #1b1e24;
        border-bottom: 4px solid #9ea7af;
        border-right: 1px solid #343a45;
        font-size: 23px;
        font-weight: 100;
        padding: 24px;
        text-align: left;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
        vertical-align: middle;
    }

    th:first-child {
        border-top-left-radius: 3px;
    }

    th:last-child {
        border-top-right-radius: 3px;
        border-right: none;
    }

    tr {
        border-top: 1px solid #C1C3D1;
        border-bottom-: 1px solid #C1C3D1;
        color: #666B85;
        font-size: 16px;
        font-weight: normal;
        text-shadow: 0 1px 1px rgba(255, 255, 255, 0.1);
    }

    tr:hover td {
        background: #4E5066;
        color: #FFFFFF;
        border-top: 1px solid #22262e;
    }

    tr:first-child {
        border-top: none;
    }

    tr:last-child {
        border-bottom: none;
    }

    tr:nth-child(odd) td {
        background: #EBEBEB;
    }

    tr:nth-child(odd):hover td {
        background: #4E5066;
    }

    tr:last-child td:first-child {
        border-bottom-left-radius: 3px;
    }

    tr:last-child td:last-child {
        border-bottom-right-radius: 3px;
    }

    td {
        background: #FFFFFF;
        padding: 20px;
        text-align: left;
        vertical-align: middle;
        font-weight: 300;
        font-size: 18px;
        text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
        border-right: 1px solid #C1C3D1;
    }

    td:last-child {
        border-right: 0px;
    }

    th.text-left {
        text-align: left;
    }

    th.text-center {
        text-align: center;
    }

    th.text-right {
        text-align: right;
    }

    td.text-left {
        text-align: left;
    }

    td.text-center {
        text-align: center;
    }

    td.text-right {
        text-align: right;
    }
</style>