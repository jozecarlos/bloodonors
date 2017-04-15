import express from 'express';
import { Server } from 'http';
import bodyParser from 'body-parser';
import path from 'path';
import compression from 'compression';
import React from 'react';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpack from 'webpack';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import donors from './routes/donor.routes';
import config from '../webpack.config.dev';
import template from '../client/template';
import routes from '../client/routes';
import serverConfig from './config';


class WebServer {

  constructor() {
    this._app = express();
    this._http = Server(this._app);
  }

  start = () => {
    this._init();
    this._http.listen(serverConfig.port, (error) => {
      if (!error) {
        console.log(`MERN is running on port: ${serverConfig.port}! Build something amazing!`); // eslint-disable-line
      }
    });
  }

  _init = async() => {
    if (process.env.NODE_ENV === 'development') {
      const compiler = webpack(config);
      this._app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
      this._app.use(webpackHotMiddleware(compiler));
    }
    this._app.use(compression());
    this._app.use(bodyParser.json({ limit: '20mb' }));
    this._app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
    this._app.use(express.static(path.resolve(__dirname, '../dist')));

    await this._routes();
    await this._setInitalView();
  }

  _setInitalView = async() => {
    this._app.use((req, res, next) => {
      match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
        if (err) {
          return res.status(500);
        }

        if (redirectLocation) {
          return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        }

        if (!renderProps) {
          return next();
        }

        const appString = renderToString(<RouterContext {...renderProps} />);

        return res.send(template({
          body: appString,
          title: 'Hello World from the server',
        }));
      });
    });
  }

  _routes = async() => {
    this._app.use('/api', donors);
  }

  listen = () => {
    return this._http.listen;
  }

  getHttp = () => {
    return this._http;
  }
}

export const server = new WebServer();
