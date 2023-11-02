import { createProxyMiddleware } from 'http-proxy-middleware';
import type {Express} from 'express'

export default function(app:Express){
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    })
  );
};