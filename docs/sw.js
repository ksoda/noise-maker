/*!
 Copyright 2015 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
/* eslint-env worker */

'use strict';

// global.importScripts('https://cdnjs.cloudflare.com/ajax/libs/sw-toolbox/3.6.1/sw-toolbox.js')
// Incrementing CACHE_VERSION will kick off the install event and force previously cached
// resources to be cached again.
const CACHE_VERSION = 1;
var filesToCache = [
  './',
  'styles/material.indigo-pink.min.css',
  'scripts/material.min.js',
  'scripts/main.js'
];
const cacheName = 'noise_' + CACHE_VERSION;

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        console.log(response)
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
/*
self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});
*/
