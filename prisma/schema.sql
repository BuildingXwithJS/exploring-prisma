CREATE TABLE "public"."User" (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255)
);
CREATE TABLE "public"."Post" (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  content TEXT,
  "authorId" INTEGER NOT NULL,
  FOREIGN KEY ("authorId") REFERENCES "public"."User"(id)
);
CREATE TABLE "public"."Comment" (
  id SERIAL PRIMARY KEY NOT NULL,
  content TEXT,
  "userId" INTEGER UNIQUE NOT NULL,
  "postId" INTEGER UNIQUE NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "public"."User"(id),
  FOREIGN KEY ("postId") REFERENCES "public"."Post"(id)
);
