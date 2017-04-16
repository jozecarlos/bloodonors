import express from 'express';
import { Server } from 'http';
import bodyParser from 'body-parser';
import path from 'path';
import compression from 'compression';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import App from '../client/App';
import template from '../client/template';
import routes from '../client/routes';

import donors from './routes/donor.routes';

// Webpack Requirements
import webpack from 'webpack';
import serverConfig from './config';
import config from '../webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { socket } from './socket';
import { database } from './database';


const app =  express();
const server = Server(app);

// Run Webpack dev server in development mode
if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}
// Apply body Parser and server public assets and routes
app.use(compression());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(express.static(path.resolve(__dirname, '../dist')));
app.use('/images', express.static(__dirname + '/images'));
app.use('/api', donors);

// Server Side Rendering based on routes matched by React-router.
app.use((req, res, next) => {
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
    res.send(template({
      body: appString,
     title: 'Hello World from the server'
    }));
  });
});
// start app
server.listen(serverConfig.port, (error) => {
  if (!error) {
    console.log(`Bloodonors is running on port: ${serverConfig.port}! Build something amazing!`); // eslint-disable-line
  }
});

socket.init(server);

export default server;
