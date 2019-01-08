<template>
  <div>
      <v-layout
          column
          justify-center
      >
          <v-flex>

              <v-layout
                  justify-center
                  style="background: #000;"
              >
                  <v-responsive
                      class="desktop"
                      :aspect-ratio="16/9"
                  >
                      <iframe
                          v-if="embedURL"
                          :src='embedURL'
                          frameborder="0"
                      ></iframe>
                  </v-responsive>
              </v-layout>

              <!--<hr
                  class="mb-2"
                  :color="`${ currentUser ? ( users[currentUser].live ? '#4CAF50' : 'error' ) : '#ff9800' }`"
              >-->

              <v-progress-linear
                  :color="`${ currentUser ? ( users[currentUser].live ? '#4CAF50' : 'error' ) : '#607D8B' }`"
                  height="3"
                  :value="progress"
                  class="mt-0 mb-2"
              ></v-progress-linear>

              <v-layout
                  row
                  wrap
              >

                  <v-flex
                      v-for="(user, index) in users"
                      :key="user.username"
                      text-xs-center
                  >

                      <v-btn
                          :color="statusColor(user.live)"
                          :disabled="user.live === null"
                          @click="selectUser(index)"
                          small
                          dark
                      >
                          {{ `${user.label}${user.viewers ? ` (${user.viewers})` : ''}` }}
                      </v-btn>

                  </v-flex>

              </v-layout>

          </v-flex>
      </v-layout>
  </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        name: 'Snipe',

        data() {
            return {
                users: [
                    /*{
                        label: 'Kitty',
                        username: 'kittystyle',
                        live: undefined,
                        viewers: 0,
                    },*/
                    {
                        label: 'KOVALSKI',
                        username: 'kovalski',
                        live: undefined,
                        viewers: 0,
                    },
                    {
                        label: 'Ralph',
                        username: 'theralphretort',
                        live: undefined,
                        viewers: 0,
                    },
                    {
                        label: 'Zidan',
                        username: 'zidan',
                        live: undefined,
                        viewers: 0,
                    },
                    {
                        label: 'Gator',
                        username: 'gator',
                        live: undefined,
                        viewers: 0,
                    },
                    {
                        label: 'Josh',
                        username: 'kiwifarms',
                        live: undefined,
                        viewers: 0,
                    },
                    {
                        label: 'Jim',
                        username: 'mistermetokur',
                        live: undefined,
                        viewers: 0,
                    },
                    {
                        label: 'Rand',
                        username: 'randbot2020',
                        live: undefined,
                        viewers: 0,
                    },
                    {
                        label: 'DarkV',
                        username: 'darkvulgar',
                        live: undefined,
                        viewers: 0,
                    },
                    {
                        label: 'COG',
                        username: 'TheCognificent',
                        live: undefined,
                        viewers: 0,
                    },
                    {
                        label: 'SPCC',
                        username: 'spcc',
                        live: undefined,
                        viewers: 0,
                    },
                    {
                        label: 'Alex',
                        username: 'danishpolice',
                        live: undefined,
                        viewers: 0,
                    },
                    {
                        label: 'DISPATCH',
                        username: 'dispatch',
                        live: undefined,
                        viewers: 0,
                    },
                    {
                        label: 'NPC',
                        username: 'NPCAnon88',
                        live: undefined,
                        viewers: 0,
                    },
                ],
                chat: false,
                currentUser: null,
                progress: 0,
            }
        },

        computed: {
            embedURL() {
                const user = this.users[this.currentUser];
                if (this.currentUser !== null)
                    return `https://www.stream.me/stream-embed/${user.username}/chat-right?hideChat=${!this.chat}&noPopoutButton=true`;
                else
                    return false;
            },
        },

        methods: {
            ...mapActions('Chat', {
                updateTarget : 'UPDATE_TARGET',
            }),

            statusColor(status) {
                if (status === undefined) return 'accent';
                return status ? 'primary' : 'error';
            },

            async selectUser(userIndex) {
                this.currentUser = userIndex;

                const data = await this.getUserData(this.users[userIndex].username);
                if (data) {
                    const u = {
                        username : data['username'],
                        userId   : data['userPublicId'],
                    };
                    this.updateTarget(u);
                }

            },

            async getUserData(username) {
                const url = `/api-user/v2/${username}/app/web/channel`;
                try {
                    return await this.$axios.$get(url);
                } catch (e) {
                    console.warn(e);
                    return null;
                }
            },

            checkIfLive(data) {
                if (data) {
                    return !!data._embedded.streams[0].active;
                } else {
                    return null;
                }
            },

            getViewers(data) {
                if (data) {
                    return data.stats.raw.viewers;
                } else {
                    return null;
                }
            },

            async updateUsers() {
                console.groupCollapsed('⏳ Updating user data.');

                this.progress = 0;
                let log = [];
                for ( let i = 0, j = this.users.length; i < j; i++ ) {
                    const user = this.users[i];

                    this.users[i]._data = await this.getUserData(user.username);
                    this.progress = 100 / j * i;
                }
                this.progress = 100;

                for ( let i = 0, j = this.users.length; i < j; i++ ) {
                    const user = this.users[i];

                    this.users[i].live = this.checkIfLive(user._data);
                    this.users[i].viewers = this.getViewers(user._data);

                    log.push({
                        username: user.username,
                        live: user.live,
                        viewers: user.viewers,
                    });
                }

                console.table(log);
                console.groupEnd();
                console.log('✅ Finished updating');
            },
        },

        async mounted() {
            // await this.selectUser(1);
            await this.updateUsers();

            const timeToRefresh = 60;
            setInterval( async () => await this.updateUsers(), timeToRefresh * 1000 );
        }

    }
</script>

<style lang="css">
    /* Handled in Capture Now
    .theme--light.application {
        background: transparent;
    }*/

    /* Handled in Capture Now */
    .theme--light.application {
        background: #333 !important;
    }

    .desktop {
        display: flex;
        justify-content: center;
    }
</style>
