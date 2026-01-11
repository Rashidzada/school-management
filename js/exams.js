/**
 * Exams Module
 * Handles Exam Creation, Marks Entry, and Results
 */

const ExamsModule = {
    init: (container) => {
        ExamsModule.container = container;
        ExamsModule.renderList();
    },

    renderList: () => {
        const exams = Storage.get('sms_exams') || [];

        let html = `
            <div class="d-flex justify-between align-center" style="margin-bottom: 20px;">
                <h2>Examination Management</h2>
                <button class="btn btn-primary" onclick="ExamsModule.renderForm()">
                    <i class="fas fa-plus"></i> Create New Exam
                </button>
            </div>

            <div class="card">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f8f9fa; border-bottom: 2px solid #e9ecef;">
                            <th style="padding: 12px; text-align: left;">Exam Name</th>
                            <th style="padding: 12px; text-align: left;">Date</th>
                            <th style="padding: 12px; text-align: left;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${exams.length === 0 ? '<tr><td colspan="3" class="text-center p-3">No exams found</td></tr>' : ''}
                        ${exams.map(e => `
                            <tr>
                                <td style="padding: 12px;"><strong>${e.name}</strong></td>
                                <td style="padding: 12px;">${Utils.formatDate(e.date)}</td>
                                <td style="padding: 12px;">
                                    <button class="btn" onclick="ExamsModule.renderMarksEntry('${e.id}')" style="color: var(--secondary-color);">
                                        <i class="fas fa-edit"></i> Enter Marks
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        ExamsModule.container.innerHTML = html;
    },

    renderForm: () => {
        const html = `
            <div class="card">
                <h3>Create New Exam</h3>
                <form onsubmit="ExamsModule.saveExam(event)">
                    <div class="form-group">
                        <label>Exam Name</label>
                        <input type="text" name="name" required placeholder="e.g. Mid Term 2026">
                    </div>
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="date" name="date" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Create Exam</button>
                    <button type="button" class="btn" onclick="ExamsModule.renderList()">Cancel</button>
                </form>
            </div>
        `;
        ExamsModule.container.innerHTML = html;
    },

    saveExam: (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newExam = {
            id: Utils.generateId('e'),
            name: formData.get('name'),
            date: formData.get('date'),
            results: [] // Store { studentId, subject, marks, total }
        };
        Storage.add('sms_exams', newExam);
        Utils.showToast('Exam created', 'success');
        ExamsModule.renderList();
    },

    renderMarksEntry: (examId) => {
        const exams = Storage.get('sms_exams');
        const exam = exams.find(e => e.id === examId);
        const classes = Storage.get('sms_classes') || [];

        const html = `
            <div class="card">
                <div class="d-flex justify-between align-center" style="margin-bottom: 20px;">
                    <h3>Marks Entry: ${exam.name}</h3>
                    <button class="btn" onclick="ExamsModule.renderList()">Back</button>
                </div>
                
                <form onsubmit="ExamsModule.loadStudentsForMarks(event, '${examId}')">
                    <div class="d-flex" style="gap: 15px;">
                        <div class="form-group" style="flex: 1;">
                            <label>Class</label>
                            <select name="classId" id="examClassSelect" onchange="ExamsModule.updateSections()" required>
                                <option value="">Select Class</option>
                                ${classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group" style="flex: 1;">
                            <label>Section</label>
                            <select name="section" id="examSectionSelect" required>
                                <option value="">Select Class First</option>
                            </select>
                        </div>
                         <div class="form-group" style="flex: 1;">
                            <label>Subject</label>
                            <select name="subject" id="examSubjectSelect" required>
                                <option value="">Select Class First</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Load Students</button>
                </form>
                
                <div id="marksTableContainer" style="margin-top: 20px;"></div>
            </div>
        `;
        ExamsModule.container.innerHTML = html;
        window.tempExamId = examId; // Hack to store ID for onchange helpers if needed
    },

    updateSections: () => {
        const classId = document.getElementById('examClassSelect').value;
        const sectionSelect = document.getElementById('examSectionSelect');
        const subjectSelect = document.getElementById('examSubjectSelect');
        const classes = Storage.get('sms_classes') || [];
        const selectedClass = classes.find(c => c.id === classId);

        sectionSelect.innerHTML = '<option value="">Select Section</option>';
        subjectSelect.innerHTML = '<option value="">Select Subject</option>';

        if (selectedClass) {
            selectedClass.sections.forEach(sec => {
                sectionSelect.innerHTML += `<option value="${sec}">${sec}</option>`;
            });
            if (selectedClass.subjects) {
                selectedClass.subjects.forEach(sub => {
                    subjectSelect.innerHTML += `<option value="${sub.name}">${sub.name}</option>`;
                });
            }
        }
    },

    loadStudentsForMarks: (e, examId) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const classId = formData.get('classId');
        const section = formData.get('section');
        const subject = formData.get('subject');

        const students = Storage.get('sms_students').filter(s => s.classId === classId && s.section === section);
        const exams = Storage.get('sms_exams');
        const exam = exams.find(e => e.id === examId);

        let html = `
            <h4>Enter Marks for ${subject}</h4>
            <form onsubmit="ExamsModule.saveMarks(event, '${examId}', '${classId}', '${section}', '${subject}')">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                         <tr style="background: #f8f9fa;">
                            <th style="padding: 10px;">Roll No</th>
                            <th style="padding: 10px;">Name</th>
                            <th style="padding: 10px;">Marks Obtained</th>
                            <th style="padding: 10px;">Total Marks</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${students.map(s => {
            const existingResult = exam.results ? exam.results.find(r => r.studentId === s.id && r.subject === subject) : null;
            const obtained = existingResult ? existingResult.marks : '';
            const total = existingResult ? existingResult.total : 100;
            return `
                                <tr>
                                    <td style="padding: 10px;">${s.rollNo}</td>
                                    <td style="padding: 10px;">${s.name}</td>
                                    <td style="padding: 10px;"><input type="number" name="marks_${s.id}" value="${obtained}" required style="width: 80px;"></td>
                                    <td style="padding: 10px;"><input type="number" name="total_${s.id}" value="${total}" required style="width: 80px;"></td>
                                </tr>
                            `;
        }).join('')}
                    </tbody>
                </table>
                <div class="mt-2">
                    <button type="submit" class="btn btn-primary">Save Marks</button>
                </div>
            </form>
        `;
        document.getElementById('marksTableContainer').innerHTML = html;
    },

    saveMarks: (e, examId, classId, section, subject) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const exams = Storage.get('sms_exams');
        const examIndex = exams.findIndex(e => e.id === examId);
        const exam = exams[examIndex];

        if (!exam.results) exam.results = [];

        const students = Storage.get('sms_students').filter(s => s.classId === classId && s.section === section);

        // Remove old marks for this subject/class group to avoid dupes (naive approach)
        // Better: update specific entries

        students.forEach(s => {
            const marks = formData.get(`marks_${s.id}`);
            const total = formData.get(`total_${s.id}`);

            // Remove existing
            exam.results = exam.results.filter(r => !(r.studentId === s.id && r.subject === subject));

            // Add new
            exam.results.push({
                studentId: s.id,
                subject: subject,
                marks: parseInt(marks),
                total: parseInt(total)
            });
        });

        Storage.save('sms_exams', exams);
        Utils.showToast('Marks saved successfully', 'success');
    }
};
