// export const priorities = {
//     low: { 
//         color: 'bg-green-100 text-green-800 border-green-200', 
//         label: 'Rendah', 
//         bgColor: 'bg-green-50',
//         value: 1
//     },
//     medium: { 
//         color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
//         label: 'Sedang', 
//         bgColor: 'bg-yellow-50',
//         value: 2
//     },
//     high: { 
//         color: 'bg-red-100 text-red-800 border-red-200', 
//         label: 'Tinggi', 
//         bgColor: 'bg-red-50',
//         value: 3
//     }
// };

// export const statuses = {
//     pending: { 
//         color: 'bg-gray-100 text-gray-800 border-gray-200', 
//         label: 'Menunggu', 
//         bgColor: 'bg-gray-50',
//         value: 1
//     },
//     'in-progress': { 
//         color: 'bg-blue-100 text-blue-800 border-blue-200', 
//         label: 'Dikerjakan', 
//         bgColor: 'bg-blue-50',
//         value: 2
//     },
//     completed: { 
//         color: 'bg-green-100 text-green-800 border-green-200', 
//         label: 'Selesai', 
//         bgColor: 'bg-green-50',
//         value: 3
//     }
// };

// export const generateId = () => {
//     return Date.now() + Math.random();
// };

// export const createTask = (taskData) => {
//     return {
//         id: generateId(),
//         title: '',
//         description: '',
//         priority: 'medium',
//         status: 'pending',
//         dueDate: '',
//         assignee: '',
//         category: '',
//         tags: '',
//         estimatedHours: '',
//         progress: 0,
//         notes: '',
//         important: false,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         ...taskData
//     };
// };

// export const updateTask = (existingTask, updates) => {
//     return {
//         ...existingTask,
//         ...updates,
//         updatedAt: new Date().toISOString()
//     };
// };

// export const sortTasks = (tasks, sortBy, sortOrder) => {
//     const sortedTasks = [...tasks].sort((a, b) => {
//         let aValue, bValue;
        
//         switch (sortBy) {
//         case 'title':
//             aValue = a.title.toLowerCase();
//             bValue = b.title.toLowerCase();
//             break;
//         case 'priority':
//             aValue = priorities[a.priority].value;
//             bValue = priorities[b.priority].value;
//             break;
//         case 'dueDate':
//             aValue = a.dueDate ? new Date(a.dueDate) : new Date('2099-12-31');
//             bValue = b.dueDate ? new Date(b.dueDate) : new Date('2099-12-31');
//             break;
//         case 'status':
//             aValue = statuses[a.status].value;
//             bValue = statuses[b.status].value;
//             break;
//         case 'progress':
//             aValue = a.progress || 0;
//             bValue = b.progress || 0;
//             break;
//         case 'assignee':
//             aValue = a.assignee.toLowerCase();
//             bValue = b.assignee.toLowerCase();
//             break;
//         case 'category':
//             aValue = a.category.toLowerCase();
//             bValue = b.category.toLowerCase();
//             break;
//         default:
//             aValue = new Date(a.createdAt);
//             bValue = new Date(b.createdAt);
//         }
        
//         if (sortOrder === 'asc') {
//         return aValue > bValue ? 1 : -1;
//         } else {
//         return aValue < bValue ? 1 : -1;
//         }
//     });
    
//     return sortedTasks;
// };

// export const filterTasks = (tasks, filters) => {
//     return tasks.filter(task => {
//         const matchesStatus = filters.status === 'all' || task.status === filters.status;
//         const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
//         const matchesCategory = filters.category === 'all' || task.category === filters.category;
//         const matchesAssignee = filters.assignee === 'all' || task.assignee === filters.assignee;
//         const matchesSearch = !filters.search || 
//         task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
//         task.description.toLowerCase().includes(filters.search.toLowerCase()) ||
//         task.assignee.toLowerCase().includes(filters.search.toLowerCase()) ||
//         (task.tags && task.tags.toLowerCase().includes(filters.search.toLowerCase()));
//         const matchesCompleted = filters.showCompleted || task.status !== 'completed';
//         const matchesImportant = !filters.importantOnly || task.important;
        
//         return matchesStatus && matchesPriority && matchesCategory && 
//             matchesAssignee && matchesSearch && matchesCompleted && matchesImportant;
//     });
// };

// export const calculateTaskStats = (tasks) => {
//     const total = tasks.length;
//     const pending = tasks.filter(t => t.status === 'pending').length;
//     const inProgress = tasks.filter(t => t.status === 'in-progress').length;
//     const completed = tasks.filter(t => t.status === 'completed').length;
//     const overdue = tasks.filter(t => {
//         if (!t.dueDate || t.status === 'completed') return false;
//         return new Date(t.dueDate) < new Date();
//     }).length;
//     const important = tasks.filter(t => t.important).length;
    
//     const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
//     const avgProgress = total > 0 ? Math.round(tasks.reduce((sum, task) => sum + (task.progress || 0), 0) / total) : 0;
    
//     return {
//         total, pending, inProgress, completed, overdue, important, completionRate, avgProgress
//     };
// };

// export const getUniqueValues = (tasks, field) => {
//     const values = tasks.map(task => task[field]).filter(Boolean);
//     return [...new Set(values)].sort();
// };


export const generateId = () => Date.now() + Math.random();

export const fetchTasks = async (setTasks) => {
    try {
        const res = await fetch("http://localhost:5000/api/tasks");
        const data = await res.json();
        if (Array.isArray(data)) {
        setTasks(data);
        } else if (Array.isArray(data.tasks)) {
        setTasks(data.tasks);
        }
    } catch (err) {
        console.error("Error fetching tasks:", err);
    }
    };

    export const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("id-ID", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};
