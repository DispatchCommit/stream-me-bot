<template>
    <v-card
        class="my-3"
    >

        <v-card-actions>
            <v-layout
                column
            >
                <v-card-title>
                    <h3>Chat History</h3>
                </v-card-title>


                <v-data-table
                    :headers="headers"
                    :items="messages"
                    class="elevation-1"
                >
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.name }}</td>
                        <td class="text-xs-right">{{ props.item.data }}</td>
                        <td class="text-xs-right">{{ props.item.timestamp }}</td>
                    </template>
                </v-data-table>

                <v-layout>
                    <v-spacer/>

                    <v-btn
                        color="#2196f3"
                        dark
                        @click="speak"
                    >
                        Read Message
                    </v-btn>
                </v-layout>

            </v-layout>
        </v-card-actions>

    </v-card>
</template>

<script>
    export default {
        name: 'Chat',

        data() {
            return {

                headers: [
                    {
                        text: 'Username',
                        value: 'name',
                        align: 'left',
                        sortable: true,
                    },
                    {
                        text: 'Message',
                        value: 'data',
                        align: 'right',
                        sortable: false,
                    },
                    {
                        text: 'Time',
                        value: 'timestamp',
                        align: 'right',
                        sortable: false,
                    },
                ],

                messages: [
                    {
                        name: 'Dispatch',
                        data: 'test',
                        timestamp: Date.now(),
                    },
                    {
                        name: 'NPC',
                        data: 'Simple message',
                        timestamp: Date.now() - 1,
                    },
                    {
                        name: 'User',
                        data: 'blah',
                        timestamp: Date.now() - 2,
                    },
                ],

            }
        },

        methods: {},

        computed: {},
    }
</script>
