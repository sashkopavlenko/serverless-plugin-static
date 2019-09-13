import serve from './serve';

import Serverless = require('serverless');

interface PluginConfigOptions {
  readonly [key: string]: {
    name: string;
    shortcut: string;
    defaultValue: string | number;
  };
}

interface PluginConfig {
  port: string | number;
  folder: string;
}

const pluginConfig: PluginConfigOptions = {
  port: { name: 'port', shortcut: 'p', defaultValue: 8080 },
  folder: { name: 'folder', shortcut: 'f', defaultValue: './static' },
};

interface ServerlessConfig {
  readonly [key: string]: string;
}

interface ServerlessOptions {
  readonly [key: string]: string;
}

const paramConfig = (config: ServerlessConfig, options: ServerlessOptions) => (
  param: PluginConfigOptions['key']
) => {
  const { name, shortcut, defaultValue } = param;

  return config[name] || options[name] || options[shortcut] || defaultValue;
};

module.exports = class ServerlessStaticLocalPlugin {
  commands: {};

  hooks: {};

  constructor(serverless: Serverless, options: Serverless.Options) {
    const defaultPort = pluginConfig.port.defaultValue;
    const defaultFolder = pluginConfig.port.defaultValue;

    this.commands = {
      serve: {
        usage: 'serve local directory',
        lifecycleEvents: ['start'],
        options: {
          port: {
            usage: `Static server port, default: ${defaultPort}`,
            shortcut: pluginConfig.port.shortcut,
          },
          folder: {
            usage: `Static folder path, default: ${defaultFolder}`,
            shortcut: pluginConfig.folder.shortcut,
          },
        },
      },
    };

    const serverlessConfig =
      serverless.service.custom && serverless.service.custom.static
        ? serverless.service.custom.static
        : {};

    const getConfigValue = paramConfig(
      serverlessConfig,
      (options as any) as ServerlessOptions
    );

    const settings = Object.keys(pluginConfig).reduce(
      (config, key) => ({
        [key]: getConfigValue(pluginConfig[key]),
        ...config,
      }),
      {}
    );

    const serving = () => serve(serverless, <PluginConfig>settings);

    this.hooks = {
      'before:offline:start:init': serving,
      'serve:start': serving,
    };
  }
};
