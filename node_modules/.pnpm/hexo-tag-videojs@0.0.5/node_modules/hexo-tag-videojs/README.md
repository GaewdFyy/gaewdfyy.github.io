# hexo-tag-videojs - HTML5 Video Player for Hexo.js

🧩 Hexo  [video.js](https://videojs.com) plugin. u can embed video in ur post or page

📦 Package name: `hexo-tag-videojs`  **is not ~~hexo-tag-video-js~~**!

## Install

🐱 Use yarn:

```
yarn add hexo-tag-videojs
```

📦 Use npm: 

```
npm i hexo-tag-videojs
```

## Use it

🚀 in Hexo post / page u will use: `{% videojs key=value%}`

```markdown
{% videojs "source=https://d2zihajmogu5jn.cloudfront.net/advanced-fmp4/master.m3u8" %}
```

## Configuration

Config load order, config only for static resource import ...

**No configuration required by default.**

1. `meta-space-config.yml` (this project support [Meta Network](https://meta.io) spaces).

   ``` yaml
   videoPlayerResourcesUrl:
     - https://unpkg.com/video.js@6.7.1/dist/video-js.css
     - https://unpkg.com/video.js@6.7.1/dist/video.js
     - https://unpkg.com/@videojs/http-streaming@0.9.0/dist/videojs-http-streaming.js
   ```

2. `_config.yml` : global config file.

   ``` yaml
   hexo-tag-videojs:
   	videoPlayerResourcesUrl:
     	- https://unpkg.com/video.js@6.7.1/dist/video-js.css
     	- https://unpkg.com/video.js@6.7.1/dist/video.js
     	- https://unpkg.com/@videojs/http-streaming@0.9.0/dist/videojs-http-streaming.js
   ```

3. default hard code. (no need any configuration). it require static resources from:

   - https://unpkg.com/video.js@6.7.1/dist/video-js.css
   - https://unpkg.com/video.js@6.7.1/dist/video.js
   - https://unpkg.com/@videojs/http-streaming@0.9.0/dist/videojs-http-streaming.js