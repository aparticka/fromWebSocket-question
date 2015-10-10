var Rx = require('rx-dom');

var ws$ = Rx.DOM.fromWebSocket('ws://aparticka.com:4000')
  .map(function(e) {
    return JSON.parse(e.data);
  });

var id$ = ws$
  .map(function(message) {
    return message.id;
  });
var name$ = ws$
  .map(function(message) {
    return message.name;
  });

Rx.Observable.combineLatest(
  id$, name$, function(id, name) {
    return {
      id: id,
      name: name
    };
  }
).subscribe(function(next) {
  console.log(next);
});
