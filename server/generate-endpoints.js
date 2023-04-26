// const fs = require('fs');
// const data = [];
function print (path, layer) {
    if (layer.route) {
      layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
    } else if (layer.name === 'router' && layer.handle.stack) {
      layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
    } else if (layer.method) {
      data.push([layer.method.toUpperCase(),path.concat(split(layer.regexp)).filter(Boolean).join('/')]);
    }
    fs.writeFile('endpoints.txt', JSON.stringify(data), (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;    
    });
    console.table(data);
  }
  

  function split (thing) {
    if (typeof thing === 'string') {
      return thing.split('/')
    } else if (thing.fast_slash) {
      return ''
    } else {
      var match = thing.toString()
        .replace('\\/?', '')
        .replace('(?=\\/|$)', '$')
        .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
      return match
        ? match[1].replace(/\\(.)/g, '$1').split('/')
        : '<complex:' + thing.toString() + '>'
    }
  }

  module.exports = print;const fs = require('fs');
const data = [];
function print (path, layer) {
    if (layer.route) {
      layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
    } else if (layer.name === 'router' && layer.handle.stack) {
      layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
    } else if (layer.method) {
      data.push([layer.method.toUpperCase(),path.concat(split(layer.regexp)).filter(Boolean).join('/')]);
    }
    fs.writeFile('endpoints.txt', JSON.stringify(data), (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;    
    });
    console.table(data);
  }
  

  function split (thing) {
    if (typeof thing === 'string') {
      return thing.split('/')
    } else if (thing.fast_slash) {
      return ''
    } else {
      var match = thing.toString()
        .replace('\\/?', '')
        .replace('(?=\\/|$)', '$')
        .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
      return match
        ? match[1].replace(/\\(.)/g, '$1').split('/')
        : '<complex:' + thing.toString() + '>'
    }
  }

  module.exports = print;