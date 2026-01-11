/**
 * Fees Module
 * Handles Fee Collection and Tracking
 */

const FeesModule = {
    init: (container) => {
        FeesModule.container = container;
        FeesModule.renderList();
    },

    renderList: () => {
        const fees = Storage.get('sms_fees') || [];

        let html = `
            <div class="d-flex justify-between align-center" style="margin-bottom: 20px;">
                <h2>Fees Management</h2>
                <button class="btn btn-primary" onclick="FeesModule.renderForm()">
                    <i class="fas fa-plus"></i> Collect Fee
                </button>
            </div>

            <div class="card">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f8f9fa;">
                            <th style="padding: 12px; text-align: left;">Receipt ID</th>
                            <th style="padding: 12px; text-align: left;">Student</th>
                            <th style="padding: 12px; text-align: left;">Month</th>
                            <th style="padding: 12px; text-align: left;">Amount</th>
                            <th style="padding: 12px; text-align: left;">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                         ${fees.length === 0 ? '<tr><td colspan="5" class="text-center p-3">No fee records found</td></tr>' : ''}
                         ${fees.map(f => {
            const student = Storage.get('sms_students').find(s => s.id === f.studentId);
            return `
                                <tr>
                                    <td style="padding: 10px;">#${f.id}</td>
                                    <td style="padding: 10px;">${student ? student.name : 'Unknown'}</td>
                                    <td style="padding: 10px;">${f.month}</td>
                                    <td style="padding: 10px;">$${f.amount}</td>
                                    <td style="padding: 10px;">${Utils.formatDate(f.date)}</td>
                                </tr>
                             `;
        }).join('')}
                    </tbody>
                </table>
            </div>
        `;

        FeesModule.container.innerHTML = html;
    },

    renderForm: () => {
        const students = Storage.get('sms_students') || [];
        const today = new Date().toISOString().split('T')[0];

        const html = `
            <div class="card" style="max-width: 500px; margin: 0 auto;">
                <h3>Collect Fees</h3>
                <form onsubmit="FeesModule.saveFee(event)">
                    <div class="form-group">
                        <label>Select Student</label>
                        <select name="studentId" required style="width: 100%;">
                            <option value="">Select Student</option>
                            ${students.map(s => `<option value="${s.id}">${s.name} (Class ${s.classId}-${s.section})</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                         <label>Month</label>
                         <select name="month" required>
                            <option value="January">January</option>
                            <option value="February">February</option>
                            <option value="March">March</option>
                            <option value="April">April</option>
                            <option value="May">May</option>
                            <option value="June">June</option>
                            <option value="July">July</option>
                            <option value="August">August</option>
                            <option value="September">September</option>
                            <option value="October">October</option>
                            <option value="November">November</option>
                            <option value="December">December</option>
                         </select>
                    </div>
                    <div class="form-group">
                        <label>Amount</label>
                        <input type="number" name="amount" required placeholder="500">
                    </div>
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" name="date" value="${today}" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Record Payment</button>
                    <button type="button" class="btn mt-2" onclick="FeesModule.renderList()" style="width: 100%;">Cancel</button>
                </form>
            </div>
        `;
        FeesModule.container.innerHTML = html;
    },

    saveFee: (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.id = Utils.generateId('r');

        Storage.add('sms_fees', data);
        Utils.showToast('Fee recorded successfully', 'success');
        FeesModule.renderList();
    }
};
