const { prisma } = require('./prisma.js');

const hashPassword = (pass) => pass;

const setupAuth = (fastify, opts, done) => {
  fastify.post('/register', async (req, reply) => {
    const { email, name, password } = req.body;

    const hashedPassword = hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const { password: _pass, ...user } = newUser;

    req.session.user = user;
    return user;
  });

  fastify.post('/login', async (req, reply) => {
    const { email, password } = req.body;

    const hashedPassword = hashPassword(password);

    const user = await prisma.user.findOne({
      where: {
        email,
      },
    });

    const { password: userPass, ...userData } = user;

    if (userPass != hashedPassword) {
      reply.code(401).send({ error: 'User not found.' });
      return;
    }

    req.session.user = userData;
    return userData;
  });

  done();
};

const setupPublicRoutes = (fastify, opts, done) => {
  fastify.get('/home', async () => {
    const posts = await prisma.post.findMany({
      include: {
        User: true,
      },
    });

    return posts;
  });

  fastify.get('/post/:id', async (req) => {
    const post = await prisma.post.findOne({
      where: { id: parseInt(req.params.id) },
      include: {
        User: true,
        Comment: {
          include: {
            User: true,
          },
        },
      },
    });

    return post;
  });

  fastify.get('/profile/:id', async (req) => {
    const user = await prisma.user.findOne({
      where: { id: parseInt(req.params.id) },
      include: {
        Post: true,
      },
    });

    return user;
  });

  done();
};

const setupWriteRoutes = (fastify, opts, done) => {
  fastify.addHook('preHandler', (request, reply, next) => {
    if (!request.session.user) {
      throw new Error('401');
    }

    next();
  });

  fastify.post('/post', async (req) => {
    const { title, url, content } = req.body;

    const newPost = await prisma.post.create({
      data: {
        title,
        url,
        content,
        User: {
          connect: { id: req.session.user.id },
        },
      },
    });

    return newPost;
  });

  fastify.post('/post/:id/comment', async (req) => {
    const { content } = req.body;

    const newComment = await prisma.comment.create({
      data: {
        content,
        User: {
          connect: { id: req.session.user.id },
        },
        Post: {
          connect: { id: parseInt(req.params.id) },
        },
      },
    });

    return newComment;
  });

  done();
};

exports.setupRoutes = (fastify, opts, done) => {
  fastify
    .register(setupAuth)
    .register(setupPublicRoutes)
    .register(setupWriteRoutes);
  done();
};
