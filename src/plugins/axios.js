export default function ({ app, redirect, store }) {
  app.$axios.onError((error) => {
    if (error.response.status === 401) { 
      store.$auth.$state.loggedIn = false
    } 
  })
  // app.$axios.onResponse((res) => {
  //   console.log(store.$auth.$state.loggedIn)
  //   store.dispatch('showSuccess', res.data.message)

  // })
  // app.$axios.setHeader('Accept-Language', app.i18n.locale)
}
