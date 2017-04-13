// Main
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import routes from './global/router'
import api from './global/api'
import uitl from './global/util'
import routemap from './global/route_map'
import ElementUI from 'element-ui'

Vue.use(ElementUI)

const router = new VueRouter({
    routes
})

Vue.use(VueRouter)

Vue.prototype.$api = api
Vue.prototype.$util = uitl
Vue.prototype.$rmp = routemap
// Vue.prototype.$app = App.methods

new Vue({
    router,
    el: '#app',
    render: (h) => h(App)
})
