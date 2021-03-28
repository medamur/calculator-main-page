export default {
  head: {
    title: 'test-task',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ]
  },
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build'
  ],
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios'
  ],
  axios: {
    baseURL: 'https://api.vozovoz.ru'
  }
}
