import { useCallback, useRef, useState } from 'react';
import Post from '../components/post';

export async function getStaticProps(context) {
  const posts = await fetch(`http://localhost:8080/api/home`).then((res) =>
    res.json()
  );

  return {
    props: { posts }, // will be passed to the page component as props
  };
}

export default function HomePage({ posts = [] }) {
  const [allPosts, setAllPosts] = useState(posts);
  const titleRef = useRef();
  const urlRef = useRef();
  const contentRef = useRef();

  const createPost = useCallback(() => {
    const title = titleRef.current.value;
    const url = urlRef.current.value;
    const content = contentRef.current.value;

    fetch('/api/post', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ title, url, content }),
    })
      .then((res) => res.json())
      .then((post) =>
        setAllPosts((posts) => [
          { ...post, User: JSON.parse(window.localStorage.getItem('user')) },
          ...posts,
        ])
      );
  }, []);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col m-4">
        <h2 className="font-semibold my-2">Create post</h2>
        <input
          className="my-2 p-1 border border-1 rounded-lg"
          type="text"
          placeholder="Title"
          ref={titleRef}
        />
        <input
          className="my-2 p-1 border border-1 rounded-lg"
          type="text"
          placeholder="URL"
          ref={urlRef}
        />
        <textarea
          className="my-2 p-1 border border-1 rounded-lg"
          placeholder="Context"
          ref={contentRef}
        ></textarea>
        <button className="bg-blue-500 p-2 text-white" onClick={createPost}>
          Create post
        </button>
      </div>
      <h2>Posts:</h2>
      <div className="flex flex-col">
        {allPosts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
