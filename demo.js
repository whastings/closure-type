var closureType = require('./closureType'),
    EventEmitter = require('events').EventEmitter;

// Create a "closure type" by invoking closureType with a callback.
// It will return to you a type factory function for creating instances.
var postType = closureType(
  // These args are passed to the main type and all function mixins.
  //
  // - `self` is an object to hold private instance state.
  // - `api` is the object returned from the type factory function, where
  //   you should attach all public methods and instance state.
  // - `initArgs` is a function that carries the arguments passed to the type
  //   factory function, taking a function for performing initialization logic.
  function(self, api, initArgs) {
    // Invoking init logic immediately.
    // You could also delay it with:
    //
    // var init = initArgs(function(title, body) {
    //   self.title = title;
    //   self.body = body;
    // });
    //
    // Then call `init()` later.
    initArgs(function(title, body) {
      self.title = title;
      self.body = body;
    })();

    // closureType.extend() is a handy helper function
    // for adding properties to the api object.
    closureType.extend(api, {
      getBody: function() {
        return self.body;
      },

      getTitle: function() {
        return self.title;
      },

      setBody: function(newBody) {
        if (!newBody) {
          return;
        }
        self.body = newBody;
        // We can use the mixed-in `emit()` method from
        // EventEmitter to notify subscribers of changes.
        api.emit('bodyChange', newBody);
      },

      setTitle: function(newTitle) {
        if (!newTitle) {
          return;
        }
        self.title = newTitle;
        api.emit('titleChange', newTitle);
      }
    });
  },
  // Mixins can be functions that take `self`, `api`, and `initArgs` or
  // objects (whose methods will be added to `api` with `this` bound to
  // `self`.
  [commentable, EventEmitter.prototype, likable]
);

// Mixins are just functions that take the closureType args.
function commentable(self, api, initArgs) {
  initArgs(function() {
    // Mixins can add instance state.
    self.comments = [];
  })();

  // Mixins can add public properties.
  closureType.extend(api, {
    addComment: function(comment) {
      self.comments.push(comment);
    },

    getComment: function(index) {
      return self.comments[index];
    },

    getComments: function() {
      return self.comments.slice();
    },

    numComments: function() {
      return self.comments.length;
    }
  });
}

function likable(self, api, initArgs) {
  initArgs(function() {
    self.numLikes = 0;
  })();

  closureType.extend(api, {
    addLike: function() {
      self.numLikes += 1;
    },

    numLikes: function() {
      return self.numLikes;
    }
  });
}


var assert = require('assert');

var title = 'closureType',
    body = 'A pattern and helper library for augmenting the revealing module ' +
      'pattern with mixin support...',
    post = postType(title, body);

assert.strictEqual(post.getBody(), body);
assert.strictEqual(post.getTitle(), title);

post.on('bodyChange', function(newBody) {
  console.log('Post body set to: ' + newBody);
});

post.on('titleChange', function(newTitle) {
  console.log('Post title set to: ' + newTitle);
});

var newTitle = 'What is closureType?',
    newBody = 'closureType is a helper function for defining JavaScript object ' +
      'types using an enhanced version of the revealing module pattern that ' +
      'supports mixins.';
post.setTitle(newTitle);
post.setBody(newBody);

assert.strictEqual(post.getTitle(), newTitle);
assert.strictEqual(post.getBody(), newBody);

var comments = [
  'closureType is awesome.',
  'I\'ll take mixins over classical inheritance any day.',
  'A great way to protect my private state.'
];

comments.forEach(function(comment) {
  post.addComment(comment);
});

assert.deepEqual(post.getComments(), comments);
assert.strictEqual(post.getComment(1), comments[1]);
assert.strictEqual(post.numComments(), 3);

for (var i = 0; i < 7; i++) {
  post.addLike();
}

assert.strictEqual(post.numLikes(), 7);
