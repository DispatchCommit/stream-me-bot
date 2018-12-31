<template>
    <div>
        <v-navigation-drawer
            v-model="show"
            :clipped="true"
            :app="true"
            fixed
        >
            <v-list>
                <v-list-tile
                    v-for="(item, i) in items"
                    :to="item.to"
                    :key="i"
                    router
                    exact
                >
                    <v-list-tile-action>
                        <v-icon v-html="item.icon" />
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title v-text="item.title" />
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
    export default {
        name: 'NavMenu',

        props: {
            value: {
                type: Boolean,
                default: false,
            },
            items: {
                type: Array,
                default: () => [],
            },
        },

        data() {
            return {}
        },

        methods: {
            emitUpdate(val) {
                this.$emit( 'input', val );
            },
        },

        computed: {
            show: {
                get() { return this.value },
                set(val) { this.emitUpdate(val) },
            },
        },
    }
</script>
