import * as http from 'http';
import * as url from 'url';
import * as path from 'path';
import { promises as fs } from 'fs';

import Serverless = require('serverless');

interface ContentTypeMap {
  readonly [key: string]: string;
}

const fileExtToContentTypeMap: ContentTypeMap = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
};

const handler =
  (folder: string) =>
  async (req: http.IncomingMessage, res: http.ServerResponse) => {
    try {
      const parsedUrl = url.parse(String(req.url));
      const pathname = path.join(folder, String(parsedUrl.pathname));

      const { ext } = path.parse(pathname);

      const data = await fs.readFile(pathname);
      res.setHeader(
        'Content-Type',
        fileExtToContentTypeMap[ext] || 'text/plain'
      );
      return res.end(data);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        res.statusCode = 404;
        return res.end(`File not found`);
      }

      res.statusCode = 500;
      return res.end(`Error getting the file: ${error}.`);
    }
  };

interface PluginSettings {
  folder: string;
  port: number;
}

export default (serverless: Serverless, { folder, port }: PluginSettings) =>
  new Promise((resolve) => {
    const requestHandler = handler(folder);
    const server = http.createServer(requestHandler);
    server.listen(port, () => {
      serverless.cli.log(
        `[ Static ] serving static files from ${folder} folder`
      );
      serverless.cli.log(
        `[ Static ] serving static files on http://localhost:${port}`
      );
      resolve(server);
    });
  });
