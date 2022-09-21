import Vue from 'vue'
import VueHtmlToPaper from 'vue-html-to-paper'

const options = {
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://cdnjs.cloudflare.com/ajax/libs/vuetify/2.2.0/vuetify.css' ,
    `${window.location.origin}/print.css`,
    'https://fonts.googleapis.com/css2?family=Tajawal:wght@500&display=swap'

  ],
  timeout: 1000, // default timeout before the print window appears
  autoClose: true, // if false, the window will not close after printing
  windowTitle: window.document.title // override the window title
}

Vue.use(VueHtmlToPaper, options)

// or, using the defaults with no stylesheet
// Vue.use(VueHtmlToPaper)
