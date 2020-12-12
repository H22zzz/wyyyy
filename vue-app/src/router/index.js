import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: ()=>import(/* webpackChunkName: "home" */'../views/Home'),
    redirect: '/recommend',
    children: [
      {
        path: 'recommend',
        name: 'recommend',
        component: ()=>import(/* webpackChunkName: "recommend" */'../views/Recommend'),
        children: [
          {
            path: ':id',
            name: 'recommend-list',
            component: ()=>import(/* webpackChunkName: "song-list" */'../views/SongList'),
          }
        ]
      },
      {
        path: 'singers',
        name: 'singers',
        component: ()=>import(/* webpackChunkName: "singers" */'../views/Singers'),
        children: [
          {
            path: ':id',
            name: 'singer',
            component: ()=>import(/* webpackChunkName: "singers" */'../views/Singer'),
          }
        ]
      },
      {
        path: 'rank',
        name: 'rank',
        component: ()=>import(/* webpackChunkName: "rank" */'../views/Rank'),
        children: [
          {
            path: ':id',
            name: 'rank-list',
            component: ()=>import(/* webpackChunkName: "song-list" */'../views/SongList'),
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirect: '/recommend'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
