import Link from 'next/link';

export default function Comment({ comment }) {
  return (
    <div className="m-4 p-2 shadow-lg">
      <p className="py-2 text-base">{comment.content}</p>
      <div className="text-sm">
        Posted by{' '}
        <Link href={`/user/${comment.User.id}`}>
          <a className="text-blue-600">{comment.User.name}</a>
        </Link>
      </div>
    </div>
  );
}
