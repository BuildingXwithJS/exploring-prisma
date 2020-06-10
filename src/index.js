const fastify = require('fastify');
const fastifyCookie = require('fastify-cookie');
const fastifySession = require('fastify-session');
const Next = require('next');
const { setupRoutes } = require('./routes.js');

const dev = process.env.NODE_ENV !== 'production';

const main = async () => {
  // setup nextjs
  const app = Next({ dev });
  const handle = app.getRequestHandler();
  await app.prepare();

  // create fastify instance
  const server = fastify();

  // setup middlewares
  server.register(fastifyCookie);
  server.register(fastifySession, {
    cookieName: 'sessionId',
    secret: 'a secret with minimum length of 32 characters',
    cookie: { secure: false },
    expires: 1800000,
  });

  // register routes
  server.register(setupRoutes, { prefix: '/api' });

  // handle all out routes with next.js
  if (dev) {
    server.get('/_next/*', (req, reply) => {
      return handle(req.req, reply.res).then(() => {
        reply.sent = true;
      });
    });
  }

  server.all('/*', (req, reply) => {
    return handle(req.req, reply.res).then(() => {
      reply.sent = true;
    });
  });

  // wait for all middlewares to be ready
  await server.ready();

  server.listen(8080, () => {
    console.log('Listening on :8080');
  });
};

main();
