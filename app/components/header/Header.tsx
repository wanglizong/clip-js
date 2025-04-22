import Link from "next/link";
import ThemeSwitch from "../buttons/ThemeSwitch";
export default function Header() {
    return (
        <header className="bg-black border-b border-gray-800 shadow-sm dark:bg-black shadow-sm dark:border-b dark:border-gray-800">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <span className="text-3xl dark:text-gray-100">ClipJS</span>
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
                                href="/contact"
                                className="text-md text-white-800 dark:text-white hover:text-gray-800 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                Contact Me
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/contact"
                                className="text-md text-white-800 dark:text-white hover:text-gray-800 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                Log out
                            </Link>
                        </li>
                    </ul>
                    {/* <ThemeSwitch /> */}
                </nav>
            </div>
        </header>
    );
}
