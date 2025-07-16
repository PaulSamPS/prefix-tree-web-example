import React, { useState } from "react";
import { Plus, Type, MessageSquare } from "lucide-react";

interface AddItemFormProps {
  onAddWord: (word: string) => void;
  onAddPhrase: (phrase: string) => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({
  onAddWord,
  onAddPhrase,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState<"word" | "phrase">("phrase");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (activeTab === "word") {
      onAddWord(inputValue.trim());
    } else {
      onAddPhrase(inputValue.trim());
    }

    setInputValue("");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Plus className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Добавить в дерево
        </h3>
      </div>

      <div className="flex rounded-lg bg-gray-100 p-1 mb-4">
        <button
          onClick={() => setActiveTab("word")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === "word"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Type className="w-4 h-4" />
          Слово
        </button>
        <button
          onClick={() => setActiveTab("phrase")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === "phrase"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Фраза
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              activeTab === "word" ? "Введите слово..." : "Введите фразу..."
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-0"
          />
        </div>

        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Добавить {activeTab === "word" ? "слово" : "фразу"}
        </button>
      </form>
    </div>
  );
};
