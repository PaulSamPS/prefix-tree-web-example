import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

interface AutocompleteInputProps {
  placeholder: string;
  onInputChange: (value: string) => void;
  suggestions: string[];
  onSuggestionSelect: (suggestion: string) => void;
  value: string;
  onClear: () => void;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  placeholder,
  onInputChange,
  suggestions,
  onSuggestionSelect,
  value,
  onClear,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const justSelectedRef = useRef(false); // Используем ref вместо state

  useEffect(() => {
    if (justSelectedRef.current) {
      // Блокируем отображение после выбора
      setShowSuggestions(false);
      justSelectedRef.current = false; // Сбрасываем флаг
    } else {
      // Стандартная логика отображения
      setShowSuggestions(suggestions.length > 0 && value.length > 0);
    }
    setSelectedIndex(-1);
  }, [suggestions, value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          justSelectedRef.current = true; // Устанавливаем флаг перед вызовом
          onSuggestionSelect(suggestions[selectedIndex]);
          setShowSuggestions(false);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    justSelectedRef.current = true; // Устанавливаем флаг перед вызовом
    onSuggestionSelect(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm outline-0"
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                index === selectedIndex
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
