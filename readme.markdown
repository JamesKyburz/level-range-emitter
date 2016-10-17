# level-range-emitter

range emitter hooks for leveldb

client and server using [multileveldown], [range-emitter] and [ltgt]

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# client example

```javascript
var websocket = require('websocket-stream')
var multileveldown = require('multileveldown')
var rangeEmitter = require('level-range-emitter').client
var db = multileveldown.client({ keyEncoding: 'utf8', valueEnoding: 'json', retry: true })
var re = rangeEmitter(db)
;(function connect () {
  var protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  var url = `${protocol}://${window.location.host}/db`
  var ws = websocket(url)
  var remote = db.connect()
  re.session(remote, ws)
  ws.on('close', window.setTimeout.bind(window, connect, 3000))
})()

re.subscribe((key, type) => console.log('changed %s', key, type))
```

# server example

``` javascript
  var lre = require('level-range-emitter').server(db)
  var session = lre.session
  var dbStream = multileveldown.server(dbInstance)
  session(dbStream, stream)
```

[ltgt]: https://www.npmjs.com/package/ltgt
[multileveldown]: https://www.npmjs.com/package/multileveldown
[range-emitter]: https://github.com/JamesKyburz/range-emitter
