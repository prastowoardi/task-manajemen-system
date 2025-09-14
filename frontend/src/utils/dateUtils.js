import { format, parseISO, isAfter, isBefore, differenceInDays } from 'date-fns';
import { id } from 'date-fns/locale';

export const formatDate = (dateString, formatString = 'PPP') => {
    if (!dateString) return '';
    try {
        return format(parseISO(dateString), formatString, { locale: id });
    } catch (error) {
        return dateString;
    }
};

export const formatDateTime = (dateString) => {
    if (!dateString) return '';
    try {
        return format(parseISO(dateString), 'PPP p', { locale: id });
    } catch (error) {
        return dateString;
    }
};

export const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = parseISO(dueDate);
    return isBefore(due, today) && format(due, 'yyyy-MM-dd') !== format(today, 'yyyy-MM-dd');
};

export const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = parseISO(dueDate);
    return differenceInDays(due, today);
};

export const isToday = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    const date = parseISO(dateString);
    return format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
};

export const formatRelativeDate = (dateString) => {
    if (!dateString) return '';
    const days = getDaysUntilDue(dateString);
    
    if (days === null) return '';
    if (days < 0) return `${Math.abs(days)} hari terlambat`;
    if (days === 0) return 'Hari ini';
    if (days === 1) return 'Besok';
    return `${days} hari lagi`;
};