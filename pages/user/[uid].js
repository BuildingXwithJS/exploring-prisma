import { useMemo } from 'react';
import Post from '../../components/post';

// This function gets called at build time
export async function getStaticPaths() {
  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths: [{ params: { uid: '5' } }], fallback: false };
}

export async function getStaticProps({ params }) {
  const id = params.uid;
  const user = await fetch(
    `http://localhost:8080/api/profile/${id}`
  ).then((res) => res.json());

  return {
    props: { user }, // will be passed to the page component as props
  };
}

export default function UserPage({ user }) {
  const posts = useMemo(() =>
    user.Post.map((post) => ({
      ...post,
      User: { id: user.id, name: user.name },
    }))
  );
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col">
        <div className="m-4 p-2 shadow-lg">
          <h1 className="text-xl">{user?.name}</h1>
          <p className="py-2 text-base">{user?.email}</p>

          <h2 className="text-lg py-2">User posts:</h2>

          <div className="flex flex-col">
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
