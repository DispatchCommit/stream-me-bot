<template>

        <v-navigation-drawer
            v-model="showChat"
            width="325"
            fixed
            right
            clipped
            app
        >
            <v-layout
                fill-height
                column
                style="overflow-y: hidden"
            >

                <div>
                    <v-layout
                        align-center
                        justify-space-between
                        row
                    >
                        <v-btn
                            icon
                            @click="fixed = !fixed"
                        >
                            <v-icon>accessible_forward</v-icon>
                        </v-btn>

                        <h3>SnipeStream Chat {{ target.username }}</h3>

                        <v-btn
                            icon
                            @click="emitUpdate(!value)"
                        >
                            <v-icon>clear</v-icon>
                        </v-btn>
                    </v-layout>
                </div>


                <v-layout class="strm-chat">
                    <v-flex>
                        <div class="test">
                            <iframe
                                :src="topChatURL"
                                frameborder="0"
                            ></iframe>
                        </div>
                    </v-flex>
                </v-layout>


                <div>
                    <v-layout
                        align-center
                        justify-space-between
                        row
                    >

                        <v-btn
                            icon
                            @click="setLocalChat('dispatch')"
                        >
                            <v-icon>beenhere</v-icon>
                        </v-btn>

                        <h3>Local Chat</h3>

                        <v-btn
                            @click="setLocalChat('kovalski')"
                            icon
                        >
                            <v-icon>settings</v-icon>
                        </v-btn>

                    </v-layout>
                </div>


                <v-layout class="strm-chat">
                    <v-flex>
                        <div class="test">
                            <iframe
                                :src="`https://www.stream.me/stream-embed/user:${ chat2 }:web/chat-widget/`"
                                frameborder="0"
                            ></iframe>
                        </div>
                    </v-flex>
                </v-layout>

            </v-layout>

        </v-navigation-drawer>

</template>

<script>
    import { mapState } from 'vuex';

    const CHAT_DANISH   = '9a86d241-a30f-4c5e-bdc8-fcdd1a2517ee';
    const CHAT_DISPATCH = '7d6ae401-a406-4b66-9c6d-b026bfbfbe74';
    const CHAT_KOVALSKI = '24b6b00e-1b7c-471b-86df-1c8a30b97b49';
    const CHAT_KITTY    = '406f9188-3066-11e5-9aee-42010af0b4cf';

    export default {
        name: 'ChatSkeleton',

        props: {
            value: {
                type: Boolean,
                default: true,
            },
        },

        data() {
            return {
                right : true,
                fixed : false,
                chat1 : CHAT_KITTY,
                // chat1 : CHAT_DANISH,
                chat2 : CHAT_DISPATCH,

                ids: {
                    danish   : CHAT_DANISH,
                    dispatch : CHAT_DISPATCH,
                    kovalski : CHAT_KOVALSKI,
                }
            }
        },

        methods: {
            emitUpdate(val) {
                this.$emit( 'input', val );
            },

            async getUserData(username) {
                const url = `/api-user/v2/${username}/app/web/channel`;
                try {
                    return await this.$axios.$get(url);
                } catch (e) {
                    console.error(e);
                    return null;
                }
            },

            async getUserID(user) {
                const data = await this.getUserData(user);
                return data['userPublicId'];
            },

            async setLocalChat(user) {
                this.chat2 = await this.getUserID(user);
            },

        },

        computed: {
            ...mapState('Chat', {
                target: 'TARGET',
            }),

            showChat: {
                get() { return this.value },
                set(val) { this.emitUpdate(val) },
            },

            topChatURL() {
                if (this.target.userId) {
                    return `https://www.stream.me/stream-embed/user:${this.target.userId}:web/chat-widget/`;
                } else {
                    return null;
                }
            },
        },
    }
</script>

<style lang='css'>
    .strm-chat {
        background: #000;
        box-sizing: border-box;
    }

    .strm-chat iframe {
        height: 100%;
    }

    .strm-chat .test {
        height: 100%;
    }
</style>
