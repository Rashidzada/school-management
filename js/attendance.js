/**
 * Attendance Module
 * Handles Daily Attendance Marking and Reporting
 */

const AttendanceModule = {
    init: (container) => {
        AttendanceModule.container = container;
        AttendanceModule.renderLanding();
    },

    renderLanding: () => {
        const classes = Storage.get('sms_classes') || [];
        const today = new Date().toISOString().split('T')[0];

        let html = `
            <h2>Attendance Management</h2>
            <div class="card" style="max-width: 600px; margin: 20px auto;">
                <h3 style="margin-bottom: 20px;">Mark Attendance</h3>
                <form onsubmit="AttendanceModule.loadSheet(event)">
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" name="date" value="${today}" required>
                    </div>
                    <div class="form-group">
                        <label>Class</label>
                        <select name="classId" id="attClassSelect" onchange="AttendanceModule.updateSections()" required>
                            <option value="">Select Class</option>
                            ${classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Section</label>
                        <select name="section" id="attSectionSelect" required>
                             <option value="">Select Class First</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Load Students</button>
                </form>
            </div>
        `;
        AttendanceModule.container.innerHTML = html;
    },

    updateSections: () => {
        const classId = document.getElementById('attClassSelect').value;
        const sectionSelect = document.getElementById('attSectionSelect');
        const classes = Storage.get('sms_classes') || [];
        const selectedClass = classes.find(c => c.id === classId);

        sectionSelect.innerHTML = '<option value="">Select Section</option>';
        if (selectedClass) {
            selectedClass.sections.forEach(sec => {
                sectionSelect.innerHTML += `<option value="${sec}">${sec}</option>`;
            });
        }
    },

    loadSheet: (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const date = formData.get('date');
        const classId = formData.get('classId');
        const section = formData.get('section');

        const classes = Storage.get('sms_classes');
        const cls = classes.find(c => c.id === classId);

        // Get Students
        const students = Storage.get('sms_students').filter(s => s.classId === classId && s.section === section);

        if (students.length === 0) {
            Utils.showToast('No students found in this class/section', 'error');
            return;
        }

        // Get Existing Attendance
        const attendanceRecords = Storage.get('sms_attendance') || [];
        const existingRecord = attendanceRecords.find(r => r.date === date && r.classId === classId && r.section === section);

        const records = existingRecord ? existingRecord.records : [];

        let html = `
             <div class="d-flex justify-between align-center" style="margin-bottom: 20px;">
                <h3>Attendance: ${cls.name} (${section}) - ${date}</h3>
                <button class="btn" onclick="AttendanceModule.renderLanding()" style="background: #e2e6ea; color: #2c3e50;">
                    <i class="fas fa-arrow-left"></i> Change Selection
                </button>
            </div>

            <div class="card">
                <form onsubmit="AttendanceModule.saveAttendance(event, '${date}', '${classId}', '${section}')">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8f9fa; border-bottom: 2px solid #e9ecef;">
                                <th style="padding: 12px; text-align: left;">Roll No</th>
                                <th style="padding: 12px; text-align: left;">Name</th>
                                <th style="padding: 12px; text-align: center;">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${students.map(s => {
            const status = records.find(r => r.studentId === s.id)?.status || 'Present';
            return `
                                    <tr style="border-bottom: 1px solid #e9ecef;">
                                        <td style="padding: 12px;">${s.rollNo}</td>
                                        <td style="padding: 12px;">${s.name}</td>
                                        <td style="padding: 12px; text-align: center;">
                                            <label style="margin-right: 15px; cursor: pointer;">
                                                <input type="radio" name="status_${s.id}" value="Present" ${status === 'Present' ? 'checked' : ''}> Present
                                            </label>
                                            <label style="margin-right: 15px; cursor: pointer;">
                                                <input type="radio" name="status_${s.id}" value="Absent" ${status === 'Absent' ? 'checked' : ''} style="accent-color: var(--danger-color);"> Absent
                                            </label>
                                            <label style="cursor: pointer;">
                                                <input type="radio" name="status_${s.id}" value="Leave" ${status === 'Leave' ? 'checked' : ''} style="accent-color: var(--accent-color);"> Leave
                                            </label>
                                        </td>
                                    </tr>
                                `;
        }).join('')}
                        </tbody>
                    </table>
                    <div class="text-center mt-2">
                        <button type="submit" class="btn btn-primary" style="padding: 12px 40px; font-size: 16px;">
                            <i class="fas fa-check-circle"></i> Save Attendance
                        </button>
                    </div>
                </form>
            </div>
        `;

        AttendanceModule.container.innerHTML = html;
    },

    saveAttendance: (e, date, classId, section) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const records = [];
        const students = Storage.get('sms_students').filter(s => s.classId === classId && s.section === section);

        students.forEach(s => {
            records.push({
                studentId: s.id,
                status: formData.get(`status_${s.id}`)
            });
        });

        const attendanceEntry = {
            date,
            classId,
            section,
            records
        };

        let allAttendance = Storage.get('sms_attendance') || [];
        // Remove existing if any
        allAttendance = allAttendance.filter(r => !(r.date === date && r.classId === classId && r.section === section));

        allAttendance.push(attendanceEntry);
        Storage.save('sms_attendance', allAttendance);

        Utils.showToast('Attendance Saved Successfully', 'success');
        AttendanceModule.renderLanding();
    }
};
