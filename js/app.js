/**
 * App.js - Main Dashboard Controller
 */

const App = {
    init: () => {
        // Check Auth
        const session = Auth.checkSession();
        if (!session) return;

        // Set User Info
        document.getElementById('userName').innerText = session.name;

        // Setup Sidebar Navigation
        App.setupNavigation();

        // Setup Logout
        document.getElementById('logoutBtn').addEventListener('click', Auth.logout);

        // Sidebar Toggle for Mobile
        const sidebar = document.querySelector('.sidebar');
        const toggle = document.getElementById('sidebarToggle');
        toggle.addEventListener('click', () => {
            // Simple toggle implementation
            if (sidebar.style.width === '0px' || getComputedStyle(sidebar).width === '0px') {
                sidebar.style.width = '250px';
            } else {
                sidebar.style.width = '0px';
            }
        });

        // Load Default View
        App.loadView('home');
    },

    setupNavigation: () => {
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                // Active Class
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Load View
                const viewName = link.getAttribute('data-view');
                App.loadView(viewName);
            });
        });
    },

    loadView: (viewName) => {
        const container = document.getElementById('appContainer');
        container.innerHTML = '<div class="text-center mt-2"><i class="fas fa-spinner fa-spin fa-2x"></i></div>';

        setTimeout(() => {
            switch (viewName) {
                case 'home':
                    App.renderHome(container);
                    break;
                case 'students':
                    if (typeof StudentsModule !== 'undefined') {
                        StudentsModule.init(container);
                    } else {
                        container.innerHTML = '<h3>Loading Students Module...</h3>';
                        // Logic to lazy load or just show error if script missing
                    }
                    break;
                case 'teachers':
                    if (typeof TeachersModule !== 'undefined') {
                        TeachersModule.init(container);
                    } else {
                        container.innerHTML = '<h3>Loading Teachers Module...</h3>';
                    }
                    break;
                case 'classes':
                    if (typeof ClassesModule !== 'undefined') {
                        ClassesModule.init(container);
                    } else {
                        container.innerHTML = '<h3>Loading Classes Module...</h3>';
                    }
                    break;
                case 'attendance':
                    if (typeof AttendanceModule !== 'undefined') {
                        AttendanceModule.init(container);
                    } else {
                        container.innerHTML = '<h3>Loading Attendance Module...</h3>';
                    }
                    break;
                case 'exams':
                    if (typeof ExamsModule !== 'undefined') {
                        ExamsModule.init(container);
                    } else {
                        container.innerHTML = '<h3>Loading Exams Module...</h3>';
                    }
                    break;
                case 'fees':
                    if (typeof FeesModule !== 'undefined') {
                        FeesModule.init(container);
                    } else {
                        container.innerHTML = '<h3>Loading Fees Module...</h3>';
                    }
                    break;
                case 'notices':
                    if (typeof NoticesModule !== 'undefined') {
                        NoticesModule.init(container);
                    } else {
                        container.innerHTML = '<h3>Loading Notices Module...</h3>';
                    }
                    break;
                case 'settings':
                    if (typeof SettingsModule !== 'undefined') {
                        SettingsModule.init(container);
                    } else {
                        container.innerHTML = '<h3>Loading Settings Module...</h3>';
                    }
                    break;
                default:
                    container.innerHTML = '<h3>Page Not Found</h3>';
            }
        }, 300); // Simulate smooth transition
    },

    renderHome: (container) => {
        const students = Storage.get('sms_students') || [];
        const teachers = Storage.get('sms_teachers') || [];
        const classes = Storage.get('sms_classes') || [];

        container.innerHTML = `
            <h2 style="margin-bottom: 20px;">Dashboard Overview</h2>
            
            <div class="stat-cards-grid">
                <div class="stat-card">
                    <div class="stat-info">
                        <h3>${students.length}</h3>
                        <p>Total Students</p>
                    </div>
                    <div class="stat-icon">
                        <i class="fas fa-user-graduate"></i>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-info">
                        <h3>${teachers.length}</h3>
                        <p>Total Teachers</p>
                    </div>
                    <div class="stat-icon">
                        <i class="fas fa-chalkboard-teacher"></i>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-info">
                        <h3>${classes.length}</h3>
                        <p>Total Classes</p>
                    </div>
                    <div class="stat-icon">
                        <i class="fas fa-school"></i>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-info">
                        <h3>95%</h3>
                        <p>Avg Attendance</p>
                    </div>
                    <div class="stat-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                </div>
            </div>

            <div class="card">
                <h3>Quick Actions</h3>
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button class="btn btn-primary" onclick="App.triggerNav('students')"><i class="fas fa-plus"></i> Add Student</button>
                    <button class="btn btn-primary" onclick="App.triggerNav('attendance')"><i class="fas fa-check"></i> Mark Attendance</button>
                </div>
            </div>
        `;
    },

    triggerNav: (viewName) => {
        const link = document.querySelector(`.nav-link[data-view="${viewName}"]`);
        if (link) link.click();
    }
};

// Start
document.addEventListener('DOMContentLoaded', App.init);
