import BlendItLogo from "@/assets/icons/logo";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div className="w-full">
            <footer className="relative z-10 w-full  px-4 py-16 transition-colors duration-500 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-screen-xl">
                    <div
                        className="flex flex-col items-center gap-4 rounded-lg bg-white dark:bg-orange-700 p-6 shadow-lg sm:flex-row sm:justify-between"
                    >
                        <strong className="text-xl text-black dark:text-white sm:text-xl"> Make the Most of Your Time </strong>

                        <Link 
                            className="inline-flex items-center gap-2 rounded-full border border-black dark:border-white bg-black dark:bg-white px-8 py-3 text-white dark:text-black dark:hover:bg-orange-500 hover:text-black dark:hover:text-white focus:ring-3 focus:outline-hidden"
                            to={"/render"}
                        >
                            <span className="text-sm font-medium">Start Blending</span>
                            <svg
                                className="size-5 shadow-sm rtl:rotate-180"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </Link>
                    </div>

                    <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="text-center sm:text-left">
                            <p className="text-lg font-medium text-black dark:text-white">About Us</p>

                            <ul className="mt-8 space-y-4 text-sm">
                                <li>
                                    <a className="text-gray-700 dark:text-gray-300 transition hover:text-gray-900 dark:hover:text-gray-100" href="#">
                                        Our Story
                                    </a>
                                </li>

                                <li>
                                    <a className="text-gray-700 dark:text-gray-300 transition hover:text-gray-900 dark:hover:text-gray-100" href="#"> Team </a>
                                </li>

                                <li>
                                    <a className="text-gray-700 dark:text-gray-300 transition hover:text-gray-900 dark:hover:text-gray-100" href="#"> Careers </a>
                                </li>
                            </ul>
                        </div>

                        <div className="text-center sm:text-left">
                            <p className="text-lg font-medium text-black dark:text-white">Services</p>

                            <ul className="mt-8 space-y-4 text-sm">
                                <li>
                                    <a className="text-gray-700 dark:text-gray-300 transition hover:text-gray-900 dark:hover:text-gray-100" href="#">
                                        3D Rendering
                                    </a>
                                </li>

                                <li>
                                    <a className="text-gray-700 dark:text-gray-300 transition hover:text-gray-900 dark:hover:text-gray-100" href="#"> AI Image Generation </a>
                                </li>

                                <li>
                                    <a className="text-gray-700 dark:text-gray-300 transition hover:text-gray-900 dark:hover:text-gray-100" href="#"> Tutorials </a>
                                </li>
                            </ul>
                        </div>

                        <div className="text-center sm:text-left">
                            <p className="text-lg font-medium text-black dark:text-white">Resources</p>

                            <ul className="mt-8 space-y-4 text-sm">
                                <li>
                                    <a className="text-gray-700 dark:text-gray-300 transition hover:text-gray-900 dark:hover:text-gray-100" href="#"> Documentation </a>
                                </li>

                                <li>
                                    <a className="text-gray-700 dark:text-gray-300 transition hover:text-gray-900 dark:hover:text-gray-100" href="#">
                                        Community Forum
                                    </a>
                                </li>

                                <li>
                                    <a className="text-gray-700 dark:text-gray-300 transition hover:text-gray-900 dark:hover:text-gray-100" href="#"> Blog </a>
                                </li>
                            </ul>
                        </div>

                        <div className="text-center sm:text-left">
                            <p className="text-lg font-medium text-black dark:text-white">Support</p>

                            <ul className="mt-8 space-y-4 text-sm">
                                <li>
                                    <a className="text-gray-700 dark:text-gray-300 transition hover:text-gray-900 dark:hover:text-gray-100" href="#"> Help Center </a>
                                </li>

                                <li>
                                    <a className="text-gray-700 dark:text-gray-300 transition hover:text-gray-900 dark:hover:text-gray-100" href="#"> Contact Us </a>
                                </li>

                                <li>
                                    <a
                                        className="group flex justify-center gap-1.5 ltr:sm:justify-start rtl:sm:justify-end"
                                        href="#"
                                    >
                                        <span className="text-gray-700 dark:text-gray-300 transition group-hover:text-gray-900 dark:hover:text-gray-100"> Live Chat </span>

                                        <span className="relative flex size-2">
                                            <span
                                                className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"
                                            ></span>
                                            <span className="relative inline-flex size-2 rounded-full bg-teal-500"></span>
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-16">
                        <ul className="flex justify-center gap-6 sm:justify-end">
                            {/* Social icons unchanged */}
                        </ul>

                        <div className="mt-16 sm:flex sm:items-center sm:justify-between">
                            <div className="flex justify-center text-orange-600 sm:justify-start">
                                <BlendItLogo/>
                            </div>

                            <p className="mt-4 text-center text-sm text-gray-500 sm:mt-0 sm:text-right">
                                Copyright &copy; 2025 BlendIt. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
