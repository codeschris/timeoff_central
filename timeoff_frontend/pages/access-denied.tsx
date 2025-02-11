"use client";

import { motion } from "framer-motion";

export default function AccessDenied() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            {/* Pinging Node */}
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-red-600 rounded-full"></div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-red-600 rounded-full animate-ping opacity-50"></div>
                </div>
            </div>

            <motion.h1
                className="mx-4 mt-6 text-3xl md:text-5xl font-bold text-red-500"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                You&apos;re Not Authorized
            </motion.h1>

            <motion.p
                className="mx-4 mt-10 text-lg md:mx-64 md:text-xl text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                Please contact Support/HR if you believe this is a mistake. <b><b>Note: You should be around the work premises, using the work network, to access the platform.</b></b> Thank you.
            </motion.p>
        </div>
    );
}