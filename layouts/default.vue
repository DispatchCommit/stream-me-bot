<template>
    <v-app
        :dark="dark"
    >

        <Chat
            v-model="right"
        />

        <NavMenu
            v-model="left"
            :items="items"
        />

        <v-toolbar
            :dark="!dark"
            :clipped-left="true"
            :clipped-right="true"
            color="#2196f3"
            dense
            fixed
            app
        >
            <v-toolbar-side-icon
                @click="left = !left"
            />

            <v-chip
                label
                color="red"
                text-color="white"
            >
                <v-icon left>hd</v-icon>
                LIVE
            </v-chip>

            <v-toolbar-title v-text="TITLE"/>

            <v-spacer />

            <User />

            <v-divider vertical />

            <v-btn
                icon
                @click="right = !right"
            >
                <v-icon>comment</v-icon>
            </v-btn>

        </v-toolbar>

        <v-content>
            <nuxt />
        </v-content>

    </v-app>
</template>

<script>
    import { mapState } from 'vuex'

    import NavMenu from '@/components/NavMenu'
    import Chat from '@/components/Chat'
    import User from '~/components/Toolbar/User';

    export default {

        components: {
            User,
            NavMenu,
            Chat,
        },

        data() {
            return {
                dark: false,
                left: false,
                right: true,
                items: [
                    { icon: 'apps', title: 'Welcome', to: '/' },
                    { icon: 'bubble_chart', title: 'Inspire', to: '/inspire' },
                    { icon: 'link', title: 'VLC Link', to: '/vlc' },
                    { icon: 'desktop_windows', title: 'Stream Snipe', to: '/snipe' },
                    { icon: 'movie', title: 'YouTube', to: '/youtube' },
                    { icon: 'subscriptions', title: 'TogetherTube', to: '/togethertube' },
                    { icon: 'verified_user', title: 'My Profile', to: '/profile' },
                    { icon: 'volume_up', title: 'Text To Speech', to: '/tts' },
                ],
                title: 'Dispatch: Archival Adventure',
            }
        },

        computed: {
            ...mapState({
                TITLE : 'TITLE',
            }),
        },

        methods: {

        },

        created() {

        },

        mounted() {
            // db.collection("users").get().then((querySnapshot) => {
            //     this.users = querySnapshot.docs.map(doc =>
            //         Object.assign({ id: doc.id }, doc.data())
            //     )
            // });
        },
    }
</script>

<style lang='css'>
    iframe {
        min-height: 300px;
        height: 100%;
        width: 100%;
    }
</style>
