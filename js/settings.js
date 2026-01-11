/**
 * Settings Module
 * Handles Application Settings
 */

const SettingsModule = {
    init: (container) => {
        SettingsModule.container = container;
        SettingsModule.render();
    },

    render: () => {
        const settings = Storage.get('sms_settings') || {};

        const html = `
            <h2>System Settings</h2>
            
            <div class="card" style="max-width: 600px;">
                <h3>General Settings</h3>
                <form onsubmit="SettingsModule.saveSettings(event)">
                    <div class="form-group">
                        <label>School Name</label>
                        <input type="text" name="schoolName" value="${settings.schoolName || ''}">
                    </div>
                     <div class="form-group">
                        <label>Current Session</label>
                        <input type="text" name="currentSession" value="${settings.currentSession || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label>Theme</label>
                        <select name="theme" id="themeSelect">
                            <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Light</option>
                            <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
                        </select>
                    </div>

                    <button type="submit" class="btn btn-primary">Save Settings</button>
                </form>
            </div>

            <div class="card" style="max-width: 600px; border-left: 5px solid var(--danger-color);">
                <h3 style="color: var(--danger-color);">Danger Zone</h3>
                <p>Resetting data will delete all students, teachers, classes, and records from this browser.</p>
                <button class="btn btn-danger mt-2" onclick="SettingsModule.resetData()">
                    <i class="fas fa-trash"></i> Factory Reset Data
                </button>
            </div>
        `;

        SettingsModule.container.innerHTML = html;
    },

    saveSettings: (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newSettings = Object.fromEntries(formData.entries());

        const currentSettings = Storage.get('sms_settings') || {};
        const merged = { ...currentSettings, ...newSettings };

        Storage.save('sms_settings', merged);
        Utils.showToast('Settings Saved', 'success');

        // Apply Theme
        if (merged.theme === 'dark') {
            document.body.style.filter = 'invert(1) hue-rotate(180deg)'; // Poor man's dark mode or proper class toggle
            // NOTE: A proper dark mode implementation would toggle a class on body. 
            // In main.css we have defined vars. We can update vars.
            // For now, let's just save the preference. Logic to Apply it would be in App.init() or main.js
        } else {
            document.body.style.filter = 'none';
        }
    },

    resetData: () => {
        if (confirm('CRITICAL WARNING: This will delete ALL data. Are you sure?')) {
            localStorage.clear();
            window.location.reload();
        }
    }
};
