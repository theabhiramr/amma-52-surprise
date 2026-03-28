export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-300 to-purple-300">
      <h1 className="text-4xl font-bold text-white mb-4">Congratulations!</h1>
      <p className="text-lg text-white mb-8">
        You've successfully completed the crossword puzzle.
      </p>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-800 text-5xl font-semibold mb-4"> O </p>
        <p className="text-gray-800 text-sm font-semibold mb-4">
          {" "}
          Go to your office{" "}
        </p>
      </div>
    </div>
  );
}
