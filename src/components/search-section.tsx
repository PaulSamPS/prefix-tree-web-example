import React, { useState } from "react";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { AutocompleteInput } from "./autocomplete-input.tsx";
import { tree } from "tree-autocomplete";

interface SearchSectionProps {
  onSearch: (query: string) => void;
  onPhraseSearch: (query: string) => void;
  searchResults: string[];
  phraseResults: string[];
  searchQuery: string;
  phraseQuery: string;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  onSearch,
  onPhraseSearch,
  searchResults,
  phraseResults,
  searchQuery,
  phraseQuery,
}) => {
  const [exactSearchWord, setExactSearchWord] = useState("");
  const [exactSearchPhrase, setExactSearchPhrase] = useState("");
  const [exactWordExists, setExactWordExists] = useState<boolean | null>(null);
  const [exactPhraseExists, setExactPhraseExists] = useState<boolean | null>(
    null,
  );

  const handleExactSearch = (type: "word" | "phrase") => {
    if (type === "word") {
      // Проверка существования слова
      const normalizedWord = exactSearchWord.trim().toLowerCase();
      if (normalizedWord) {
        const result = tree.searchWord(normalizedWord);
        setExactWordExists(result.exists);
      } else {
        setExactWordExists(null);
      }
    } else {
      // Проверка существования фразы
      const normalizedPhrase = exactSearchPhrase.trim().toLowerCase();
      if (normalizedPhrase) {
        const result = tree.searchPhrase(normalizedPhrase);
        setExactPhraseExists(result.exists);
      } else {
        setExactPhraseExists(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Поиск с автодополнением */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[172px]">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            Поиск слов
          </h3>
          <AutocompleteInput
            placeholder="Начните вводить слово..."
            onInputChange={onSearch}
            suggestions={searchResults}
            onSuggestionSelect={(suggestion) => {
              onSearch(suggestion);
            }}
            value={searchQuery}
            onClear={() => onSearch("")}
          />
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-600">
              Найдено {searchResults.length} совпадений
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-green-600" />
            Поиск фраз
          </h3>
          <AutocompleteInput
            placeholder="Начните вводить фразу..."
            onInputChange={onPhraseSearch}
            suggestions={phraseResults}
            onSuggestionSelect={(suggestion) => {
              onPhraseSearch(suggestion);
            }}
            value={phraseQuery}
            onClear={() => onPhraseSearch("")}
          />
          {phraseQuery && (
            <p className="mt-2 text-sm text-gray-600">
              Найдено {phraseResults.length} совпадений
            </p>
          )}
        </div>
      </div>

      {/* Точный поиск */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-purple-600" />
          Точный поиск
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Проверить существование слова
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={exactSearchWord}
                onChange={(e) => setExactSearchWord(e.target.value)}
                placeholder="Введите слово для проверки"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-0"
              />
              <button
                onClick={() => handleExactSearch("word")}
                disabled={!exactSearchWord.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                Проверить
              </button>
            </div>
            {exactWordExists !== null && (
              <div
                className={`mt-2 flex items-center gap-2 text-sm ${
                  exactWordExists ? "text-green-600" : "text-red-600"
                }`}
              >
                {exactWordExists ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                {exactWordExists ? "Слово найдено" : "Слово не найдено"}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Проверить существование фразы
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={exactSearchPhrase}
                onChange={(e) => setExactSearchPhrase(e.target.value)}
                placeholder="Введите фразу для проверки"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-0"
              />
              <button
                onClick={() => handleExactSearch("phrase")}
                disabled={!exactSearchPhrase.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                Проверить
              </button>
            </div>
            {exactPhraseExists !== null && (
              <div
                className={`mt-2 flex items-center gap-2 text-sm ${
                  exactPhraseExists ? "text-green-600" : "text-red-600"
                }`}
              >
                {exactPhraseExists ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                {exactPhraseExists ? "Фраза найдена" : "Фраза не найдена"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
