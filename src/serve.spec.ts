import { Server } from 'https';
import * as request from 'supertest';
import serve from './serve';

import Serverless = require('serverless');
const serverless = {
  cli: { log: jest.fn() },
} as any;

describe('Server', () => {
  let server: Server;

  beforeAll(async () => {
    server = (await serve(<Serverless>serverless, {
      folder: 'static',
      port: 8080,
    })) as Server;
  });

  it('should be defined', () => {
    expect(server).toBeDefined();
  });

  it('GET /static/not-exists', done =>
    request(server)
      .get('/static/not-exists')
      .expect(404)
      .end(done));
});
