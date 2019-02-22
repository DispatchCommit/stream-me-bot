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
            <h3 class="title">View History Graph</h3>

            <v-card
                class="my-3"
            >

                <v-card-actions>
                    <v-text-field
                        v-model="user"
                        label="Username"
                        spellcheck="false"
                        v-on:keyup.enter="getRandomInt"
                    ></v-text-field>

                    <v-btn
                        class="mx-2"
                        color="#2196f3"
                        dark
                        @click="getRandomInt"
                    >
                        Add User
                    </v-btn>

                    <v-btn
                        class="mx-2"
                        color="#607d8b"
                        dark
                        @click="reduceData"
                    >
                        Shrink
                    </v-btn>
                </v-card-actions>

            </v-card>

            <view-graph :chart-data="datacollection" :options="options"/>

            <view-graph :chart-data="datacollectionRalph" :options="options2"/>

        </v-flex>
    </v-layout>
</template>

<script>
    import ViewGraph from '~/components/ViewGraph'

    const userList = [
        'TheRalphRetort',
        'GodspeedLive',
        // 'RekietaLaw',
        'SPCC',
        'Murderder',
        'Mandalorian',
        'Randbot2020',
        // 'NPCAnon88',
        'TheCognificent',
        'WildGoose',
        // 'KOVALSKI',
        'MisterMetokur',
    ];

    const userColors = [
        '#f44336',
        '#e91e63',
        '#9c27b0',
        '#673ab7',
        '#3f51b5',
        '#2196f3',
        '#03a9f4',
        '#00bcd4',
        '#009688',
        '#4caf50',
        '#8bc34a',
        '#cddc39',
        '#ffeb3b',
        '#ffc107',
        '#ff9800',
        '#ff5722',
        '#795548',
        '#607d8b',
    ];

    export default {
        name: 'views',

        components: {
            ViewGraph,
        },

        data() {
            return {
                user: 'TheRalphRetort',
                refresh: 10,
                datacollection: null,
                datacollectionRalph: null,
                timestamps: [],
                viewData: [],

                // Chart.js options
                options: {
                    scales: {
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Viewers',
                            },
                            ticks: {
                                beginAtZero: true,
                            },
                            gridLines: {
                                display: true,
                            },
                            stacked: false,
                        }],
                        xAxes: [ {
                            ticks: {
                                beginAtZero: true,
                            },
                            gridLines: {
                                display: true,
                            },
                        }],
                    },
                    legend: {
                        display: true,
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: 'Stream.me Viewrbase Overview',
                        position: 'top',
                        fontSize: 14,
                    },
                    tooltip: {
                        intersect: false,
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                },

                // Chart.js options
                options2: {
                    scales: {
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Viewers',
                            },
                            ticks: {
                                beginAtZero: true,
                            },
                            gridLines: {
                                display: true,
                            },
                            stacked: false,
                        }],
                        xAxes: [ {
                            ticks: {
                                beginAtZero: true,
                            },
                            gridLines: {
                                display: true,
                            },
                        }],
                    },
                    legend: {
                        display: true,
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: 'The Ralph Retort',
                        position: 'top',
                        fontSize: 14,
                    },
                    tooltip: {
                        intersect: false,
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                },
            }
        },

        methods: {
            async getViewCount(username) {
                const url = `/api-user/v2/${username}/app/web/channel/`;
                try {
                    const data = await this.$axios.$get(url);
                    return data.stats.raw.viewers;
                } catch (e) {
                    console.warn(e);
                    return null;
                }
            },


            getRandomInt () {
                return Math.floor( Math.random() * (50 + 1) )
            },

            reduceData() {
                for ( let i = 0, j = this.viewData.length; i < j; i++ ) {
                    let arr = this.viewData[i];
                    for ( let k = 0, l = arr.length; k < l; k += 2 ) {
                        arr.splice( k, 1 );
                    }
                }
                for ( let i = 0, j = this.timestamps.length; i < j; i += 2 ) {
                    this.timestamps.splice( i, 1 );
                }
            },

            async loop() {
                this.timestamps.push( new Date().toLocaleTimeString() );


                await Promise.all( this.viewData.map( async (data, i) => data.push( await this.getViewCount(userList[i]) ) ) );

                // this.viewData.map( async (data, i) => data.push( await this.getViewCount(userList[i]) ) );

                console.log(this.viewData);

                this.createData();
            },


            async createData() {
                const dataset = [];

                for (let i=0,j=this.viewData.length; i<j; i++) {
                    dataset.push({
                        label: userList[i],
                        borderColor: this.datacollection.datasets[i].borderColor,
                        fill: false,
                        data: this.viewData[i],
                    });
                }

                this.datacollection = {
                    labels: this.timestamps,
                    datasets: dataset,
                };

                // ---------------------
                const datasetRalph = [];
                datasetRalph.push({
                    label: userList[0],
                    borderColor: this.datacollectionRalph.datasets[0].borderColor,
                    backgroundColor: this.datacollectionRalph.datasets[0].backgroundColor,
                    fill: true,
                    data: this.viewData[0],
                });

                this.datacollectionRalph = {
                    labels: this.timestamps,
                    datasets: datasetRalph,
                };

                setTimeout( async () => await this.loop(), this.refresh * 1000 );
            },
        },

        computed: {},

        async mounted() {
            this.timestamps.push( new Date().toLocaleTimeString() );

            const dataset = [];

            userList.forEach(user => {
                this.viewData.push([]);
                let color = userColors[ dataset.length ];
                dataset.push({
                    label: user,
                    borderColor: color,
                    fill: false,
                    data: [0],
                });
            });

            this.datacollection = {
                labels: this.timestamps,
                datasets: dataset,
            };

            const dataset2 = [];

            dataset2.push({
                label: 'TheRalphRetort',
                borderColor: userColors[15],
                backgroundColor: userColors[15],
                fill: true,
                data: [0],
            });

            this.datacollectionRalph = {
                labels: this.timestamps,
                datasets: dataset2
            };

            await this.loop();
        },
    }
</script>
