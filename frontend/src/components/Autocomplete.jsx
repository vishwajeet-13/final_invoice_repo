import { useState } from "react";

export default function Autocomplete({ options, onSelect }) {
  const [input, setInput] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [showList, setShowList] = useState(false);

  const filteredOptions = input
    ? [...new Set(options)].filter(
        (opt) =>
          opt.toLowerCase().startsWith(input.toLowerCase()) &&
          opt.toLowerCase() !== input.toLowerCase()
      )
    : [...new Set(options)].filter(
        (opt) => opt.toLowerCase() !== input.toLowerCase()
      );

  const handleSelect = (value) => {
    setInput(value);
    setShowList(false);
    onSelect?.(value);
  };

  const handleKey = (e) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
    } else if (e.key === "ArrowUp") {
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(filteredOptions[activeIndex]);
    } else if (e.key === "Escape") {
      setShowList(false);
    }
  };

  const renderHighlightedText = (option) => {
    const matchLength = input.length;
    const match = option.slice(0, matchLength);
    const rest = option.slice(matchLength);
    return (
      <>
        <strong>{match}</strong>
        {rest}
      </>
    );
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setActiveIndex(0);
          setShowList(true);
        }}
        onKeyDown={handleKey}
        onFocus={() => setShowList(true)}
        onBlur={() => setTimeout(() => setShowList(false), 150)}
        className="bg-[#232323] w-full rounded-md py-1 px-3 outline-none transition-all duration-200 focus:shadow-lg text-white"
        autoComplete="off"
      />

      {showList && filteredOptions.length > 0 && (
        <ul className="absolute left-0 right-0 z-10 mt-1 bg-[#232323] rounded-md shadow-lg max-h-48 overflow-auto border border-gray-600">
          {filteredOptions.map((opt, i) => (
            <li
              key={opt}
              className={`px-3 py-2 cursor-pointer transition-colors ${
                i === activeIndex
                  ? "bg-gray-700 text-white"
                  : "text-gray-200 hover:bg-gray-800"
              }`}
              onMouseDown={() => handleSelect(opt)}
              onMouseEnter={() => setActiveIndex(i)}
            >
              {renderHighlightedText(opt)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
