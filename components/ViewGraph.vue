<script>
    // import VueCharts from 'vue-chartjs'
    import { Line, mixins } from 'vue-chartjs'
    const { reactiveProp } = mixins;

    export default {
        name: 'ViewGraph',

        extends: Line,

        mixins: [reactiveProp],

        props: {
            options: {
                type: Object,
                default: null
            },
        },

        data() {
            return {
                old_options: { //Chart.js options
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
                        position: 'top',
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                },
            };
        },

        methods: {},

        computed: {},

        mounted () {
            this.renderChart(this.chartData, this.options)
        },
    }
</script>
