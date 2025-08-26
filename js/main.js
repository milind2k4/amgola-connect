// main.js

// Import weather functions
import { initWeather } from './weather.js';
import { initAuth, logout } from './auth.js';

// Initialize modules when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initWeather();
    initAuth();

    // Initialize dropdowns
    const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    const dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
        return new bootstrap.Dropdown(dropdownToggleEl);
    });

    // Add logout handler
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
});