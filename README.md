[![Fruit][logo]][repo-link]

[![CI Buimd][build-image]][build-url]
[![Dependencied][dependencies-image]][dependencies-url]
[![MIT license][license-img]][license-url]
[![Gitter][gitter-img]][gitter-url]

### Introduction :

This is the mysql adapter for the [fruit](http://npmjs.com/package/fruit) ORM, if you haven't take a look at its documentation yet, please make sure to do so.

### Installation :

```bash
  $ npm install fruit fruit-mysql
```

### Connection options :

This is an example the options you need to pass to the fruit constructor:

```javascript
  {
      host                : 'host'
    , database            : 'db'
    , user                : 'user'
    , password            : '******'
    , multipleStatements  : true
  }
```

The `multipleStatements` option is optional. If you need to get correct arguments for successCallBack after inserting multiple row, then you need to set it to `true`. And you also need to pass a boolean set to `true` as second argument to the `.insert()` method.

```javascript
  fruit.insert({ name: 'Khalid', age: 26 }, true)
    .success(successCallBack)
    .error(errorCallBack);
```
### Contributing

All contributions are welcome. Let's get this project to the next level.
Significant and valuable contributions will allow you to be part of [Fruit organisation](http://github.com/nodefruit).
See the [contribution guide](http://github.com/nodefruit/fruit/blob/master/CONTRIBUTING.md) for more details

### Community

If you'd like to chat and discuss this project, you can find us here:

- Mailing list: [https://groups.google.com/forum/#!forum/nodefruit](https://groups.google.com/forum/#!forum/nodefruit)
- [![Join the chat at https://gitter.im/nodefruit/fruit](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/nodefruit/fruit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[logo]: https://github.com/nodefruit/fruit-mysql/raw/master/pres/fruit-and-mysql-logo.png
[repo-link]: https://github.com/nodefruit/fruit-mysql
[build-image]: https://api.travis-ci.org/nodefruit/fruit-mysql.svg
[build-url]: https://github.com/nodefruit/fruit-mysql
[stability-image]: https://img.shields.io/badge/stability-experimental-orange.svg
[stability-url]: https://github.com/nodefruit/fruit-mysql
[license-img]: https://img.shields.io/badge/license-MIT-green.svg
[license-url]: https://github.com/nodefruit/fruit-mysql/blob/master/LICENSE
[dependencies-image]:https://david-dm.org/nodefruit/fruit-mysql.svg
[dependencies-url]:https://npmjs.com/package/fruit-mysql
[gitter-img]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/nodefruit/fruit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge