/**
 * Students Module
 * Handles all Student related operations (CRUD)
 */

const StudentsModule = {
    init: (container) => {
        StudentsModule.container = container;
        StudentsModule.renderList();
    },

    renderList: () => {
        const students = Storage.get('sms_students') || [];

        // Header & Actions
        let html = `
            <div class="d-flex justify-between align-center" style="margin-bottom: 20px;">
                <h2>Student Management</h2>
                <button class="btn btn-primary" onclick="StudentsModule.renderForm()">
                    <i class="fas fa-plus"></i> Add New Student
                </button>
            </div>

            <div class="card">
                <div class="form-group">
                    <input type="text" id="studentSearch" placeholder="Search by Name, Roll No, or Class..." onkeyup="StudentsModule.filterStudents()">
                </div>
                
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8f9fa; border-bottom: 2px solid #e9ecef;">
                                <th style="padding: 12px; text-align: left;">ID/Roll</th>
                                <th style="padding: 12px; text-align: left;">Name</th>
                                <th style="padding: 12px; text-align: left;">Class</th>
                                <th style="padding: 12px; text-align: left;">Father's Name</th>
                                <th style="padding: 12px; text-align: left;">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="studentsTableBody">
                            ${students.length === 0 ? '<tr><td colspan="5" class="text-center p-3">No students found</td></tr>' : ''}
                            ${students.map(s => StudentsModule.getRowHtml(s)).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        StudentsModule.container.innerHTML = html;
    },

    getRowHtml: (s) => {
        const classInfo = Storage.get('sms_classes').find(c => c.id === s.classId);
        const className = classInfo ? `${classInfo.name} (${s.section})` : 'Unknown';

        return `
            <tr style="border-bottom: 1px solid #e9ecef;">
                <td style="padding: 12px;">#${s.rollNo}</td>
                <td style="padding: 12px;">
                    <strong>${s.name}</strong><br>
                    <small style="color: #7f8c8d;">${s.gender || ''}</small>
                </td>
                <td style="padding: 12px;">${className}</td>
                <td style="padding: 12px;">${s.fatherName}</td>
                <td style="padding: 12px;">
                    <button class="btn" style="color: var(--primary-color);" onclick="StudentsModule.renderForm('${s.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn" style="color: var(--danger-color);" onclick="StudentsModule.deleteStudent('${s.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    },

    renderForm: (id = null) => {
        const student = id ? Storage.get('sms_students').find(s => s.id === id) : {};
        const classes = Storage.get('sms_classes') || [];

        const html = `
            <div class="card">
                <div class="d-flex justify-between align-center" style="margin-bottom: 20px;">
                    <h3>${id ? 'Edit Student' : 'Add New Student'}</h3>
                    <button class="btn" onclick="StudentsModule.renderList()" style="background: #e2e6ea; color: #2c3e50;">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                </div>

                <form id="studentForm" onsubmit="StudentsModule.saveStudent(event, '${id || ''}')">
                    <div class="d-flex" style="gap: 20px; flex-wrap: wrap;">
                        <div class="form-group" style="flex: 1; min-width: 250px;">
                            <label>Full Name *</label>
                            <input type="text" name="name" value="${student.name || ''}" required>
                        </div>
                        <div class="form-group" style="flex: 1; min-width: 250px;">
                            <label>Father's Name *</label>
                            <input type="text" name="fatherName" value="${student.fatherName || ''}" required>
                        </div>
                    </div>

                    <div class="d-flex" style="gap: 20px; flex-wrap: wrap;">
                         <div class="form-group" style="flex: 1; min-width: 200px;">
                            <label>Gender</label>
                            <select name="gender" required>
                                <option value="Male" ${student.gender === 'Male' ? 'selected' : ''}>Male</option>
                                <option value="Female" ${student.gender === 'Female' ? 'selected' : ''}>Female</option>
                            </select>
                        </div>
                        <div class="form-group" style="flex: 1; min-width: 200px;">
                            <label>Class *</label>
                            <select name="classId" onchange="StudentsModule.updateSections()" id="classSelect" required>
                                <option value="">Select Class</option>
                                ${classes.map(c => `<option value="${c.id}" ${student.classId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group" style="flex: 1; min-width: 200px;">
                            <label>Section *</label>
                            <select name="section" id="sectionSelect" required>
                                <option value="${student.section || ''}">${student.section || 'Select Class First'}</option>
                            </select>
                        </div>
                    </div>

                    <div class="d-flex" style="gap: 20px; flex-wrap: wrap;">
                        <div class="form-group" style="flex: 1; min-width: 200px;">
                            <label>Roll Number *</label>
                            <input type="number" name="rollNo" value="${student.rollNo || ''}" required>
                        </div>
                        <div class="form-group" style="flex: 1; min-width: 200px;">
                            <label>Phone</label>
                            <input type="tel" name="phone" value="${student.phone || ''}">
                        </div>
                    </div>

                     <div class="form-group">
                        <label>Address</label>
                        <textarea name="address" rows="3">${student.address || ''}</textarea>
                    </div>

                    <div class="text-center mt-2">
                        <button type="submit" class="btn btn-primary" style="padding: 12px 30px; font-size: 16px;">
                            <i class="fas fa-save"></i> Save Student
                        </button>
                    </div>
                </form>
            </div>
        `;

        StudentsModule.container.innerHTML = html;
        if (id || student.classId) {
            StudentsModule.updateSections(student.section);
        }
    },

    updateSections: (selectedSection = null) => {
        const classId = document.getElementById('classSelect').value;
        const sectionSelect = document.getElementById('sectionSelect');
        const classes = Storage.get('sms_classes') || [];
        const selectedClass = classes.find(c => c.id === classId);

        sectionSelect.innerHTML = '<option value="">Select Section</option>';
        if (selectedClass) {
            selectedClass.sections.forEach(sec => {
                sectionSelect.innerHTML += `<option value="${sec}" ${selectedSection === sec ? 'selected' : ''}>${sec}</option>`;
            });
        }
    },

    saveStudent: (e, id) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const studentData = Object.fromEntries(formData.entries());

        if (id) {
            // Update
            const success = Storage.update('sms_students', id, studentData);
            if (success) Utils.showToast('Student updated successfully', 'success');
        } else {
            // Add
            studentData.id = Utils.generateId('s');
            studentData.feesPaid = false; // Default
            Storage.add('sms_students', studentData);
            Utils.showToast('Student added successfully', 'success');
        }

        StudentsModule.renderList();
    },

    deleteStudent: (id) => {
        if (confirm('Are you sure you want to delete this student?')) {
            Storage.delete('sms_students', id);
            Utils.showToast('Student deleted', 'error');
            StudentsModule.renderList();
        }
    },

    filterStudents: () => {
        const query = document.getElementById('studentSearch').value.toLowerCase();
        const rows = document.querySelectorAll('#studentsTableBody tr');

        rows.forEach(row => {
            const text = row.innerText.toLowerCase();
            row.style.display = text.includes(query) ? '' : 'none';
        });
    }
};
