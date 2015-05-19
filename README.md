# FileBot

A node.js wrapper for [FileBot](https://www.filebot.net/).

## Usage

```sh 
$ npm i filebot
```

All (both) methods are currently static, accept an optional callback argument and return a promise.

```javascript
var FileBot = require('filebot')
FileBot.rename({db: 'TheMovieDB', path: '~/Movies/**/*'});
FileBot.getSubtitles({path: '~/Movies/**/*'});
```
