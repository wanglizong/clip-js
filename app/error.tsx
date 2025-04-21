"use client";
import { startTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({ error, reset }: { error: Error, reset: () => void }) {
    const router = useRouter();
    const Reload = () => {
        startTransition(() => {
            router.refresh();
            reset();
        })
    }
    console.log(error);
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <p className='text-3xl font-semibold text-center'>Something went wrong !</p>
            <br />
            <button
                className='flex justiy-center items-center px-5 py-2 text-xl rounded-md text-black border border-indigo-500 hover:bg-indigo-500 hover:text-white'
                onClick={
                    () => Reload()
                }
            >
                Try again
            </button>
        </div>
    );
}