/* eslint-disable max-classes-per-file */
import { Server } from 'https';
import * as request from 'supertest';
import { promises as fs } from 'fs';
import serve from './serve';
import Serverless = require('serverless');

class FileNotFound extends Error {
  code = 'ENOENT';
}

class PermissionDenied extends Error {
  code = 'EACCES';
}

const files: { [path: string]: string } = {
  'static/favicon.ico': 'image/x-icon',
  'static/index.html': 'text/html',
  'static/index.js': 'text/javascript',
  'static/file.json': '{ "contentType": "application/json" }',
  'static/file.css': 'text/css',
  'static/image.png': 'image/png',
  'static/image.jpg': 'image/jpeg',
  'static/audio.wav': 'audio/wav',
  'static/audio.mp3': 'audio/mpeg',
  'static/pic.svg': 'image/svg+xml',
  'static/doc.pdf': 'application/pdf',
  'static/doc.doc': 'application/msword',
  'static/index': 'text/plain',
};

jest
  .spyOn(fs, 'readFile')
  .mockName('readFile')
  .mockImplementation((pathname) => {
    if (pathname === 'static/denied') {
      throw new PermissionDenied();
    }

    const file = files[String(pathname)];
    if (!file) {
      throw new FileNotFound();
    }

    return Promise.resolve(file);
  });

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

  afterAll(() => server.close());

  it('should be defined', () => {
    expect(server).toBeDefined();
  });

  it('GET /not-exists - 404 status code', (done) =>
    request(server).get('/not-exists').expect(404).end(done));

  it('GET /favicon.ico - 200 status code', (done) =>
    request(server).get('/favicon.ico').expect(200).end(done));

  it('GET /index.html - text/html Content-Type', (done) =>
    request(server)
      .get('/index.html')
      .expect('Content-Type', /text\/html/)
      .end(done));

  it('GET /index.js - text/javascript response', async (done) => {
    const response = await request(server).get('/index.js');
    expect(response.text).toBe('text/javascript');
    done();
  });

  it('GET /denied - 500 status code', (done) =>
    request(server).get('/denied').expect(500).end(done));

  it('GET /denied - 500 status code', (done) =>
    request(server).get('/denied').expect(500).end(done));

  it('GET /index - text/plain Content-Type', (done) =>
    request(server)
      .get('/index')
      .expect('Content-Type', /text\/plain/)
      .end(done));

  it('GET /file.json - application/json Content-Type', (done) =>
    request(server)
      .get('/file.json')
      .expect('Content-Type', /application\/json/)
      .end(done));

  it('GET /file.css - text/css Content-Type', (done) =>
    request(server)
      .get('/file.css')
      .expect('Content-Type', /text\/css/)
      .end(done));

  it('GET /image.png - image/png Content-Type', (done) =>
    request(server)
      .get('/image.png')
      .expect('Content-Type', /image\/png/)
      .end(done));

  it('GET /image.jpg - image/jpeg Content-Type', (done) =>
    request(server)
      .get('/image.jpg')
      .expect('Content-Type', /image\/jpeg/)
      .end(done));

  it('GET /audio.wav - audio/wav Content-Type', (done) =>
    request(server)
      .get('/audio.wav')
      .expect('Content-Type', /audio\/wav/)
      .end(done));

  it('GET /audio.mp3 - audio/mpeg Content-Type', (done) =>
    request(server)
      .get('/audio.mp3')
      .expect('Content-Type', /audio\/mpeg/)
      .end(done));

  it('GET /pic.svg - image/svg+xml Content-Type', (done) =>
    request(server)
      .get('/pic.svg')
      .expect('Content-Type', /image\/svg\+xml/)
      .end(done));

  it('GET /doc.pdf - application/pdf Content-Type', (done) =>
    request(server)
      .get('/doc.pdf')
      .expect('Content-Type', /application\/pdf/)
      .end(done));

  it('GET /doc.doc - application/msword Content-Type', (done) =>
    request(server)
      .get('/doc.doc')
      .expect('Content-Type', /application\/msword/)
      .end(done));

  it('GET /index - text/plain Content-Type', (done) =>
    request(server)
      .get('/index')
      .expect('Content-Type', /text\/plain/)
      .end(done));
});
