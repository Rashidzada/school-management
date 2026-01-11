/**
 * School Management System - Storage Module
 * Handles all LocalStorage operations and Data Seeding
 */

const STORAGE_KEYS = {
    USERS: 'sms_users',
    STUDENTS: 'sms_students',
    TEACHERS: 'sms_teachers',
    CLASSES: 'sms_classes',
    ATTENDANCE: 'sms_attendance',
    EXAMS: 'sms_exams',
    FEES: 'sms_fees',
    NOTICES: 'sms_notices',
    SETTINGS: 'sms_settings',
    SESSION: 'sms_session'
};

const DEFAULT_SETTINGS = {
    schoolName: 'Future Scholars Academy',
    theme: 'light',
    logo: 'assets/icons/logo.png', // Placeholder
    currentSession: '2025-2026'
};

// Seed Data
const SEED_DATA = {
    users: [
        { id: 'admin1', name: 'Admin User', email: 'admin@school.com', password: 'password123', role: 'admin' },
        { id: 't1', name: 'John Doe', email: 'teacher@school.com', password: 'password123', role: 'teacher' },
        { id: 's1', name: 'Student One', email: 'student@school.com', password: 'password123', role: 'student' }
    ],
    classes: [
        { id: 'c1', name: 'Class 1', sections: ['A', 'B'] },
        { id: 'c2', name: 'Class 2', sections: ['A'] },
        { id: 'c10', name: 'Class 10', sections: ['A', 'B', 'C'] }
    ],
    teachers: [
        { id: 't1', name: 'John Doe', subject: 'Mathematics', phone: '1234567890', qualification: 'M.Sc Math' },
        { id: 't2', name: 'Jane Smith', subject: 'Science', phone: '0987654321', qualification: 'M.Sc Physics' }
    ],
    students: [
        { id: 's1', name: 'Ali Khan', fatherName: 'Ahmed Khan', classId: 'c1', section: 'A', rollNo: 1, feesPaid: true },
        { id: 's2', name: 'Sara Ali', fatherName: 'Moazzam Ali', classId: 'c1', section: 'A', rollNo: 2, feesPaid: false }
    ], 
    notices: [
        { id: 'n1', title: 'Welcome to New Term', content: 'School reopens on Monday.', date: '2026-01-10', priority: 'high' }
    ]
};

class Storage {
    static init() {
        if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
            console.log('Seeding Data...');
            this.save(STORAGE_KEYS.USERS, SEED_DATA.users);
            this.save(STORAGE_KEYS.CLASSES, SEED_DATA.classes);
            this.save(STORAGE_KEYS.TEACHERS, SEED_DATA.teachers);
            this.save(STORAGE_KEYS.STUDENTS, SEED_DATA.students);
            this.save(STORAGE_KEYS.NOTICES, SEED_DATA.notices);
            this.save(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
        }
    }

    static get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    static save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    static add(key, item) {
        const list = this.get(key) || [];
        list.push(item);
        this.save(key, list);
    }

    static update(key, id, updatedItem) {
        const list = this.get(key) || [];
        const index = list.findIndex(i => i.id === id);
        if (index !== -1) {
            list[index] = { ...list[index], ...updatedItem };
            this.save(key, list);
            return true;
        }
        return false;
    }

    static delete(key, id) {
        let list = this.get(key) || [];
        const initialLength = list.length;
        list = list.filter(i => i.id !== id);
        this.save(key, list);
        return list.length !== initialLength;
    }
}

// Initialize on load
Storage.init();
