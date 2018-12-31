<template>
    <div>
        <v-layout
            column
            justify-center
            align-center>
            <v-flex
                xs12
                sm8
                md6>
                <v-card
                    class="my-3"
                >
                    <v-card-actions>
                        <v-layout>

                            <v-flex
                                xs12
                            >
                                <div>

                                    <h3 class="title">KillStream</h3>
                                    <h5 class="subtitle">Automatically gets the VLC link</h5>

                                    <v-text-field
                                        v-model="user"
                                        label="Solo"
                                        placeholder="Username"
                                    ></v-text-field>

                                    <div
                                        class="links"
                                        style="margin-bottom: 2rem;"
                                    >

                                        <v-btn
                                            class="button--green"
                                            @click="streamData"
                                            flat
                                        >
                                            Load User
                                        </v-btn>

                                        <v-btn
                                            primaary
                                            flat
                                        >
                                            VLC Link
                                        </v-btn>

                                        <!--<a :href="link" target="_blank" class="button&#45;&#45;green"></a>-->
                                        <!--<nuxt-link to="/about" class="button&#45;&#45;grey">Open</nuxt-link>-->

                                    </div>

                                    <a v-if="!!streamme"
                                       :href="link"
                                    >
                                        {{ link }}
                                    </a>

                                    <hr />

                                    <div style="min-height: 4rem;">
                                        <pre>{{ streamme }}</pre>
                                    </div>

                                </div>
                            </v-flex>
                        </v-layout>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
    export default {
        name: 'vlc',

        data() {
            return {
                streamme: {},
                user: 'dispatch',
                link: ''
            };
        },

        methods: {
            async streamData() {
                let url = `https://cors.io/?https://www.stream.me/api-user/v2/${
                    this.user
                    }/app/web/channel/updates`;
                try {
                    let data = await this.$axios.$get(url);
                    console.log(data);
                    this.link = data._embedded.streams[0]._links.hlsmp4.href;
                    let obj = data._embedded.streams[0]._links;
                    this.streamme = JSON.stringify(obj, null, ' ');
                    console.log(this.streamme);
                } catch (e) {
                    console.log(e);
                    this.streamme = e;
                }
            }
        },

        computed: {},

        mounted() {
            this.streamData();
        },
    }
</script>

<style lang='css'>

</style>
