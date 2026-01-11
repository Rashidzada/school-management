/**
 * Utility functions for School Management System
 */

const Utils = {
    // Generate UUID-like ID
    generateId: (prefix = '') => {
        return prefix + Math.random().toString(36).substr(2, 9);
    },

    // Format Date
    formatDate: (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    },

    // Show Toast Notification
    showToast: (message, type = 'info') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerText = message;

        // Simple Toast Styles inline for now, or assume css class exists
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '4px';
        toast.style.color = '#fff';
        toast.style.zIndex = '1000';

        switch (type) {
            case 'success': toast.style.backgroundColor = 'var(--success-color, #2ecc71)'; break;
            case 'error': toast.style.backgroundColor = 'var(--danger-color, #e74c3c)'; break;
            default: toast.style.backgroundColor = 'var(--primary-color, #3498db)';
        }

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    },

    // Create Modal
    showModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('hidden');
    },

    hideModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('hidden');
    }
};
