'use client'
import Link from "next/link";
import ThemeSwitch from "../buttons/ThemeSwitch";
import { useAppSelector } from "@/app/store";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
export default function Header() {
    const projectState = useAppSelector((state) => state.projectState);
    const pathname = usePathname();
    const [title, setTitle] = useState('ClipJS');

    useEffect(() => {
        const title = pathname.startsWith("/projects/") ? projectState?.projectName || 'ClipJS' : 'ClipJS';
        setTitle(title);
    }, [pathname, projectState?.projectName]);

    return (
        <header className="bg-black border-b border-gray-800 dark:bg-black shadow-sm dark:border-b dark:border-gray-800">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <span className="text-3xl dark:text-gray-100">{title}</span>
                </div>
                <nav className="flex items-center">
                    <ul className="flex space-x-2 mr-2">
                        <li>
                            <Link
                                href="/"
                                className="text-md text-white-800 dark:text-white hover:text-gray-800 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/projects"
                                className="text-md text-white-800 dark:text-white hover:text-gray-800 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                Projects
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/about"
                                className="text-md text-white-800 dark:text-white hover:text-gray-800 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                About Me
                            </Link>
                        </li>
                    </ul>
                    {/* <ThemeSwitch /> */}
                </nav>
            </div>
        </header>
    );
}
