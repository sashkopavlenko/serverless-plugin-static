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

  it('GET /not-exists - 404 status code', () =>
    request(server).get('/not-exists').expect(404));

  it('GET /favicon.ico - 200 status code', () =>
    request(server).get('/favicon.ico').expect(200));

  it('GET /index.html - text/html Content-Type', () =>
    request(server)
      .get('/index.html')
      .expect('Content-Type', /text\/html/));

  it('GET /index.js - text/javascript response', async () => {
    const response = await request(server).get('/index.js');
    expect(response.text).toBe('text/javascript');
  });

  it('GET /denied - 500 status code', () =>
    request(server).get('/denied').expect(500));

  it('GET /denied - 500 status code', () =>
    request(server).get('/denied').expect(500));

  it('GET /index - text/plain Content-Type', () =>
    request(server)
      .get('/index')
      .expect('Content-Type', /text\/plain/));

  it('GET /file.json - application/json Content-Type', () =>
    request(server)
      .get('/file.json')
      .expect('Content-Type', /application\/json/));

  it('GET /file.css - text/css Content-Type', () =>
    request(server)
      .get('/file.css')
      .expect('Content-Type', /text\/css/));

  it('GET /image.png - image/png Content-Type', () =>
    request(server)
      .get('/image.png')
      .expect('Content-Type', /image\/png/));

  it('GET /image.jpg - image/jpeg Content-Type', () =>
    request(server)
      .get('/image.jpg')
      .expect('Content-Type', /image\/jpeg/));

  it('GET /audio.wav - audio/wav Content-Type', () =>
    request(server)
      .get('/audio.wav')
      .expect('Content-Type', /audio\/wav/));

  it('GET /audio.mp3 - audio/mpeg Content-Type', () =>
    request(server)
      .get('/audio.mp3')
      .expect('Content-Type', /audio\/mpeg/));

  it('GET /pic.svg - image/svg+xml Content-Type', () =>
    request(server)
      .get('/pic.svg')
      .expect('Content-Type', /image\/svg\+xml/));

  it('GET /doc.pdf - application/pdf Content-Type', () =>
    request(server)
      .get('/doc.pdf')
      .expect('Content-Type', /application\/pdf/));

  it('GET /doc.doc - application/msword Content-Type', () =>
    request(server)
      .get('/doc.doc')
      .expect('Content-Type', /application\/msword/));

  it('GET /index - text/plain Content-Type', () =>
    request(server)
      .get('/index')
      .expect('Content-Type', /text\/plain/));
});
