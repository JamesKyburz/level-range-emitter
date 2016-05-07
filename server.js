var rangeEmitter = require('range-emitter')
var eos = require('end-of-stream')

module.exports = server

function server (db) {
  var emitters = []
  var re = rangeEmitter()
  var reMainStream = re.connect()
  re.subscribe(function (key, type) {
    emitters.forEach(function (e) {
      onChange(e, key, type)
    })
  })

  return {
    session: newSession,
    emutter: re
  }

  function newSession (dbStream, wsStream) {
    function onPut (key) { onChange(re, key, 'put') }
    function onDel (key) { onChange(re, key, 'del') }
    function onBatch (ary) {
      ary.forEach(function (item) {
        onChange(re, item.key, item.type)
      })
    }

    var re = rangeEmitter()
    emitters.push(re)
    var reStream = re.connect()

    db.on('put', onPut)
    db.on('del', onDel)
    db.on('batch', onBatch)

    eos(wsStream, function () {
      db.removeListener('put', onPut)
      db.removeListener('del', onDel)
      db.removeListener('batch', onBatch)
      emitters = emitters.filter(function (e) { return e !== re })
    })

    reStream.on('data', wsStream.write.bind(wsStream))
    dbStream.on('data', wsStream.write.bind(wsStream))

    wsStream.on('data', function (data) {
      dbStream.write(data)
      reStream.write(data)
      reMainStream.write(data)
    })
  }
}

function onChange (re, key, type) {
  if (re.subscriptionExists(key)) {
    re.publish(key.toString(), type)
  }
}
