# serverless-plugin-static

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

A serverless framework plugin to serve static files locally

## Contents

1. [Usage requirements](#usage-requirements)
2. [Installation](#installation)
3. [Quick start](#quick-start)

## Usage requirements

Requires Node 10.

It's recommended to use this plugin along with [serverless-offline](https://github.com/dherault/serverless-offline).

## Installation

Obviously, you should have [Serverless-framework](https://github.com/serverless/serverless) installed. If it's not, please start from this [guide](https://serverless.com/framework/docs/getting-started/).

Then install the package:

```bash
npm install serverless-plugin-static -D
```

You can start serving the static folder by the CLI command, but probably for local development you should use [serverless-offline](https://github.com/dherault/serverless-offline) plugin:

```bash
npm install serverless-offline -D
```

## Quick start

Add the plugins to your serverless.yml:

```YAML
plugins:
  - serverless-plugin-static
  - serverless-offline
```

Configure the plugin by providing folder path and server port, default values are:

```YAML
custom:
  static:
    folder: ./static
    port: 8080
```

Start the application:

```bash
serverless offline start
```

You can also start serving files separately by the command:

```bash
serverless serve --folder ./static --port 8080
```

Or with the shortcuts:

```bash
serverless serve -f ./static -p 8080
```

Note: do not use CLI options with `serverless-offline start` command or any other plugins that create a server, since `port` argument will cause conflicts.

[npm-image]: https://img.shields.io/npm/v/serverless-plugin-static.svg
[npm-url]: https://npmjs.org/package/serverless-plugin-static
[travis-image]: https://travis-ci.com/sashkopavlenko/serverless-plugin-static.svg?branch=master
[travis-url]: https://travis-ci.com/sashkopavlenko/serverless-plugin-static
[coveralls-image]: https://coveralls.io/repos/github/sashkopavlenko/serverless-plugin-static/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/sashkopavlenko/serverless-plugin-static?branch=master
