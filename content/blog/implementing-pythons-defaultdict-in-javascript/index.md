---
title: Implementing Python's defaultdict in JavaScript
date: 2020-02-29
description: A defaultdict equivalent, in under 20 lines of JavaScript.
tags: ['JavaScript', 'Node.js', 'Python']
---

Here's a quick one. Python's defaultdict is really useful:

```python
from collections import defaultdict

d = defaultdict(lambda: [])

d['a'] += [1, 2, 3]
d['a'] += [4]

print(d['a']) # [1, 2, 3, 4]
print(d['b']) # []
```

While not quite as convenient, here's a quick JavaScript version, using
the useful [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) builtin (which gets us almost there by itself):

```js
module.exports = class DefaultMap extends Map {
  constructor(getDefaultValue, ...mapConstructorArgs) {
    super(mapConstructorArgs);

    if (typeof getDefaultValue !== 'function') {
      throw new Error('getDefaultValue must be a function');
    }

    this.getDefaultValue = getDefaultValue;
  }

  get = key => {
    if (!this.has(key)) {
      this.set(key, this.getDefaultValue(key));
    }

    return super.get(key);
  };
};
```

Here's how to use it:

```js
const DefaultMap = require('./DefaultMap');

const d = new DefaultMap(() => []);

d.get('a').push(1, 2, 3);

console.log(d.get('a')); // [1, 2, 3]
console.log(d.get('b')); // []
```

If you want to have the default value be dependent on the key, that's easy:

```js
const DefaultMap = require('./DefaultMap');

const d = new DefaultMap(key => (key < 10 ? 0 : 1));

d.set(5, d.get(5) + 1);
d.set(20, d.get(20) + 1);

console.log(d.get(5)); // 1
console.log(d.get(20)); // 2
```

And there we have it.

## Implementing with Proxy

If you don't love the `.get` syntax, there's another option, though I find
the implementation a bit less obvious. It uses [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy).

Note that `Proxy` cannot be used with IE11, [not even with babel](https://babeljs.io/docs/en/learn#proxies):

> Unsupported feature
> Due to the limitations of ES5, Proxies cannot be transpiled or polyfilled. See support in various JavaScript engines.

```js
module.exports = class DefaultDict extends Object {
  constructor(getDefaultValue, ...objectConstructorArgs) {
    super(objectConstructorArgs);

    if (typeof getDefaultValue !== 'function') {
      throw new Error('getDefaultValue must be a function');
    }

    return new Proxy(this, {
      get: function(target, key) {
        if (!Reflect.has(target, key)) {
          Reflect.set(target, key, getDefaultValue(key));
        }

        return Reflect.get(target, key);
      },
    });
  }
};
```

Then, you can use it just like a native object:

```js
const DefaultDict = require('./DefaultDict');

const d = new DefaultDict(() => []);

d['a'].push(1, 2, 3);

console.log(d['a']); // [1, 2, 3]
console.log(d['b']); // []
```

---

Get [the code on GitHub](https://github.com/AaronMoat/aaronmoat-blog/tree/master/content/blog/implementing-pythons-defaultdict-in-javascript/js/).
