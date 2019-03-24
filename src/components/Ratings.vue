<template>
    <div>
        <md-table v-model="sellers" md-sort="rating" md-sort-order="asc" md-card>
            <md-table-toolbar>
                <h1 class="md-title">Ratings</h1>
            </md-table-toolbar>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell style="float: left" md-label="Address" md-numeric>{{ item.address }}</md-table-cell>
                <md-table-cell md-label="Positive karma" md-sort-by="rating">{{ item.rating }}</md-table-cell>
                <md-table-cell md-label="Negative karma" md-sort-by="negative">{{ item.negative }}</md-table-cell>
                <md-table-cell md-label="Total orders" md-sort-by="orders">{{ item.orders }}</md-table-cell>
            </md-table-row>
        </md-table>
    </div>
</template>

<script>
    export default {
        rating: 'TableSort',
        data: () => ({
            sellers: [
                {
                    address: 1,
                    rating: 'Shawna Dubbin',
                    positive: 0,
                    negative: 0,
                    orders: 0
                },
                {
                    address: 2,
                    rating: 'Odette Demageard',
                    positive: 0,
                    negative: 0,
                    orders: 0
                },
                {
                    address: 3,
                    rating: 'Lonnie Izkovitz',
                    positive: 0,
                    negative: 0,
                    orders: 0
                },
                {
                    address: 4,
                    rating: 'Thatcher Stave',
                    positive: 0,
                    negative: 0,
                    orders: 0
                },
                {
                    address: 5,
                    rating: 'Clarinda Marieton',
                    positive: 0,
                    negative: 0,
                    orders: 0
                }
            ]
        })
    }
</script>

<style>
</style>