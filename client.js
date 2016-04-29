var rangeEmitter = require('range-emitter')

module.exports = client

function client (db) {
  var re = rangeEmitter()

  db.on('put', onPut)
  db.on('del', onDel)
  db.on('batch', onBatch)

  return {
    session: session,
    emitter: re
  }

  function onPut (key) { onChange(key, 'put') }
  function onDel (key) { onChange(key, 'del') }
  function onBatch (ary) {
    ary.forEach(function (item) {
      onChange(item.key, item.type)
    })
  }

  function onChange (key, type) {
    re.publish(key, type)
  }

  function session (dbStream, wsStream) {
    var reStream = re.connect()
    wsStream.on('error', wsStream.destroy.bind(wsStream))
    wsStream.on('close', function () {
      dbStream.destroy()
      reStream.destroy()
    })
    wsStream.on('data', function (data) {
      reStream.write(data)
      dbStream.write(data)
    })
    dbStream.on('data', function (data) {
      wsStream.write(data)
    })
    reStream.on('data', function (data) {
      wsStream.write(data)
    })
  }
}
