/**
 * Teachers Module
 * Handles all Teacher related operations (CRUD)
 */

const TeachersModule = {
    init: (container) => {
        TeachersModule.container = container;
        TeachersModule.renderList();
    },

    renderList: () => {
        const teachers = Storage.get('sms_teachers') || [];

        // Header & Actions
        let html = `
            <div class="d-flex justify-between align-center" style="margin-bottom: 20px;">
                <h2>Teacher Management</h2>
                <button class="btn btn-primary" onclick="TeachersModule.renderForm()">
                    <i class="fas fa-plus"></i> Add New Teacher
                </button>
            </div>

            <div class="card">
                <div class="form-group">
                    <input type="text" id="teacherSearch" placeholder="Search by Name or Subject..." onkeyup="TeachersModule.filterTeachers()">
                </div>
                
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8f9fa; border-bottom: 2px solid #e9ecef;">
                                <th style="padding: 12px; text-align: left;">Name</th>
                                <th style="padding: 12px; text-align: left;">Subject</th>
                                <th style="padding: 12px; text-align: left;">Qualification</th>
                                <th style="padding: 12px; text-align: left;">Phone</th>
                                <th style="padding: 12px; text-align: left;">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="teachersTableBody">
                            ${teachers.length === 0 ? '<tr><td colspan="5" class="text-center p-3">No teachers found</td></tr>' : ''}
                            ${teachers.map(t => TeachersModule.getRowHtml(t)).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        TeachersModule.container.innerHTML = html;
    },

    getRowHtml: (t) => {
        return `
            <tr style="border-bottom: 1px solid #e9ecef;">
                <td style="padding: 12px;"><strong>${t.name}</strong></td>
                <td style="padding: 12px;">${t.subject}</td>
                <td style="padding: 12px;">${t.qualification}</td>
                <td style="padding: 12px;">${t.phone}</td>
                <td style="padding: 12px;">
                    <button class="btn" style="color: var(--primary-color);" onclick="TeachersModule.renderForm('${t.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn" style="color: var(--danger-color);" onclick="TeachersModule.deleteTeacher('${t.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    },

    renderForm: (id = null) => {
        const teacher = id ? Storage.get('sms_teachers').find(t => t.id === id) : {};

        const html = `
            <div class="card">
                <div class="d-flex justify-between align-center" style="margin-bottom: 20px;">
                    <h3>${id ? 'Edit Teacher' : 'Add New Teacher'}</h3>
                    <button class="btn" onclick="TeachersModule.renderList()" style="background: #e2e6ea; color: #2c3e50;">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                </div>

                <form id="teacherForm" onsubmit="TeachersModule.saveTeacher(event, '${id || ''}')">
                    <div class="d-flex" style="gap: 20px; flex-wrap: wrap;">
                        <div class="form-group" style="flex: 1; min-width: 250px;">
                            <label>Full Name *</label>
                            <input type="text" name="name" value="${teacher.name || ''}" required>
                        </div>
                        <div class="form-group" style="flex: 1; min-width: 250px;">
                            <label>Subject Specialization *</label>
                            <input type="text" name="subject" value="${teacher.subject || ''}" required>
                        </div>
                    </div>

                    <div class="d-flex" style="gap: 20px; flex-wrap: wrap;">
                        <div class="form-group" style="flex: 1; min-width: 200px;">
                            <label>Qualification *</label>
                            <input type="text" name="qualification" value="${teacher.qualification || ''}" required>
                        </div>
                        <div class="form-group" style="flex: 1; min-width: 200px;">
                            <label>Phone *</label>
                            <input type="tel" name="phone" value="${teacher.phone || ''}" required>
                        </div>
                        <div class="form-group" style="flex: 1; min-width: 200px;">
                            <label>Email</label>
                            <input type="email" name="email" value="${teacher.email || ''}">
                        </div>
                    </div>

                    <div class="text-center mt-2">
                        <button type="submit" class="btn btn-primary" style="padding: 12px 30px; font-size: 16px;">
                            <i class="fas fa-save"></i> Save Teacher
                        </button>
                    </div>
                </form>
            </div>
        `;

        TeachersModule.container.innerHTML = html;
    },

    saveTeacher: (e, id) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const teacherData = Object.fromEntries(formData.entries());

        if (id) {
            // Update
            const success = Storage.update('sms_teachers', id, teacherData);
            if (success) Utils.showToast('Teacher updated successfully', 'success');
        } else {
            // Add
            teacherData.id = Utils.generateId('t');
            Storage.add('sms_teachers', teacherData);
            Utils.showToast('Teacher added successfully', 'success');
        }

        TeachersModule.renderList();
    },

    deleteTeacher: (id) => {
        if (confirm('Are you sure you want to delete this teacher?')) {
            Storage.delete('sms_teachers', id);
            Utils.showToast('Teacher deleted', 'error');
            TeachersModule.renderList();
        }
    },

    filterTeachers: () => {
        const query = document.getElementById('teacherSearch').value.toLowerCase();
        const rows = document.querySelectorAll('#teachersTableBody tr');

        rows.forEach(row => {
            const text = row.innerText.toLowerCase();
            row.style.display = text.includes(query) ? '' : 'none';
        });
    }
};
