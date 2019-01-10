<template>
        <v-layout
            fill-height
        >
            <v-flex
                xs12
                fill-height
                justify-center
                align-center
            >
                <v-card
                    class="website"
                    :style="embedStyle"
                >
                    <iframe
                        frameborder="0"
                        src="http://togethertube.com/rooms/dispatch"
                    ></iframe>
                </v-card>
            </v-flex>
        </v-layout>
</template>

<script>
    export default {
        name: 'togethertube',

        data() {
            return {
                embedWidth: '100%',
                embedHeight: '85%',
            }
        },

        computed: {
            embedStyle() {
                const width = `width: ${this.embedWidth};`;
                const height = `height: ${this.embedHeight};`;
                return `${width} ${height}`;
            },
        },

        methods: {},
    }
</script>
