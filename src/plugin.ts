import serve from './serve';

import Serverless = require('serverless');

interface PluginOptions extends Serverless.Options {
  port?: string;
  p?: string;
  folder?: string;
  f?: string;
}

const defaults = {
  port: 8080,
  folder: 'static',
};

export default class ServerlessStaticLocalPlugin {
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

  hooks: { [event: string]: (...rest: any[]) => any };

  constructor(serverless: Serverless, options: PluginOptions) {
    const serverlessConfig =
      serverless.service.custom && serverless.service.custom.static
        ? serverless.service.custom.static
        : {};

    const settings = {
      port:
        serverlessConfig.port ||
        Number(options.port) ||
        Number(options.p) ||
        defaults.port,
      folder:
        serverlessConfig.folder ||
        options.folder ||
        options.f ||
        defaults.folder,
    };

    const startServer = () => serve(serverless, settings);

    this.hooks = {
      'before:offline:start:init': startServer,
      'serve:start': startServer,
    };
  }
}
