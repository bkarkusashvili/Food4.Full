const pkg = require('./package');

module.exports = {
  mode: 'universal',
  loading: false,

  /*
  ** Headers of the page
  */
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Global CSS
  */
  css: [
    '@assets/main.scss'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    './plugins/filters',
    './plugins/notifications',
    { src: './plugins/draggable.js', ssr: false },
    { src: './plugins/datepicker.js', ssr: false },
    { src: './plugins/carousel.js', ssr: false }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/pwa'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    browserBaseURL: "/",
    credentials: true
  },

  /*
   ** Auth module configuration
   */
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/api/auth/login',
            method: 'post',
            propertyName: false
          },
          logout: {
            url: '/api/auth/logout',
            method: 'post'
          },
          user: {
            url: '/api/auth/me',
            method: 'get',
            propertyName: false
          }
        },
        tokenRequired: false,
        tokenType: false
      }
    }
  },

  /*
  ** Build configuration
  */
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  },
  server: {
    port: 3001, // default: 3001
    host: 'localhost', // default: localhost,
    timing: false
  }
};
