var closureType = require('./closureType');

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

    api.getBody = getBody;
    api.getPrefix = getPrefix;
    api.getTitle = getTitle;
  },
  [someMixin]
);

function someMixin(self, api, initArgs) {
  initArgs(function(title) {
    self.superTitle = title.toUpperCase();
  })();

  function getSuperTitle() {
    var prefix = api.getPrefix();
    return prefix + ': ' + self.superTitle;
  }

  api.getSuperTitle = getSuperTitle;
}

var jsPost = postType('js oo', 'Is complicated...');
console.log(jsPost.getTitle());
console.log(jsPost.getBody());
console.log(jsPost.getSuperTitle());
console.log(jsPost.title);
console.log(jsPost.body);
