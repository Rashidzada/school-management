/**
 * Classes Module
 * Handles Class, Section, and Subject Management
 */

const ClassesModule = {
    init: (container) => {
        ClassesModule.container = container;
        ClassesModule.renderList();
    },

    renderList: () => {
        const classes = Storage.get('sms_classes') || [];

        let html = `
            <div class="d-flex justify-between align-center" style="margin-bottom: 20px;">
                <h2>Class & Subject Management</h2>
                <button class="btn btn-primary" onclick="ClassesModule.renderForm()">
                    <i class="fas fa-plus"></i> Add New Class
                </button>
            </div>

            <div class="card">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f8f9fa; border-bottom: 2px solid #e9ecef;">
                            <th style="padding: 12px; text-align: left;">Class Name</th>
                            <th style="padding: 12px; text-align: left;">Sections</th>
                            <th style="padding: 12px; text-align: left;">Subjects</th>
                            <th style="padding: 12px; text-align: left;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${classes.length === 0 ? '<tr><td colspan="4" class="text-center p-3">No classes found</td></tr>' : ''}
                        ${classes.map(c => ClassesModule.getRowHtml(c)).join('')}
                    </tbody>
                </table>
            </div>
        `;

        ClassesModule.container.innerHTML = html;
    },

    getRowHtml: (c) => {
        const subjectsCount = c.subjects ? c.subjects.length : 0;
        return `
            <tr style="border-bottom: 1px solid #e9ecef;">
                <td style="padding: 12px;"><strong>${c.name}</strong></td>
                <td style="padding: 12px;">${c.sections.join(', ')}</td>
                <td style="padding: 12px;">${subjectsCount} Subjects</td>
                <td style="padding: 12px;">
                    <button class="btn" style="color: var(--primary-color);" onclick="ClassesModule.renderForm('${c.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn" style="color: var(--secondary-color);" onclick="ClassesModule.manageSubjects('${c.id}')">
                        <i class="fas fa-book"></i> Subjects
                    </button>
                </td>
            </tr>
        `;
    },

    renderForm: (id = null) => {
        const cls = id ? Storage.get('sms_classes').find(c => c.id === id) : { sections: ['A'] };
        const sectionsStr = cls.sections ? cls.sections.join(', ') : 'A';

        const html = `
            <div class="card">
                <div class="d-flex justify-between align-center" style="margin-bottom: 20px;">
                    <h3>${id ? 'Edit Class' : 'Add New Class'}</h3>
                    <button class="btn" onclick="ClassesModule.renderList()" style="background: #e2e6ea; color: #2c3e50;">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                </div>

                <form onsubmit="ClassesModule.saveClass(event, '${id || ''}')">
                    <div class="form-group">
                        <label>Class Name *</label>
                        <input type="text" name="name" value="${cls.name || ''}" required placeholder="e.g. Class 10">
                    </div>
                    <div class="form-group">
                        <label>Sections (comma separated) *</label>
                        <input type="text" name="sections" value="${sectionsStr}" required placeholder="A, B, C">
                    </div>
                    <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Class</button>
                </form>
            </div>
        `;

        ClassesModule.container.innerHTML = html;
    },

    saveClass: (e, id) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const sections = formData.get('sections').split(',').map(s => s.trim()).filter(s => s);

        if (id) {
            const classes = Storage.get('sms_classes');
            const cls = classes.find(c => c.id === id);
            cls.name = name;
            cls.sections = sections;
            Storage.save('sms_classes', classes);
            Utils.showToast('Class updated', 'success');
        } else {
            const newClass = {
                id: Utils.generateId('c'),
                name: name,
                sections: sections,
                subjects: []
            };
            Storage.add('sms_classes', newClass);
            Utils.showToast('Class added', 'success');
        }
        ClassesModule.renderList();
    },

    manageSubjects: (classId) => {
        const classes = Storage.get('sms_classes');
        const cls = classes.find(c => c.id === classId);
        const teachers = Storage.get('sms_teachers') || [];
        const subjects = cls.subjects || [];

        const html = `
            <div class="card">
                <div class="d-flex justify-between align-center" style="margin-bottom: 20px;">
                    <h3>Manage Subjects for ${cls.name}</h3>
                    <button class="btn" onclick="ClassesModule.renderList()" style="background: #e2e6ea; color: #2c3e50;">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                </div>

                <div style="display: flex; gap: 20px;">
                    <!-- Add Subject Form -->
                    <div style="flex: 1; background: #f8f9fa; padding: 20px; border-radius: 8px;">
                        <h4>Add Subject</h4>
                        <form onsubmit="ClassesModule.addSubject(event, '${classId}')">
                            <div class="form-group">
                                <label>Subject Name</label>
                                <input type="text" name="subName" required placeholder="e.g. Mathematics">
                            </div>
                            <div class="form-group">
                                <label>Assign Teacher</label>
                                <select name="teacherId" required>
                                    <option value="">Select Teacher</option>
                                    ${teachers.map(t => `<option value="${t.id}">${t.name} (${t.subject})</option>`).join('')}
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary" style="width: 100%;">Add Subject</button>
                        </form>
                    </div>

                    <!-- Subject List -->
                    <div style="flex: 2;">
                        <h4>Current Subjects</h4>
                        <table style="width: 100%; margin-top: 10px;">
                            <thead>
                                <tr style="background: #e9ecef;">
                                    <th style="padding: 10px; text-align: left;">Subject</th>
                                    <th style="padding: 10px; text-align: left;">Teacher</th>
                                    <th style="padding: 10px;">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${subjects.length === 0 ? '<tr><td colspan="3" class="text-center p-2">No subjects assigned</td></tr>' : ''}
                                ${subjects.map((sub, index) => {
            const teacher = teachers.find(t => t.id === sub.teacherId);
            return `
                                        <tr style="border-bottom: 1px solid #ddd;">
                                            <td style="padding: 10px;">${sub.name}</td>
                                            <td style="padding: 10px;">${teacher ? teacher.name : 'Unknown'}</td>
                                            <td style="padding: 10px; text-align: center;">
                                                <button class="btn" style="color: var(--danger-color); padding: 5px;" onclick="ClassesModule.deleteSubject('${classId}', ${index})">
                                                    <i class="fas fa-times"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    `;
        }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        ClassesModule.container.innerHTML = html;
    },

    addSubject: (e, classId) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const subName = formData.get('subName');
        const teacherId = formData.get('teacherId');

        const classes = Storage.get('sms_classes');
        const cls = classes.find(c => c.id === classId);

        if (!cls.subjects) cls.subjects = [];
        cls.subjects.push({ name: subName, teacherId: teacherId });

        Storage.save('sms_classes', classes);
        Utils.showToast('Subject assigned', 'success');
        ClassesModule.manageSubjects(classId);
    },

    deleteSubject: (classId, index) => {
        if (confirm('Remove this subject?')) {
            const classes = Storage.get('sms_classes');
            const cls = classes.find(c => c.id === classId);
            cls.subjects.splice(index, 1);
            Storage.save('sms_classes', classes);
            ClassesModule.manageSubjects(classId);
        }
    }
};
