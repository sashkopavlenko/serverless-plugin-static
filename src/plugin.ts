import serve from './serve';
import Serverless = require('serverless');
import Plugin = require('serverless/classes/Plugin');

interface PluginOptions extends Serverless.Options {
  port?: string;
  p?: string;
  folder?: string;
  f?: string;
}

const defaults = {
  port: 8080,
  folder: './static',
};

export default class ServerlessStaticLocalPlugin implements Plugin {
  commands = {
    serve: {
      usage: 'serve local directory',
      lifecycleEvents: ['start'],
      options: {
        port: {
          usage: `Static server port, default: ${defaults.port}`,
          shortcut: 'p',
        },
        folder: {
          usage: `Static folder path, default: ${defaults.folder}`,
          shortcut: 'f',
        },
      },
    },
  };

  hooks: Plugin['hooks'];

  constructor(serverless: Serverless, options: PluginOptions) {
    const serverlessConfig =
      serverless.service.custom && serverless.service.custom.static
        ? serverless.service.custom.static
        : {};

    const settings = {
      port:
        Number(options.port) ||
        Number(options.p) ||
        serverlessConfig.port ||
        defaults.port,
      folder:
        options.folder ||
        options.f ||
        serverlessConfig.folder ||
        defaults.folder,
    };

    const startServer = () => serve(serverless, settings);

    this.hooks = {
      'before:offline:start:init': startServer,
      'serve:start': startServer,
    };
  }
}
