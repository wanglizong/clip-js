"use client";
import Link from 'next/link';
// import { deletePost, State, updateServer } from '../lib/actions'
import { useRouter } from "next/navigation";
import { Trash2, Pencil, Eye, PlusCircle } from "lucide-react";
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

// export function DeletePost({ id }: { id: string }) {
//   const initialState: State = { message: '', success: false };
//   const deletePostWithId = deletePost.bind(null, id);
//   const [state, formAction] = useActionState(deletePostWithId, initialState);
//   useEffect(() => {
//     if (state.message) {
//       if (state.success) {
//         toast.success(state.message);
//         updateServer();
//       }
//       else {
//         toast.error(`${state.message}`);
//       }
//     }
//   }, [state.message, state.success]);

//   return (
//     <form action={formAction}>
//       <button type="submit"
//         className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
//       >
//         <Trash2 size={20} />
//       </button>
//     </form>
//   );
// }

export function BlackButton({ text }: { text: string }) {
  return (
    <a
      className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
      href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
      target="_blank"
      rel="noopener noreferrer"
    >
      {/* <Image
        className="dark:invert"
        src="/vercel.svg"
        alt="Vercel logomark"
        width={20}
        height={20}
      /> */}
      {text}
    </a>
  )
}

export function WhiteButton({ text }: { text: string }) {
  return (
    <a
      className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
      href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
      target="_blank"
      rel="noopener noreferrer"
    >
      {text}
    </a>
  )
}
<div className="flex gap-4 items-center flex-col sm:flex-row">


</div>


export function ViewPost({ id }: { id: string }) {
  return (
    <Link href="/blog/[id]" as={`/blog/${id}`}
      className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
    >
      <Eye size={20}></Eye>
    </Link>
  );
}

export function AdminViewPost({ id }: { id: string }) {
  return (
    <Link href="/admin/blog/[id]" as={`/admin/blog/${id}`}
      className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
    >
      <Eye size={20}></Eye>
    </Link>
  );
}

export function Back() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
    >
      Back
    </button>
  );
}

export function PreviousPage() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className='flex justiy-center items-center px-5 py-2 text-xl rounded-md text-black border border-indigo-500 hover:bg-indigo-500 hover:text-white'
    >
      Previous Page
    </button>
  );
}

export function Home() {
  return (
    <Link href="/" as={`/`}
      className='flex justiy-center items-center px-5 py-2 text-xl rounded-md text-black border border-green-500 hover:bg-green-500 hover:text-white'>
      Home Page
    </Link>
  );
}


export function EditPost({ id }: { id: string }) {
  return (
    <Link href="/admin/blog/[title]/edit" as={`/admin/blog/${id}/edit`}
      className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded"
    >
      <Pencil size={20} />
    </Link>
  );
}

export function CreatePost() {
  return (
    <Link href="/admin/blog/create" as={`/admin/blog/create`}
      className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded flex items-center gap-2"
    >
      <PlusCircle size={20} />
      Create New Blog
    </Link>
  );
}