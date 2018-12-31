<template>
    <div>

        <div class="embed-container">
            <iframe
                :src="url"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                frameborder='0'
            ></iframe>
        </div>

        <v-container>
            <v-layout
                row
            >

                <v-layout>
                    <v-text-field
                        v-model="address"
                        label="Video URL"
                        :append-icon="'play_circle_outline'"
                        single-line
                        solo
                        @click:append="update"
                    ></v-text-field>

                    <v-btn
                        @click="update"
                        color="#2196f3"
                        flat
                    >
                        PLAY
                    </v-btn>

                </v-layout>

            </v-layout>

            <v-layout>
                <v-flex>
                </v-flex>
            </v-layout>
        </v-container>

    </div>
</template>

<script>
    export default {
        name: 'youtube',

        data() {
            return {
                autoplay : 1,

                address: 'https://www.youtube.com/watch?v=ZkgFVv4XsYE',
                id: 'tZkupqfXUXk',
                id2: 'QruZ3GsqAZE',
                id3: 'ddTsmUM__sc',
            }
        },

        methods: {
            update() {
                this.id = this.getID(this.address);
            },

            getID(link) {
                const regex = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
                let id = link.match(regex);
                if(id) {
                    return id[1];
                } else {
                    return false;
                }
            },
        },

        computed: {
            url() {
                return `https://www.youtube-nocookie.com/embed/${ this.id }?autoplay=${ this.autoplay }&enablejsapi=1`;
            }
        },
    }
</script>

<style lang='css'>
    .embed-container {
        position: relative;
        padding-bottom: 56.25%;
        height: 0;
        overflow: hidden;
        max-width: 100%;
    }

    .embed-container iframe,
    .embed-container object,
    .embed-container embed {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>
