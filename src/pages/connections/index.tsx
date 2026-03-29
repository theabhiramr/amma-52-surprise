import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

type Group = {
  category: string;
  items: string[];
  level: 1 | 2 | 3 | 4; // 1: Easy (Yellow), 2: Medium (Green), 3: Hard (Blue), 4: Tricky (Purple)
};

const PUZZLE_DATA: Group[] = [
  {
    category: "SYNONYMS FOR GO",
    items: ["EMBARK", "MOVE", "PROCEED", "ADVANCE"],
    level: 1,
  },
  {
    category: "RELATED TO HUMAN RESOURCES",
    items: ["CLAIM", "PERFORMANCE", "INVESTIGATION", "SCREEN"],
    level: 2,
  },
  {
    category: "THINGS THAT ARE YOURS",
    items: ["ID", "FINGERPRINT", "LIFE", "RIGHTS"],
    level: 3,
  },
  {
    category: "REPRESNTED AS 'TO'",
    items: ["TORONTO", "TIMEOUT", "AND", "TONGA"],
    level: 4,
  },
];

const LEVEL_COLORS = {
  1: "#f9df6d", // Yellow
  2: "#a0c35a", // Green
  3: "#b0c4ef", // Blue
  4: "#ba81c5", // Purple
};

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function Toast({
  message,
  isVisible,
}: {
  message: string;
  isVisible: boolean;
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-black text-white rounded font-bold shadow-lg"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ConnectionsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [solvedGroups, setSolvedGroups] = useState<Group[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [shake, setShake] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [animatingGroup, setAnimatingGroup] = useState<Group | null>(null);
  const [previousGuesses, setPreviousGuesses] = useState<string[][]>([]);

  useEffect(() => {
    // Shuffle items on mount
    const allItems = PUZZLE_DATA.flatMap((g) => g.items);
    setItems(shuffleArray(allItems));
  }, []);

  const showToastMessage = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleSelect = (item: string) => {
    if (gameOver) return;
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else {
      if (selected.length < 4) {
        setSelected([...selected, item]);
      }
    }
  };

  const handleSubmit = () => {
    if (selected.length !== 4) return;

    // Check if already guessed
    const sortedSelection = [...selected].sort();
    const isAlreadyGuessed = previousGuesses.some(
      (guess) =>
        guess.length === 4 &&
        guess.every((item, i) => item === sortedSelection[i]),
    );

    if (isAlreadyGuessed) {
      showToastMessage("Already guessed!");
      return;
    }

    setPreviousGuesses([...previousGuesses, sortedSelection]);

    const group = PUZZLE_DATA.find((g) =>
      selected.every((item) => g.items.includes(item)),
    );

    if (group) {
      setAnimatingGroup(group);

      // Rearrange items so the correct ones are at the top
      const newItems = [...items];
      const selectedIndices = selected.map((item) => newItems.indexOf(item));

      // Sort selected items to move to top positions
      selectedIndices.sort((a, b) => a - b);

      // Move each selected item to the corresponding top position
      selectedIndices.forEach((originalIndex, i) => {
        if (originalIndex !== i) {
          const item = newItems[originalIndex];
          newItems.splice(originalIndex, 1);
          newItems.splice(i, 0, item);
        }
      });

      setItems(newItems);
      setSelected([]);

      setTimeout(() => {
        setSolvedGroups((prev) => [...prev, group]);
        setItems(newItems.filter((item) => !group.items.includes(item)));
        setAnimatingGroup(null);
      }, 1200);
    } else {
      // Check for "One away"
      const isOneAway = PUZZLE_DATA.some((g) => {
        const matchCount = selected.filter((item) =>
          g.items.includes(item),
        ).length;
        return matchCount === 3;
      });

      if (isOneAway) {
        showToastMessage("One away!");
      } else {
        showToastMessage("Incorrect");
      }

      setShake(true);
      setTimeout(() => setShake(false), 500);

      setMistakes((prev) => prev + 1);
      if (mistakes + 1 >= 4) {
        setGameOver(true);
        setSelected([]);
      }
    }
  };

  const handleShuffle = () => {
    setItems((prev) => shuffleArray(prev));
  };

  const handleDeselectAll = () => {
    setSelected([]);
  };

  useEffect(() => {
    if (gameOver && solvedGroups.length < 4 && !animatingGroup) {
      const timer = setTimeout(() => {
        const nextGroup = PUZZLE_DATA.find(
          (g) => !solvedGroups.some((sg) => sg.category === g.category),
        );
        if (nextGroup) {
          setAnimatingGroup(nextGroup);

          // Rearrange items so the correct ones are at the top
          const newItems = [...items];
          const groupIndices = nextGroup.items.map((item) =>
            newItems.indexOf(item),
          );

          // Sort indices to move to top positions
          groupIndices.sort((a, b) => a - b);

          // Move each item to the corresponding top position
          groupIndices.forEach((originalIndex, i) => {
            if (originalIndex !== i) {
              const item = newItems[originalIndex];
              newItems.splice(originalIndex, 1);
              newItems.splice(i, 0, item);
            }
          });

          setItems(newItems);

          setTimeout(() => {
            setSolvedGroups((prev) => [...prev, nextGroup]);
            setItems((prev) =>
              prev.filter((item) => !nextGroup.items.includes(item)),
            );
            setAnimatingGroup(null);
          }, 600);
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [gameOver, solvedGroups, animatingGroup, items]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-24 bg-zinc-50 text-zinc-900">
      <Toast message={toastMessage} isVisible={showToast} />
      <h1 className="text-4xl font-bold mb-8">Connections</h1>

      {solvedGroups.length === 4 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 flex flex-col items-center gap-4"
        >
          <button
            onClick={() => navigate("/success")}
            className="px-6 py-3 bg-black text-white rounded-full font-bold text-xl hover:scale-105 transition-transform inline-block animate-bounce"
          >
            See your clue →
          </button>
          {gameOver ? (
            <p className="text-lg font-medium text-zinc-600">
              It's okay, Amma ❤️
            </p>
          ) : (
            <p className="text-lg font-medium text-zinc-600">Great job! 🎉</p>
          )}
        </motion.div>
      )}

      <div className="w-full max-w-2xl flex flex-col gap-4 mb-8">
        {solvedGroups.map((group) => (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            key={group.category}
            className="p-4 rounded-lg text-center h-20 flex flex-col items-center justify-center"
            style={{ backgroundColor: LEVEL_COLORS[group.level] }}
          >
            <h3 className="font-bold text-lg">{group.category}</h3>
            <p>{group.items.join(", ")}</p>
          </motion.div>
        ))}

        <motion.div className="relative grid grid-cols-4 gap-2 md:gap-4">
          {animatingGroup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute top-0 left-0 w-full z-10 p-2 md:p-4 rounded-lg text-center flex flex-col items-center justify-center"
              style={{
                backgroundColor: LEVEL_COLORS[animatingGroup.level],
                height: "80px",
              }}
            >
              <h3 className="font-bold text-sm md:text-lg">
                {animatingGroup.category}
              </h3>
              <p className="text-xs md:text-base">
                {animatingGroup.items.join(", ")}
              </p>
            </motion.div>
          )}

          {items.map((item, index) => {
            const isAnimating = animatingGroup?.items.includes(item);
            const isInTopRow = index < 4;
            const shouldHide = isAnimating && isInTopRow;

            return (
              <motion.button
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: shouldHide ? 0 : 1,
                  scale: 1,
                  x:
                    shake && selected.includes(item)
                      ? [-10, 10, -10, 10, 0]
                      : 0,
                }}
                transition={{
                  layout: { duration: 0.5, ease: "easeInOut" },
                  opacity: { duration: 0.2, delay: shouldHide ? 0.5 : 0 },
                  x: { duration: 0.4 },
                }}
                key={item}
                onClick={() => !isAnimating && handleSelect(item)}
                className={`
                  h-16 md:h-20 rounded-lg font-bold transition-colors text-[10px] md:text-base p-1 break-words leading-tight
                  ${
                    selected.includes(item)
                      ? "bg-zinc-800 text-white"
                      : "bg-zinc-200 hover:bg-zinc-300"
                  }
                `}
                style={{
                  cursor: isAnimating ? "default" : "pointer",
                  pointerEvents: shouldHide ? "none" : "auto",
                }}
              >
                {item}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <div className="flex gap-4 mb-8 mt-8">
        <div className="flex items-center gap-2">
          <span>Mistakes remaining:</span>
          <div className="flex gap-1">
            {Array.from({ length: 4 - mistakes }).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-zinc-500"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleShuffle}
          className="px-6 py-2 rounded-full border border-zinc-300 hover:bg-zinc-100"
        >
          Shuffle
        </button>
        <button
          onClick={handleDeselectAll}
          className="px-6 py-2 rounded-full border border-zinc-300 hover:bg-zinc-100"
        >
          Deselect All
        </button>
        <button
          onClick={handleSubmit}
          disabled={selected.length !== 4}
          className="px-6 py-2 rounded-full bg-black text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
