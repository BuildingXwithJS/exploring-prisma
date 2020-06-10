import Link from 'next/link';

export default function Post({ post }) {
  return (
    <div className="m-4 p-2 shadow-lg">
      <Link href={`/post/${post.id}`}>
        <a className="text-lg text-blue-400 mb-2">{post.title}</a>
      </Link>
      <p className="py-2 text-base">{post.content}</p>
      <p className="pb-2 text-sm opacity-50">
        Link: <a href={post.url}>{post.url}</a>
      </p>
      <div className="text-sm">
        Created by{' '}
        <Link href={`/user/${post.User.id}`}>
          <a className="text-blue-600">{post.User.name}</a>
        </Link>
      </div>
    </div>
  );
}
