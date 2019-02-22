const pkg = require('./package');

module.exports = {
    mode: 'universal',

    server: {
        port: 80,
        // host: 'localhost',
    },

    /*
    ** Headers of the page
    */
    head: {
        title: pkg.name,
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: pkg.description },
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
        ]
    },

    /*
    ** Customize the progress-bar color
    */
    loading: { color: '#4CAF50' },

    /*
    ** Global CSS
    */
    css: [
        '~/assets/style/app.styl',
    ],

    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        '@/plugins/vuetify',
        '@/plugins/firebase',
    ],

    /*
    ** Nuxt.js modules
    */
    modules: [
        '@nuxtjs/axios',
        // '@nuxtjs/auth',
    ],
    /*
    ** Axios module configuration
    */
    axios: {
        proxy: true,
    },

    proxy: {
        '/api-user/': 'https://www.stream.me',
    },

    /*
    ** Build configuration
    */
    build: {
        /*
        ** You can extend webpack config here
        */
        extend(config, ctx) {
            // Run ESLint on save
            if (ctx.isDev && ctx.isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/,
                });
            }
        },
    },
};
