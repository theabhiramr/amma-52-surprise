import { useState } from "react";
import { motion } from "framer-motion";

export default function SuccessPage() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-300 to-purple-300">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Congratulations! Here is your next clue:
      </h1>
      <div
        className="relative w-48 h-48 cursor-pointer"
        onClick={() => setFlipped(!flipped)}
      >
        <motion.div
          className="absolute inset-0 bg-pink-500 rounded-sm shadow-md p-6 flex flex-col items-center justify-center"
          initial={false}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ backfaceVisibility: "hidden" }}
        >
          <p className="text-8xl font-bold text-gray-700 leading-none">O</p>
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-pink-500 rounded-sm shadow-md p-6 flex flex-col items-center justify-center"
          initial={false}
          animate={{ rotateY: flipped ? 0 : -180 }}
          transition={{ duration: 0.6 }}
          style={{ backfaceVisibility: "hidden", rotateY: 180 }}
        >
          <p className="text-2xl text-gray-700 text-center leading-tight">
            Go to your <span className="text-4xl font-bold">O</span>ffice
          </p>
        </motion.div>
      </div>
      <p className="mt-4 text-gray-600 text-sm">Click the card to flip</p>
    </div>
  );
}
