<template>
    <v-layout

        grid-list-xl
        justify-center
    >

        <v-flex
            class="py-3"
            xs12
            sm10
            md8
        >

            <h3 class="title">Stream Me Data Scraper</h3>

            <v-card
                class="my-3"
            >

                <v-card-actions>
                        <v-text-field
                            v-model="user"
                            label="Username"
                            spellcheck="false"
                            v-on:keyup.enter="getUser"
                        ></v-text-field>

                        <v-btn
                            class="mx-2"
                            color="#2196f3"
                            dark
                            @click="getStreamData"
                        >
                            Load User
                        </v-btn>
                </v-card-actions>

            </v-card>

            <v-card
                class="my-3"
            >

                <v-card-title>
                    <h3>Stream Metadata</h3>
                </v-card-title>

                <v-card-text>
                    <div v-if="!!link">Title: {{ this.userdata['_embedded']['streams'][0].title }}</div>


                    <a v-if="!!link"
                       :href="link"
                    >
                        {{ link }}
                    </a>
                    <div v-else>
                        <v-icon small>warning</v-icon>
                        {{ errorMessage }}
                    </div>

                    <hr class="my-2" />

                    <div>Username: {{ this.userdata['username'] }}</div>

                    <div>User ID: {{ this.userdata['userPublicId'] }}</div>

                    <div v-if="userdata['userPublicId']">Chatroom ID: {{ this.userdata['_embedded']['streams'][0].chatroomId }}</div>

                    <v-layout
                        class="mt-2"
                        v-if="userdata['stats']"
                    >
                        <v-flex v-for="(stat, key) of this.userdata['stats']['raw']" :key="stat">
                            <v-chip>{{ key }}: {{ stat }}</v-chip>
                        </v-flex>
                    </v-layout>
                </v-card-text>

            </v-card>

            <v-card
                class="my-3"
            >

                <v-card-title>
                    <h3>RAW Output</h3>
                </v-card-title>

                <v-card-text>

                    <div style="min-height: 4rem;">
                        <pre
                            style="white-space: pre-wrap"
                        >{{ streamdata }}</pre>
                    </div>

                </v-card-text>

            </v-card>

        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        name: 'vlc',

        data() {
            return {
                streamdata: {},
                userdata: {},
                user: '',
                link: null,
                errorMessage: null,
            };
        },

        methods: {
            async getUser() {
                await this.getStreamData();
            },

            async getUserData() {
                let url = `https://cors.io/?https://www.stream.me/api-user/v2/${
                    this.user
                    }/app/web/channel`;
                try {
                    const data = await this.$axios.$get(url);
                    this.userdata = data;
                    return data;
                } catch (e) {
                    console.log(e);
                    this.errorMessage = `${ e['response']['status'] } Error`;
                    // this.streamdata = e['response']['data'];
                    this.streamdata = e;
                    console.error(e);
                    return null;
                }
            },

            async getStreamData() {
                this.link = null;
                this.errorMessage = 'Loading...';

                const data = await this.getUserData();

                if (data) {
                    this.streamdata = JSON.stringify(data, null, ' ');

                    const links = data._embedded.streams[0]._links;

                    if (links.hasOwnProperty('hlsmp4')) {
                        this.link = links['hlsmp4'].href;
                    } else {
                        this.link = null;
                        if (data['userPublicId']) {
                            this.errorMessage = 'Stream not found';
                        } else {
                            this.errorMessage = 'User not found';
                        }
                    }
                }
            },
        },

        computed: {},

        mounted() {
            this.getStreamData();
        },
    }
</script>

<style lang='css'>

</style>
