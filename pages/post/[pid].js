import { useCallback, useRef, useState } from 'react';
import Comment from '../../components/comment';
import Post from '../../components/post';

// This function gets called at build time
export async function getStaticPaths() {
  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths: [{ params: { pid: '1' } }], fallback: false };
}

export async function getStaticProps({ params }) {
  const id = params.pid;
  const post = await fetch(`http://localhost:8080/api/post/${id}`).then((res) =>
    res.json()
  );

  return {
    props: { post }, // will be passed to the page component as props
  };
}

export default function PostPage({ post }) {
  const [comments, setComments] = useState(() => {
    if (!post?.Comment) {
      return [];
    }
    if (Array.isArray(post.Comment)) {
      return post.Comment;
    }

    return [post.Comment];
  });
  const contentRef = useRef();

  const createComment = useCallback(() => {
    const content = contentRef.current.value;

    fetch(`/api/post/${post.id}/comment`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ content }),
    })
      .then((res) => res.json())
      .then((comment) =>
        setComments((comments) => [
          { ...comment, User: JSON.parse(window.localStorage.getItem('user')) },
          ...comments,
        ])
      );
  }, []);

  return (
    <div className="flex flex-col flex-1">
      <Post post={post} />

      <div className="flex flex-col">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>

      <div className="flex flex-col m-4">
        <h2 className="font-semibold my-2">Add comment:</h2>
        <textarea
          className="my-2 p-1 border border-1 rounded-lg"
          placeholder="Context"
          ref={contentRef}
        ></textarea>
        <button className="bg-blue-500 p-2 text-white" onClick={createComment}>
          Post comment
        </button>
      </div>
    </div>
  );
}
