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

            };
        },

        methods: {
            render() {
                this.renderChart(this.chartData, this.options);
            },
        },

        computed: {},

        watch: {
            options:{
                handler() {
                    this.render();
                },
                deep: true,
            },
        },

        mounted () {
            this.render();
        },
    }
</script>
