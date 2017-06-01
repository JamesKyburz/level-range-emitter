# level-range-emitter

range emitter hooks for leveldb

client and server using [multileveldown], [range-emitter] and [ltgt]

[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![Greenkeeper badge](https://badges.greenkeeper.io/JamesKyburz/level-range-emitter.svg)](https://greenkeeper.io/)
[![downloads](https://img.shields.io/npm/dm/level-range-emitter.svg)](https://npmjs.org/package/level-range-emitter)

# client example

```javascript
const websocket = require('websocket-stream')
const multileveldown = require('multileveldown')
const rangeEmitter = require('level-range-emitter').client
const db = multileveldown.client({ keyEncoding: 'utf8', valueEnoding: 'json', retry: true })
const re = rangeEmitter(db)
;(function connect () {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  const url = `${protocol}://${window.location.host}/db`
  const ws = websocket(url)
  const remote = db.connect()
  re.session(remote, ws)
  ws.on('close', window.setTimeout.bind(window, connect, 3000))
})()

re.subscribe((key, type) => console.log('changed %s', key, type))
```

# server example

``` javascript
  const lre = require('level-range-emitter').server(db)
  const session = lre.session
  const dbStream = multileveldown.server(dbInstance)
  session(dbStream, stream)
```

[ltgt]: https://www.npmjs.com/package/ltgt
[multileveldown]: https://www.npmjs.com/package/multileveldown
[range-emitter]: https://github.com/JamesKyburz/range-emitter
