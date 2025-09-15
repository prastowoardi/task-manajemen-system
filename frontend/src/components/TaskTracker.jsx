import React, { useState, useEffect, useMemo } from 'react';
import { 
    Plus, Edit2, Trash2, CheckCircle, Clock, AlertCircle, Calendar, 
    User, Tag, Search, Filter, BarChart3, Archive, Star, 
    ChevronDown, ChevronUp, Eye, Copy, Download, RefreshCw
} from 'lucide-react';

const TaskTracker = () => {
  // State Management
    const [tasks, setTasks] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filter, setFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [view, setView] = useState('grid'); // grid or list
    const [showCompleted, setShowCompleted] = useState(true);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(10);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: '',
        assignee: '',
        category: '',
        tags: '',
        estimatedHours: '',
        progress: 0,
        notes: '',
        important: false
    });

    useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
        .then((res) => res.json())
        .then((data) => {
        if (Array.isArray(data)) {
            setTasks(data);
        } else if (Array.isArray(data.tasks)) {
            setTasks(data.tasks);
        }
        })
        .catch((err) => console.error("Error fetching tasks:", err));
    }, []);

    // Constants
    const priorities = {
        low: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Rendah', bgColor: 'bg-green-50' },
        medium: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Sedang', bgColor: 'bg-yellow-50' },
        high: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Tinggi', bgColor: 'bg-red-50' }
    };

    const statuses = {
        pending: { 
        color: 'bg-gray-100 text-gray-800 border-gray-200', 
        label: 'Menunggu', 
        icon: Clock,
        bgColor: 'bg-gray-50'
        },
        'in-progress': { 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        label: 'Dikerjakan', 
        icon: AlertCircle,
        bgColor: 'bg-blue-50'
        },
        completed: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        label: 'Selesai', 
        icon: CheckCircle,
        bgColor: 'bg-green-50'
        }
    };

    // Computed values
    const categories = useMemo(() => {
        const cats = [...new Set(tasks.map(task => task.category).filter(Boolean))];
        return cats.sort();
    }, [tasks]);

    const allTags = useMemo(() => {
        const tags = tasks.flatMap(task => 
        task.tags ? task.tags.split(',').map(tag => tag.trim()) : []
        );
        return [...new Set(tags)].sort();
    }, [tasks]);

    // Filtering and sorting
    const filteredAndSortedTasks = useMemo(() => {
        let filtered = tasks.filter(task => {
        const matchesStatus = filter === 'all' || task.status === filter;
        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
        const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
        const matchesSearch = !searchTerm || 
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.tags && task.tags.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCompleted = showCompleted || task.status !== 'completed';
        
        return matchesStatus && matchesPriority && matchesCategory && matchesSearch && matchesCompleted;
        });

        // Sorting
        filtered.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortBy) {
            case 'title':
                aValue = a.title.toLowerCase();
                bValue = b.title.toLowerCase();
            break;
            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                aValue = priorityOrder[a.priority];
                bValue = priorityOrder[b.priority];
            break;
            case 'dueDate':
                aValue = a.dueDate ? new Date(a.dueDate) : new Date('2099-12-31');
                bValue = b.dueDate ? new Date(b.dueDate) : new Date('2099-12-31');
            break;
            case 'status':
                const statusOrder = { pending: 1, 'in-progress': 2, completed: 3 };
                aValue = statusOrder[a.status];
                bValue = statusOrder[b.status];
            break;
            case 'progress':
                aValue = a.progress || 0;
                bValue = b.progress || 0;
            break;
            default:
                aValue = new Date(a.createdAt);
                bValue = new Date(b.createdAt);
        }
        
        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
        });

        return filtered;
    }, [tasks, filter, priorityFilter, categoryFilter, searchTerm, showCompleted, sortBy, sortOrder]);

    // Pagination
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredAndSortedTasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(filteredAndSortedTasks.length / tasksPerPage);

    // Statistics
    const taskStats = useMemo(() => {
        const total = tasks.length;
        const pending = tasks.filter(t => t.status === 'pending').length;
        const inProgress = tasks.filter(t => t.status === 'in-progress').length;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const overdue = tasks.filter(t => isOverdue(t.dueDate) && t.status !== 'completed').length;
        const important = tasks.filter(t => t.important).length;
        
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        const avgProgress = total > 0 ? Math.round(tasks.reduce((sum, task) => sum + (task.progress || 0), 0) / total) : 0;
        
        return {
        total, pending, inProgress, completed, overdue, important, completionRate, avgProgress
        };
    }, [tasks]);

    // Utility functions
    const resetForm = () => {
        setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: '',
        assignee: '',
        category: '',
        tags: '',
        estimatedHours: '',
        progress: 0,
        notes: '',
        important: false
        });
    };

    const generateId = () => Date.now() + Math.random();

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('id-ID', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString('id-ID');
    };

    function isOverdue(dueDate) {
        if (!dueDate) return false;
        const today = new Date();
        const due = new Date(dueDate);
        return due < today && due.toDateString() !== today.toDateString();
    }

    const getDaysUntilDue = (dueDate) => {
        if (!dueDate) return null;
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Event handlers
    const handleSubmit = () => {
        if (!formData.title.trim()) return;

        if (editingTask) {
        setTasks(tasks.map(task => 
            task.id === editingTask.id 
            ? { 
                ...formData, 
                id: editingTask.id, 
                createdAt: editingTask.createdAt, 
                updatedAt: new Date().toISOString()
                }
            : task
        ));
        setEditingTask(null);
        } else {
        const newTask = {
            ...formData,
            id: generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setTasks([newTask, ...tasks]);
        }

        resetForm();
        setShowAddForm(false);
    };

    const handleEdit = (task) => {
        setFormData({
        ...task,
        tags: task.tags || '',
        estimatedHours: task.estimatedHours || '',
        progress: task.progress || 0,
        notes: task.notes || '',
        important: task.important || false
        });
        setEditingTask(task);
        setShowAddForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Yakin ingin menghapus task ini?')) {
        setTasks(tasks.filter(task => task.id !== id));
        setSelectedTasks(selectedTasks.filter(taskId => taskId !== id));
        }
    };

    const handleBulkDelete = () => {
        if (selectedTasks.length === 0) return;
        if (window.confirm(`Yakin ingin menghapus ${selectedTasks.length} task yang dipilih?`)) {
        setTasks(tasks.filter(task => !selectedTasks.includes(task.id)));
        setSelectedTasks([]);
        }
    };

    const handleBulkStatusChange = (status) => {
        if (selectedTasks.length === 0) return;
        setTasks(tasks.map(task => 
        selectedTasks.includes(task.id)
            ? { ...task, status, updatedAt: new Date().toISOString() }
            : task
        ));
        setSelectedTasks([]);
    };

    const handleStatusChange = (id, newStatus) => {
        setTasks(tasks.map(task => 
        task.id === id 
            ? { 
                ...task, 
                status: newStatus, 
                progress: newStatus === 'completed' ? 100 : task.progress,
                updatedAt: new Date().toISOString() 
            }
            : task
        ));
    };

    const handleProgressChange = (id, progress) => {
        const newStatus = progress === 100 ? 'completed' : 
                        progress > 0 ? 'in-progress' : 'pending';
        
        setTasks(tasks.map(task => 
        task.id === id 
            ? { ...task, progress, status: newStatus, updatedAt: new Date().toISOString() }
            : task
        ));
    };

    const toggleTaskSelection = (taskId) => {
        setSelectedTasks(prev => 
        prev.includes(taskId) 
            ? prev.filter(id => id !== taskId)
            : [...prev, taskId]
        );
    };

    const selectAllTasks = () => {
        if (selectedTasks.length === currentTasks.length) {
        setSelectedTasks([]);
        } else {
        setSelectedTasks(currentTasks.map(task => task.id));
        }
    };

    const duplicateTask = (task) => {
        const duplicatedTask = {
        ...task,
        id: generateId(),
        title: `${task.title} (Copy)`,
        status: 'pending',
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
        };
        setTasks([duplicatedTask, ...tasks]);
    };

    const exportTasks = () => {
        const dataStr = JSON.stringify(filteredAndSortedTasks, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `tasks-${new Date().toISOString().split('T')[0]}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const clearFilters = () => {
        setFilter('all');
        setPriorityFilter('all');
        setCategoryFilter('all');
        setSearchTerm('');
        setSortBy('createdAt');
        setSortOrder('desc');
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Management System</h1>
                <p className="text-gray-600">Kelola dan pantau progress semua task Anda</p>
                </div>
                <div className="flex items-center gap-3 mt-4 lg:mt-0">
                <button
                    onClick={exportTasks}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    <Download size={16} />
                    Export
                </button>
                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={16} />
                    Tambah Task
                </button>
                </div>
            </div>
            
            {/* Enhanced Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">{taskStats.total}</div>
                <div className="text-sm text-blue-600">Total Task</div>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-700">{taskStats.pending}</div>
                <div className="text-sm text-yellow-600">Menunggu</div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                <div className="text-2xl font-bold text-orange-700">{taskStats.inProgress}</div>
                <div className="text-sm text-orange-600">Dikerjakan</div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">{taskStats.completed}</div>
                <div className="text-sm text-green-600">Selesai</div>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-700">{taskStats.overdue}</div>
                <div className="text-sm text-red-600">Terlambat</div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-700">{taskStats.important}</div>
                <div className="text-sm text-purple-600">Penting</div>
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
                <div className="text-2xl font-bold text-indigo-700">{taskStats.completionRate}%</div>
                <div className="text-sm text-indigo-600">Completion</div>
                </div>
                <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 rounded-lg border border-teal-200">
                <div className="text-2xl font-bold text-teal-700">{taskStats.avgProgress}%</div>
                <div className="text-sm text-teal-600">Avg Progress</div>
                </div>
            </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            {/* Search and Filter Toggle */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                    type="text"
                    placeholder="Cari task, assignee, atau tag..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}
                >
                    <Filter size={16} />
                    Filter
                    {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                </div>
                
                <div className="flex items-center gap-2">
                <button
                    onClick={clearFilters}
                    className="px-3 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                >
                    Clear
                </button>
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                    onClick={() => setView('grid')}
                    className={`p-2 rounded ${view === 'grid' ? 'bg-white shadow-sm' : ''}`}
                    >
                    <BarChart3 size={16} />
                    </button>
                    <button
                    onClick={() => setView('list')}
                    className={`p-2 rounded ${view === 'list' ? 'bg-white shadow-sm' : ''}`}
                    >
                    <Eye size={16} />
                    </button>
                </div>
                </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="all">Semua Status</option>
                    <option value="pending">Menunggu</option>
                    <option value="in-progress">Dikerjakan</option>
                    <option value="completed">Selesai</option>
                </select>

                <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="all">Semua Prioritas</option>
                    <option value="high">Tinggi</option>
                    <option value="medium">Sedang</option>
                    <option value="low">Rendah</option>
                </select>

                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="all">Semua Kategori</option>
                    {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="createdAt">Tanggal Dibuat</option>
                    <option value="title">Judul</option>
                    <option value="priority">Prioritas</option>
                    <option value="dueDate">Deadline</option>
                    <option value="status">Status</option>
                    <option value="progress">Progress</option>
                </select>

                <div className="flex items-center gap-2">
                    <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                    {sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                    </button>
                </div>
                </div>
            )}

            {/* Bulk Actions */}
            {selectedTasks.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-4">
                    <span className="text-blue-700 font-medium">{selectedTasks.length} task dipilih</span>
                    <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleBulkStatusChange('pending')}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                    >
                        Set Menunggu
                    </button>
                    <button
                        onClick={() => handleBulkStatusChange('in-progress')}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                    >
                        Set Dikerjakan
                    </button>
                    <button
                        onClick={() => handleBulkStatusChange('completed')}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                    >
                        Set Selesai
                    </button>
                    <button
                        onClick={handleBulkDelete}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                    >
                        Hapus
                    </button>
                    </div>
                </div>
                </div>
            )}
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold mb-6">
                {editingTask ? 'Edit Task' : 'Tambah Task Baru'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Title */}
                <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Task *
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masukkan judul task..."
                        required
                    />
                </div>
                
                {/* Description */}
                <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Deskripsi detail task..."
                    />
                </div>

                {/* Priority */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioritas
                    </label>
                    <select
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                    <option value="low">Rendah</option>
                    <option value="medium">Sedang</option>
                    <option value="high">Tinggi</option>
                    </select>
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                    </label>
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                    <option value="pending">Menunggu</option>
                    <option value="in-progress">Dikerjakan</option>
                    <option value="completed">Selesai</option>
                    </select>
                </div>

                {/* Due Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Deadline
                    </label>
                    <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Assignee */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Penanggung Jawab
                    </label>
                    <input
                        type="text"
                        value={formData.assignee}
                        onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nama penanggung jawab"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                    </label>
                    <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Misal: Development, Marketing"
                    />
                </div>

                {/* Estimated Hours */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimasi Jam
                    </label>
                    <input
                        type="number"
                        value={formData.estimatedHours}
                        onChange={(e) => setFormData({...formData, estimatedHours: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Jam kerja"
                        min="0"
                    />
                </div>

                {/* Tags */}
                <div className="md:col-span-2 lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                    </label>
                    <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="tag1,tag2,tag3"
                    />
                    <p className="text-xs text-gray-500 mt-1">Pisahkan dengan koma</p>
                </div>

                {/* Progress */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Progress ({formData.progress}%)
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.progress}
                        onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value)})}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                {/* Important */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="important"
                        checked={formData.important}
                        onChange={(e) => setFormData({...formData, important: e.target.checked})}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="important" className="text-sm font-medium text-gray-700">
                    Tandai sebagai penting
                    </label>
                </div>

                {/* Notes */}
                <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan
                    </label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Catatan tambahan..."
                    />
                </div>

                {/* Action Buttons */}
                <div className="md:col-span-2 lg:col-span-3 flex gap-4 pt-4">
                    <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                    {editingTask ? 'Update Task' : 'Simpan Task'}
                    </button>
                    <button
                    onClick={() => {
                        setShowAddForm(false);
                        setEditingTask(null);
                        resetForm();
                    }}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                    >
                    Batal
                    </button>
                    {editingTask && (
                    <button
                        onClick={() => duplicateTask(editingTask)}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                    >
                        <Copy size={16} />
                        Duplikasi
                    </button>
                    )}
                </div>
                </div>
            </div>
            )}

            {/* Task List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* List Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                    Task List ({filteredAndSortedTasks.length})
                    </h2>
                    <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={selectedTasks.length === currentTasks.length && currentTasks.length > 0}
                        onChange={selectAllTasks}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Pilih Semua</span>
                    </label>
                    <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={showCompleted}
                        onChange={(e) => setShowCompleted(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Tampilkan Selesai</span>
                    </label>
                </div>
                
                {/* Pagination Info */}
                {totalPages > 1 && (
                    <div className="text-sm text-gray-600">
                    Halaman {currentPage} dari {totalPages}
                    </div>
                )}
                </div>
            </div>

            {/* Task Items */}
            <div className="p-6">
                {currentTasks.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                    <Archive size={48} className="mx-auto" />
                    </div>
                    <div className="text-gray-500 text-lg mb-2">
                    {tasks.length === 0 ? 'Belum ada task' : 'Tidak ada task yang sesuai filter'}
                    </div>
                    <div className="text-gray-400 text-sm">
                    {tasks.length === 0 
                        ? 'Mulai dengan menambah task baru!' 
                        : 'Coba ubah filter atau kata kunci pencarian'
                    }
                    </div>
                </div>
                ) : (
                <div className={view === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                    {currentTasks.map(task => {
                    const StatusIcon = statuses[task.status].icon;
                    const isTaskOverdue = isOverdue(task.dueDate);
                    const daysUntilDue = getDaysUntilDue(task.dueDate);
                    const isSelected = selectedTasks.includes(task.id);
                    
                    return (
                        <div 
                        key={task.id} 
                        className={`border rounded-xl p-6 transition-all hover:shadow-md ${
                            isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                        } ${
                            isTaskOverdue ? 'border-l-4 border-l-red-500' : 
                            task.important ? 'border-l-4 border-l-yellow-500' : ''
                        }`}
                        >
                        {/* Task Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3 flex-1">
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleTaskSelection(task.id)}
                                className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                <h3 className={`font-semibold text-gray-900 ${task.status === 'completed' ? 'line-through' : ''}`}>
                                    {task.title}
                                </h3>
                                {task.important && (
                                    <Star className="text-yellow-500 fill-current" size={16} />
                                )}
                                </div>
                                {task.description && (
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
                                )}
                            </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        {task.progress > 0 && (
                            <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>{task.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                className={`h-2 rounded-full transition-all ${
                                    task.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${task.progress}%` }}
                                ></div>
                            </div>
                            </div>
                        )}

                        {/* Task Meta Info */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorities[task.priority].color}`}>
                            {priorities[task.priority].label}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statuses[task.status].color} flex items-center gap-1`}>
                            <StatusIcon size={12} />
                            {statuses[task.status].label}
                            </span>
                            {task.category && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                {task.category}
                            </span>
                            )}
                        </div>

                        {/* Task Details */}
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                            {task.dueDate && (
                            <div className={`flex items-center gap-2 ${isTaskOverdue ? 'text-red-600 font-medium' : ''}`}>
                                <Calendar size={14} />
                                <span>{formatDate(task.dueDate)}</span>
                                {daysUntilDue !== null && (
                                <span className={`text-xs px-1 py-0.5 rounded ${
                                    daysUntilDue < 0 ? 'bg-red-100 text-red-700' :
                                    daysUntilDue === 0 ? 'bg-yellow-100 text-yellow-700' :
                                    daysUntilDue <= 3 ? 'bg-orange-100 text-orange-700' :
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                    {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} hari terlambat` :
                                    daysUntilDue === 0 ? 'Hari ini' :
                                    `${daysUntilDue} hari lagi`}
                                </span>
                                )}
                            </div>
                            )}
                            {task.assignee && (
                            <div className="flex items-center gap-2">
                                <User size={14} />
                                <span>{task.assignee}</span>
                            </div>
                            )}
                            {task.estimatedHours && (
                            <div className="flex items-center gap-2">
                                <Clock size={14} />
                                <span>{task.estimatedHours} jam</span>
                            </div>
                            )}
                            {task.tags && (
                            <div className="flex items-center gap-2">
                                <Tag size={14} />
                                <div className="flex flex-wrap gap-1">
                                {task.tags.split(',').map((tag, index) => (
                                    <span key={index} className="px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                    {tag.trim()}
                                    </span>
                                ))}
                                </div>
                            </div>
                            )}
                        </div>

                        {/* Notes */}
                        {task.notes && (
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{task.notes}</p>
                            </div>
                        )}

                        {/* Timestamps */}
                        <div className="text-xs text-gray-400 mb-4">
                            <div>Dibuat: {formatDateTime(task.createdAt)}</div>
                            {task.updatedAt !== task.createdAt && (
                            <div>Diupdate: {formatDateTime(task.updatedAt)}</div>
                            )}
                        </div>

                        {/* Progress Control */}
                        <div className="mb-4">
                            <label className="block text-xs text-gray-600 mb-1">
                            Update Progress: {task.progress}%
                            </label>
                            <input
                            type="range"
                            min="0"
                            max="100"
                            value={task.progress}
                            onChange={(e) => handleProgressChange(task.id, parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between">
                            <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                            <option value="pending">Menunggu</option>
                            <option value="in-progress">Dikerjakan</option>
                            <option value="completed">Selesai</option>
                            </select>
                            
                            <div className="flex items-center gap-1">
                            <button
                                onClick={() => duplicateTask(task)}
                                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Duplikasi task"
                            >
                                <Copy size={16} />
                            </button>
                            <button
                                onClick={() => handleEdit(task)}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Edit task"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(task.id)}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Hapus task"
                            >
                                <Trash2 size={16} />
                            </button>
                            </div>
                        </div>
                        </div>
                    );
                    })}
                </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                    Menampilkan {indexOfFirstTask + 1}-{Math.min(indexOfLastTask, filteredAndSortedTasks.length)} dari {filteredAndSortedTasks.length} task
                    </div>
                    <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Sebelumnya
                    </button>
                    
                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                            <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-2 text-sm rounded-lg ${
                                currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                            >
                            {pageNum}
                            </button>
                        );
                        })}
                    </div>
                    
                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Selanjutnya
                    </button>
                    </div>
                </div>
                </div>
            )}
            </div>
        </div>
        </div>
    );
};

export default TaskTracker;