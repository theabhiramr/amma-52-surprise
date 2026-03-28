export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-300 to-purple-300">
      <h1 className="text-4xl font-bold text-white mb-4">Congratulations!</h1>
      <p className="text-lg text-white mb-8">You've successfully completed the crossword puzzle.</p>
      <a
        href="/connections"
        className="px-6 py-3 bg-black text-white rounded-full font-bold text-xl hover:scale-105 transition-transform inline-block animate-bounce"
      >
        View Your Connections →
      </a>
    </div>
  );
}