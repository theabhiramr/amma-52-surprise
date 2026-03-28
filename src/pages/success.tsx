export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-300 to-purple-300">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Congratulations! Here is your next clue:
      </h1>
      <div className="bg-yellow-200 rounded-sm shadow-md p-6 w-50 aspect-square flex flex-col items-center justify-center rotate-1">
        <p className="text-8xl font-bold text-gray-800 leading-none">O</p>
        <p className="text-sm text-gray-600 mt-1">Go to your office</p>
      </div>
    </div>
  );
}
