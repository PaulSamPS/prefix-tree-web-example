import React from "react";
import { FileText, Hash } from "lucide-react";

interface ResultsListProps {
  results: string[];
  title: string;
  emptyMessage: string;
  type: "words" | "phrases";
}

export const ResultsList: React.FC<ResultsListProps> = ({
  results,
  title,
  emptyMessage,
  type,
}) => {
  const Icon = type === "words" ? Hash : FileText;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className="text-sm text-gray-500">({results.length})</span>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {results.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <Icon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {results.map((result, index) => (
              <div
                key={index}
                className="px-6 py-3 hover:bg-gray-50 transition-colors duration-150 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 group-hover:text-blue-600 transition-colors">
                    {result}
                  </span>
                  <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {type === "words" ? "Слово" : "Фраза"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
