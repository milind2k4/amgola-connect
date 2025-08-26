// Import Firebase auth
import { auth } from './firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

document.addEventListener('DOMContentLoaded', function () {
    // Check auth state
    onAuthStateChanged(auth, (user) => {
        const loginBtn = document.querySelector('[data-bs-target="#loginModal"]');
        const userDropdown = document.getElementById('userDropdown');

        if (user) {
            // User is signed in
            if (loginBtn) loginBtn.classList.add('d-none');
            if (userDropdown) {
                userDropdown.classList.remove('d-none');
                // Update the user's name in the dropdown if needed
                const profileLink = document.getElementById('profileLink');
                if (profileLink && user.displayName) {
                    profileLink.innerHTML = `<i class="bi-person me-2"></i>${user.displayName}`;
                }
            }
        } else {
            // User is signed out
            if (loginBtn) {
                loginBtn.classList.remove('d-none');
                loginBtn.innerHTML = '<i class="bi-box-arrow-in-right me-1"></i> Login';
                loginBtn.classList.remove('btn-light');
                loginBtn.classList.add('btn-outline-light');
                loginBtn.setAttribute('data-bs-target', '#loginModal');
            }
            if (userDropdown) userDropdown.classList.add('d-none');
        }
    });

    // Initialize date picker
    flatpickr("#dateRange", {
        mode: "range",
        dateFormat: "Y-m-d",
        onClose: filterAnnouncements
    });

    // Initialize Masonry layout
    const grid = document.getElementById('announcementsGrid');
    const masonry = new Masonry(grid, {
        itemSelector: '.announcement-col',
        columnWidth: '.announcement-col',
        percentPosition: true,
        transitionDuration: 0
    });

    // Sample data - in a real app, this would come from an API
    const announcements = [
        {
            id: 1,
            title: 'Water Supply Interruption',
            content: 'There will be a temporary water supply interruption on Main Street from 9 AM to 5 PM tomorrow for maintenance work. Please store water accordingly.',
            priority: 'high',
            importance: 'critical',
            date: '2023-06-15',
            fullContent: 'There will be a temporary water supply interruption on Main Street from 9 AM to 5 PM tomorrow for maintenance work. The water department will be conducting essential repairs to the main pipeline. We apologize for any inconvenience caused and appreciate your understanding. For emergencies, please contact the water department at 555-1234.'
        },
        {
            id: 2,
            title: 'Community Clean-up Day',
            content: 'Join us for our monthly community clean-up day this Saturday from 8 AM to 12 PM. Gloves and bags will be provided.',
            priority: 'medium',
            importance: 'important',
            date: '2023-06-20',
            fullContent: "Join us for our monthly community clean-up day this Saturday from 8 AM to 12 PM. We'll be meeting at the community center.Gloves, bags, and refreshments will be provided.This is a great opportunity to meet your neighbors and help keep our community clean and beautiful.Children are welcome when accompanied by an adult."
        },
        {
            id: 3,
            title: 'New Park Bench Installation',
            content: 'New benches have been installed in the community park. Enjoy the new seating areas!',
            priority: 'low',
            importance: 'normal',
            date: '2023-06-18',
            fullContent: 'We are pleased to announce the installation of 10 new benches throughout the community park. These benches were funded by the community development fund and are made from recycled materials. Please help us take care of this new addition to our community space. If you notice any issues with the benches, please report them to the community office.'
        },
        // Add more announcements as needed
    ];

    // Display announcements
    function displayAnnouncements(announcementsToShow = announcements) {
        grid.innerHTML = '';

        announcementsToShow.forEach(announcement => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4 announcement-col';

            // Determine card class based on priority and importance
            let cardClass = 'announcement-card';
            if (announcement.priority === 'high' && announcement.importance === 'critical') {
                cardClass += ' critical-high';
            } else if (announcement.priority === 'medium' && announcement.importance === 'important') {
                cardClass += ' important-medium';
            } else if (announcement.priority === 'low' && announcement.importance === 'normal') {
                cardClass += ' normal-low';
            }

            col.innerHTML = `
                <div class="card ${cardClass}" data-id="${announcement.id}">
                    <div class="card-body">
                        <h5 class="card-title">${announcement.title}</h5>
                        <p class="card-text">${announcement.content}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="badge badge-priority-${announcement.priority}">
                                ${announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                            </span>
                            <span class="badge badge-importance-${announcement.importance}">
                                ${announcement.importance.charAt(0).toUpperCase() + announcement.importance.slice(1)}
                            </span>
                        </div>
                        <small class="text-muted d-block mt-2">${formatDate(announcement.date)}</small>
                    </div>
                </div>
            `;

            grid.appendChild(col);

            // Add click event to open modal
            col.querySelector('.card').addEventListener('click', () => openAnnouncementModal(announcement));
        });

        // Refresh Masonry layout
        masonry.reloadItems();
        masonry.layout();
    }

    // Filter announcements based on selected filters
    function filterAnnouncements() {
        const priorityFilter = document.getElementById('priorityFilter').value;
        const importanceFilter = document.getElementById('importanceFilter').value;
        const dateRange = document.getElementById('dateRange').value;

        let filtered = [...announcements];

        if (priorityFilter) {
            filtered = filtered.filter(a => a.priority === priorityFilter);
        }

        if (importanceFilter) {
            filtered = filtered.filter(a => a.importance === importanceFilter);
        }

        if (dateRange) {
            const [start, end] = dateRange.split(' to ').map(d => new Date(d));
            filtered = filtered.filter(a => {
                const announcementDate = new Date(a.date);
                return (!start || announcementDate >= start) &&
                    (!end || announcementDate <= new Date(end.getTime() + 24 * 60 * 60 * 1000));
            });
        }

        displayAnnouncements(filtered);
    }

    // Open announcement in modal
    function openAnnouncementModal(announcement) {
        document.getElementById('announcementTitle').textContent = announcement.title;
        document.getElementById('announcementContent').textContent = announcement.fullContent || announcement.content;
        document.getElementById('announcementDate').textContent = formatDate(announcement.date);

        const priorityBadge = document.getElementById('modalPriority');
        priorityBadge.textContent = announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1) + ' Priority';
        priorityBadge.className = `badge me-2 badge-priority-${announcement.priority}`;

        const importanceBadge = document.getElementById('modalImportance');
        importanceBadge.textContent = announcement.importance.charAt(0).toUpperCase() + announcement.importance.slice(1);
        importanceBadge.className = `badge badge-importance-${announcement.importance}`;

        const modal = new bootstrap.Modal(document.getElementById('announcementModal'));
        modal.show();
    }

    // Format date as Month Day, Year
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Event listeners for filters
    document.getElementById('priorityFilter').addEventListener('change', filterAnnouncements);
    document.getElementById('importanceFilter').addEventListener('change', filterAnnouncements);

    // Initial display of announcements
    displayAnnouncements();

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            masonry.layout();
        }, 250);
    });
});
