import React from 'react';
import { 
  Search, 
  X, 
  RotateCcw, 
  SlidersHorizontal, 
  Filter,
  Check,
  ArrowUpDown
} from 'lucide-react';

export default function ShowcaseFilterBar({
  activeTab, // 'research' | 'projects'
  categories = [],
  activeCategory = 'All',
  onSelectCategory,
  categoryCounts = {},
  types = [],
  activeType = 'All',
  onSelectType,
  statuses = [],
  activeStatus = 'All',
  onSelectStatus,
  years = [],
  activeYear = 'All',
  onSelectYear,
  tags = [],
  activeTag = 'All',
  onSelectTag,
  sortBy = 'newest',
  onSelectSortBy,
  searchQuery = '',
  onSearchChange,
  onResetFilters,
  totalCount = 0,
  filteredCount = 0,
  filterConfig = {},
}) {
  const isFiltered = (
    activeCategory !== 'All' ||
    activeType !== 'All' ||
    activeStatus !== 'All' ||
    activeYear !== 'All' ||
    activeTag !== 'All' ||
    searchQuery.trim() !== '' ||
    sortBy !== 'newest'
  );

  return (
    <div className="space-y-4 mb-8 sm:mb-10 pb-5 sm:pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
      
      {/* Top Row: Category Tabs and Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-2">
        
        {/* Clean Text-based Category Tabs */}
        <div 
          role="tablist"
          aria-label="Category tabs"
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-1 scrollbar-none flex-1 min-w-0"
        >
          {categories.map((category) => {
            const count = categoryCounts[category];
            const isSelected = activeCategory === category;
            return (
              <button
                key={category}
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectCategory(category)}
                className={`relative pb-2 pt-1 px-1 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer touch-manipulation shrink-0 select-none ${
                  isSelected
                    ? 'text-emerald-500 dark:text-emerald-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
                }`}
              >
                <span>{category}</span>
                {count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isSelected
                      ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-dark-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {count}
                  </span>
                )}
                {isSelected && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 -mb-[9px]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Search Input Box */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={activeTab === 'research' ? "Search publications, authors, DOI..." : "Search projects, tools, CVEs, protocols..."}
            className="w-full pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-dark-850 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 touch-manipulation"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* Secondary Dynamic Filter Controls: Status, Tags, Sort & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 text-xs">
        
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Status Filter Dropdown */}
          {filterConfig.enableStatus !== false && statuses.length > 1 && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] hidden sm:inline">Status:</span>
              <select
                value={activeStatus}
                onChange={(e) => onSelectStatus(e.target.value)}
                aria-label="Filter by status"
                className={`py-1.5 px-2.5 rounded-lg text-xs font-mono bg-white dark:bg-dark-850 border cursor-pointer focus:outline-none transition-colors ${
                  activeStatus !== 'All' 
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold' 
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <option value="All">All Statuses</option>
                {statuses.filter(s => s !== 'All').map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          )}

          {/* Type Filter Dropdown */}
          {filterConfig.enableType !== false && types.length > 1 && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] hidden sm:inline">Type:</span>
              <select
                value={activeType}
                onChange={(e) => onSelectType(e.target.value)}
                aria-label="Filter by type"
                className={`py-1.5 px-2.5 rounded-lg text-xs font-mono bg-white dark:bg-dark-850 border cursor-pointer focus:outline-none transition-colors ${
                  activeType !== 'All' 
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold' 
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <option value="All">All Types</option>
                {types.filter(t => t !== 'All').map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          )}

          {/* Year Filter Dropdown (Research) */}
          {activeTab === 'research' && filterConfig.enableYear !== false && years.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] hidden sm:inline">Year:</span>
              <select
                value={activeYear}
                onChange={(e) => onSelectYear(e.target.value)}
                aria-label="Filter by year"
                className={`py-1.5 px-2.5 rounded-lg text-xs font-mono bg-white dark:bg-dark-850 border cursor-pointer focus:outline-none transition-colors ${
                  activeYear !== 'All' 
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold' 
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <option value="All">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}

          {/* Tag Filter Dropdown */}
          {filterConfig.enableTags !== false && tags.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] hidden sm:inline">Tool/Tag:</span>
              <select
                value={activeTag}
                onChange={(e) => onSelectTag(e.target.value)}
                aria-label="Filter by technology tag"
                className={`py-1.5 px-2.5 rounded-lg text-xs font-mono bg-white dark:bg-dark-850 border cursor-pointer focus:outline-none transition-colors ${
                  activeTag !== 'All' 
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold' 
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <option value="All">All Technologies</option>
                {tags.map((tag) => (
                  <option key={tag} value={tag}>#{tag}</option>
                ))}
              </select>
            </div>
          )}

          {/* Sort By Dropdown */}
          {onSelectSortBy && (
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
              <select
                value={sortBy}
                onChange={(e) => onSelectSortBy(e.target.value)}
                aria-label="Sort projects"
                className="py-1.5 px-2.5 rounded-lg text-xs font-mono bg-white dark:bg-dark-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer focus:outline-none transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          )}

        </div>

        {/* Right side: Result counter & Clear Button */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredCount}</strong> of {totalCount}
          </span>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all touch-manipulation"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
