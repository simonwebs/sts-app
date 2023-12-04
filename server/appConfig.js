import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import express from 'express';
import compression from 'compression';

Meteor.startup(() => {
  const app = express();

  // Enable compression for all responses
  app.use(compression());

  // Set cache control headers for all static assets
  app.use(express.static('public', {
    maxAge: '1d', // Equivalent to 86400 seconds
    setHeaders: (res, path) => {
      // Set cache-control header for all static files
      res.setHeader('Cache-Control', 'public, max-age=86400');
    },
  }));

  // Setup a middleware for CORS
  const allowedOrigins = ['https://www.thatconnect.com', 'https://thatconnect.com'];
  WebApp.rawConnectHandlers.use((req, res, next) => {
    const origin = req.headers.origin || req.headers.referer;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
    next();
  });

  // Attach the Express app to Meteor's connect handlers
  WebApp.connectHandlers.use(app);
});
