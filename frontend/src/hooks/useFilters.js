import { useState, useMemo } from 'react';

const initialFilters = {
    status: 'all',
    priority: 'all',
    category: 'all',
    assignee: 'all',
    search: '',
    showCompleted: true,
    importantOnly: false
};

const initialSort = {
    sortBy: 'createdAt',
    sortOrder: 'desc'
};

export const useFilters = () => {
    const [filters, setFilters] = useState(initialFilters);
    const [sort, setSort] = useState(initialSort);
    const [showFilters, setShowFilters] = useState(false);

    // Update individual filter
    const updateFilter = (key, value) => {
        setFilters(prev => ({
        ...prev,
        [key]: value
        }));
    };

    // Update multiple filters
    const updateFilters = (newFilters) => {
        setFilters(prev => ({
        ...prev,
        ...newFilters
        }));
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters(initialFilters);
        setSort(initialSort);
    };

    // Update sort
    const updateSort = (sortBy, sortOrder = null) => {
        setSort(prev => ({
        sortBy,
        sortOrder: sortOrder || (prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc')
        }));
    };

    // Check if any filters are active
    const hasActiveFilters = useMemo(() => {
        return Object.entries(filters).some(([key, value]) => {
        if (key === 'showCompleted') return !value;
        if (key === 'importantOnly') return value;
        if (key === 'search') return value.trim() !== '';
        return value !== 'all';
        });
    }, [filters]);

    // Get filter counts (for display)
    const getFilterCounts = useMemo(() => {
        let activeCount = 0;
        
        Object.entries(filters).forEach(([key, value]) => {
        if (key === 'showCompleted' && !value) activeCount++;
        else if (key === 'importantOnly' && value) activeCount++;
        else if (key === 'search' && value.trim()) activeCount++;
        else if (value !== 'all') activeCount++;
        });

        return activeCount;
    }, [filters]);

    return {
        // Current state
        filters,
        sort,
        showFilters,
        
        // Computed
        hasActiveFilters,
        getFilterCounts,
        
        // Actions
        updateFilter,
        updateFilters,
        clearFilters,
        updateSort,
        setShowFilters,
        
        // Individual filter setters for convenience
        setStatus: (status) => updateFilter('status', status),
        setPriority: (priority) => updateFilter('priority', priority),
        setCategory: (category) => updateFilter('category', category),
        setAssignee: (assignee) => updateFilter('assignee', assignee),
        setSearch: (search) => updateFilter('search', search),
        setShowCompleted: (show) => updateFilter('showCompleted', show),
        setImportantOnly: (only) => updateFilter('importantOnly', only),
    };
};

export default useFilters;