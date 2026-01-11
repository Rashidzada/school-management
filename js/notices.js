/**
 * Notices Module
 * Handles Announcements and Notice Board
 */

const NoticesModule = {
    init: (container) => {
        NoticesModule.container = container;
        NoticesModule.renderList();
    },

    renderList: () => {
        const notices = Storage.get('sms_notices') || [];

        let html = `
            <div class="d-flex justify-between align-center" style="margin-bottom: 20px;">
                <h2>Notice Board</h2>
                <button class="btn btn-primary" onclick="NoticesModule.renderForm()">
                    <i class="fas fa-plus"></i> Post Notice
                </button>
            </div>

            <div class="stat-cards-grid">
                ${notices.length === 0 ? '<p>No notices available.</p>' : ''}
                ${notices.map(n => `
                    <div class="card" style="border-left: 5px solid var(--accent-color);">
                        <div class="d-flex justify-between">
                            <h3 style="margin-bottom: 10px;">${n.title}</h3>
                            <button class="btn btn-danger" onclick="NoticesModule.deleteNotice('${n.id}')" style="padding: 5px 10px; height: 30px;"><i class="fas fa-trash"></i></button>
                        </div>
                        <p style="color: var(--text-light); margin-bottom: 15px; font-size: 14px;">${Utils.formatDate(n.date)}</p>
                        <p>${n.content}</p>
                        <span style="display: inline-block; background: #eee; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-top: 10px;">${n.priority ? n.priority.toUpperCase() : 'NORMAL'} Priority</span>
                    </div>
                `).join('')}
            </div>
        `;

        NoticesModule.container.innerHTML = html;
    },

    renderForm: () => {
        const today = new Date().toISOString().split('T')[0];
        const html = `
            <div class="card" style="max-width: 600px; margin: 0 auto;">
                <h3>Post New Notice</h3>
                <form onsubmit="NoticesModule.saveNotice(event)">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" name="title" required placeholder="e.g. Holiday Announcement">
                    </div>
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" name="date" value="${today}" required>
                    </div>
                    <div class="form-group">
                        <label>Priority</label>
                        <select name="priority">
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Content</label>
                        <textarea name="content" rows="5" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Post Notice</button>
                    <button type="button" class="btn mt-2" onclick="NoticesModule.renderList()" style="width: 100%;">Cancel</button>
                </form>
            </div>
        `;
        NoticesModule.container.innerHTML = html;
    },

    saveNotice: (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.id = Utils.generateId('n');

        Storage.add('sms_notices', data);
        Utils.showToast('Notice posted', 'success');
        NoticesModule.renderList();
    },

    deleteNotice: (id) => {
        if (confirm('Delete this notice?')) {
            Storage.delete('sms_notices', id);
            NoticesModule.renderList();
        }
    }
};
