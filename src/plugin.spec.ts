import StaticPlugin from './plugin';
import * as ServerModule from './serve';
import Serverless = require('serverless');

const serveMock = jest
  .spyOn(ServerModule, 'default')
  .mockImplementation(() => Promise.resolve());

describe('Plugin without options', () => {
  const serverless = {
    service: {},
  };
  const options = {
    stage: '',
    region: '',
  };
  const plugin = new StaticPlugin(<Serverless>serverless, options);

  beforeAll(() => {
    serveMock.mockClear();
    plugin.hooks['serve:start']();
  });

  it('should be defined', () => {
    expect(plugin).toBeDefined();
  });

  it('should run before offline plugin', () => {
    expect(plugin.hooks['before:offline:start:init']).toBeInstanceOf(Function);
  });

  it('should run on serve command', () => {
    expect(plugin.hooks['serve:start']).toBeInstanceOf(Function);
  });

  const defaultPort = 8080;
  it(`should pass default ${defaultPort} port to server`, async () => {
    plugin.hooks['serve:start']();
    const [, settings] = serveMock.mock.calls[0];
    expect(settings.port).toBe(defaultPort);
  });

  const defaultFolder = './static';
  it(`should pass default ${defaultFolder} folder to server`, async () => {
    plugin.hooks['serve:start']();
    const [, settings] = serveMock.mock.calls[0];
    expect(settings.folder).toBe(defaultFolder);
  });
});

describe('Plugin with yaml config', () => {
  const serverless = {
    service: {
      custom: {
        static: {
          folder: 'dist',
          port: 3000,
        },
      },
    },
  } as any as Serverless;
  const options = {
    stage: '',
    region: '',
  };
  const plugin = new StaticPlugin(serverless, options);

  beforeAll(() => {
    serveMock.mockClear();
    plugin.hooks['serve:start']();
  });

  it(`should pass port from YML config to server`, async () => {
    const [, settings] = serveMock.mock.calls[0];
    expect(settings.port).toBe(serverless.service.custom.static.port);
  });

  it(`should pass folder from YML config to server`, async () => {
    const [, settings] = serveMock.mock.calls[0];
    expect(settings.folder).toBe(serverless.service.custom.static.folder);
  });
});

describe('Plugin with cli arguments', () => {
  const serverless = {
    service: {},
  };
  const options = {
    stage: '',
    region: '',
    folder: 'build',
    port: '8000',
  };
  const plugin = new StaticPlugin(<Serverless>serverless, options);

  beforeAll(() => {
    serveMock.mockClear();
    plugin.hooks['serve:start']();
  });

  it(`should pass port from --port argument to server`, async () => {
    const [, settings] = serveMock.mock.calls[0];
    expect(settings.port).toBe(Number(options.port));
  });

  it(`should pass folder from --folder argument to server`, async () => {
    const [, settings] = serveMock.mock.calls[0];
    expect(settings.folder).toBe(options.folder);
  });
});

describe('Plugin with cli shortcuts arguments', () => {
  const serverless = {
    service: {},
  };
  const options = {
    stage: '',
    region: '',
    f: 'build-shortcut',
    p: '5000',
  };
  const plugin = new StaticPlugin(<Serverless>serverless, options);

  beforeAll(() => {
    serveMock.mockClear();
    plugin.hooks['serve:start']();
  });

  it(`should pass port from --p argument to server`, async () => {
    const [, settings] = serveMock.mock.calls[0];
    expect(settings.port).toBe(Number(options.p));
  });

  it(`should pass folder from --f argument to server`, async () => {
    const [, settings] = serveMock.mock.calls[0];
    expect(settings.folder).toBe(options.f);
  });
});
