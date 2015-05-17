var closureType = require('./closureType'),
    EventEmitter = require('events').EventEmitter;

var postType = closureType(
  function(self, api, initArgs) {
    initArgs(function(title, body) {
      self.title = title;
      self.body = body;
    })();

    function getBody() {
      return self.body;
    }

    function getPrefix() {
      return 'Foo';
    }

    function getTitle() {
      return self.title;
    }

    function setTitle(newTitle) {
      self.title = newTitle;
      api.emit('titleChange', newTitle);
    }

    closureType.extend(api, {
      getBody: getBody,
      getPrefix: getPrefix,
      getTitle: getTitle,
      setTitle: setTitle
    });
  },
  [someMixin, EventEmitter.prototype]
);

function someMixin(self, api, initArgs) {
  initArgs(function(title) {
    self.superTitle = title.toUpperCase();
  })();

  function getSuperTitle() {
    var prefix = api.getPrefix();
    return prefix + ': ' + self.superTitle;
  }

  closureType.extend(api, {
    getSuperTitle: getSuperTitle
  });
}

var jsPost = postType('js oo', 'Is complicated...');

console.log(jsPost.getTitle());
console.log(jsPost.getBody());
console.log(jsPost.getSuperTitle());
console.log(jsPost.title);
console.log(jsPost.body);

jsPost.on('titleChange', function(newTitle) {
  console.log(newTitle);
});

jsPost.setTitle('Scoop on the Revealing Module Pattern');
