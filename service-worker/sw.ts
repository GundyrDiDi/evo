// import { clientsClaim } from 'workbox-core'

// console.log(clientsClaim)
// import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
// import { NavigationRoute, registerRoute } from 'workbox-routing'

// declare let self: ServiceWorkerGlobalScope

// // self.__WB_MANIFEST is default injection point
// precacheAndRoute(self.__WB_MANIFEST)

// // clean old assets
// cleanupOutdatedCaches()

// let allowlist: undefined | RegExp[]
// if (import.meta.env.DEV)
//   allowlist = [/^\/$/]

// // to allow work offline
// registerRoute(new NavigationRoute(
//   createHandlerBoundToURL('/'),
//   { allowlist },
// ))

// self.skipWaiting()
// clientsClaim()

// Service Worker 核心能力
// 离线资源缓存
// 拦截和处理网络请求
// 后台数据同步
// 推送通知管理

// const db = indexedDB.open("a");

// console.log({db})