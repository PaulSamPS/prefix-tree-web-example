import { useState, useEffect, useCallback } from "react";
import {
  Database,
  Trash2,
  Download,
  BarChart3,
  Search,
  Plus,
} from "lucide-react";
import { StatsCard } from "./components/stats-card.tsx";
import { ActionButton } from "./components/action-button.tsx";
import { AddItemForm } from "./components/add-item-form.tsx";
import { SearchSection } from "./components/search-section.tsx";
import { ResultsList } from "./components/results-list.tsx";
import { tree } from "trie-autocomplete-ps";

function App() {
  const [stats, setStats] = useState({
    totalNodes: 0,
    totalWords: 0,
    totalPhrases: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [phraseQuery, setPhraseQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [phraseResults, setPhraseResults] = useState<string[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Обновление статистики
  const updateStats = useCallback(() => {
    setStats(tree.getStats());
  }, []);

  // Показать уведомление
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Обработчики поиска
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const response = tree.autocompleteWords(query, 20);
        setSearchResults(response.suggestions);
      } catch (error) {
        console.error(error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handlePhraseSearch = (query: string) => {
    setPhraseQuery(query);
    if (query.trim()) {
      try {
        const response = tree.autocompletePhrases(query, 20);
        setPhraseResults(response.suggestions);
      } catch (error) {
        console.error(error);
        setPhraseResults([]);
      }
    } else {
      setPhraseResults([]);
    }
  };

  // Обработчики добавления
  const handleAddWord = (word: string) => {
    try {
      const response = tree.insertWord({ word });
      updateStats();
      showNotification(response.message);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "Ошибка при добавлении слова";
      showNotification(errorMessage);
    }
  };

  const handleAddPhrase = (phrase: string) => {
    try {
      const response = tree.insertPhrase({ phrase });
      updateStats();
      showNotification(response.message);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "Ошибка при добавлении фразы";
      showNotification(errorMessage);
    }
  };

  // Обработчики действий
  const handleLoadSampleData = () => {
    try {
      const result = tree.loadFishingPhrases();
      updateStats();
      showNotification(`${result.message} (${result.loaded} фраз)`);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "Ошибка при загрузке данных";
      showNotification(errorMessage);
    }
  };

  const handleClearAll = () => {
    try {
      const response = tree.clearTrie();
      updateStats();
      setSearchResults([]);
      setPhraseResults([]);
      setSearchQuery("");
      setPhraseQuery("");
      showNotification(response.message);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "Ошибка при очистке данных";
      showNotification(errorMessage);
    }
  };

  // Инициализация
  useEffect(() => {
    updateStats();
  }, [updateStats]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Уведомления */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300">
          {notification}
        </div>
      )}

      {/* Заголовок */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tree</h1>
                {/*<p className="text-sm text-gray-600">*/}
                {/*  Префиксное дерево для поиска слов и фраз*/}
                {/*</p>*/}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ActionButton
                onClick={handleLoadSampleData}
                icon={Download}
                text={
                  <>
                    <span className="ml-2 hidden max-[549px]:hidden md:inline">
                      Загрузить примеры
                    </span>
                  </>
                }
                variant="secondary"
              />

              <ActionButton
                onClick={handleClearAll}
                icon={Trash2}
                text={
                  <>
                    <span className="ml-2 hidden max-[549px]:hidden md:inline">
                      Очистить все
                    </span>
                  </>
                }
                variant="danger"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Всего узлов"
            value={stats.totalNodes}
            icon={BarChart3}
            color="bg-blue-600"
          />
          <StatsCard
            title="Слов в дереве"
            value={stats.totalWords}
            icon={Search}
            color="bg-green-600"
          />
          <StatsCard
            title="Фраз в дереве"
            value={stats.totalPhrases}
            icon={Plus}
            color="bg-purple-600"
          />
        </div>

        {/* Основной контент */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Левая колонка - Добавление */}
          <div className="xl:col-span-1">
            <AddItemForm
              onAddWord={handleAddWord}
              onAddPhrase={handleAddPhrase}
            />
          </div>

          {/* Правая колонка - Поиск и результаты */}
          <div className="xl:col-span-2 space-y-8">
            <SearchSection
              onSearch={handleSearch}
              onPhraseSearch={handlePhraseSearch}
              searchResults={searchResults}
              phraseResults={phraseResults}
              searchQuery={searchQuery}
              phraseQuery={phraseQuery}
            />

            {/*Результаты поиска */}
            {(searchResults.length > 0 || phraseResults.length > 0) && (
              <div className="grid grid-cols-1 gap-6">
                {searchQuery && (
                  <ResultsList
                    results={searchResults}
                    title="Найденные слова"
                    emptyMessage="Слова не найдены"
                    type="words"
                  />
                )}
                {phraseQuery && (
                  <ResultsList
                    results={phraseResults}
                    title="Найденные фразы"
                    emptyMessage="Фразы не найдены"
                    type="phrases"
                  />
                )}
              </div>
            )}

            {/* Пустое состояние */}
            {!searchQuery && !phraseQuery && (
              <div className="text-center py-12">
                <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Начните поиск
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Введите слово или фразу в поле поиска выше, чтобы увидеть
                  результаты автодополнения
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
