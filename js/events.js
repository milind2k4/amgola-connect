import { auth } from './firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

// Sample data - in a real app, this would come from a database
const events = [
    {
        id: 1,
        title: 'Community Picnic',
        description: 'Join us for our annual community picnic with food, games, and activities for all ages!',
        type: 'community',
        date: '2023-07-15',
        time: '11:00',
        location: 'Central Park, Main Street',
        contact: '+1 (555) 123-4567',
        fullDescription: 'Our annual community picnic is back! Bring your family and friends for a day of fun in the sun. We\'ll have BBQ, live music, games for kids, and plenty of activities. Don\'t forget to bring your picnic blankets and sunscreen!',
        coordinates: { lat: 40.7128, lng: -74.0060 } // Sample coordinates for New York
    },
    {
        id: 2,
        title: 'Yoga in the Park',
        description: 'Start your weekend with a relaxing yoga session in the park. All levels welcome!',
        type: 'sports',
        date: '2023-07-16',
        time: '08:00',
        location: 'Riverside Park',
        contact: '+1 (555) 987-6543',
        fullDescription: 'Join us for a peaceful morning of yoga in the beautiful Riverside Park. This all-levels class is perfect for beginners and experienced yogis alike. Please bring your own mat and water bottle. Donations welcome to support local community programs.',
        coordinates: { lat: 40.7851, lng: -73.9683 }
    },
    {
        id: 3,
        title: 'Book Club Meeting',
        description: 'This month we\'re discussing "The Midnight Library" by Matt Haig.',
        type: 'educational',
        date: '2023-07-20',
        time: '19:00',
        location: 'Community Library, 123 Book St',
        contact: '+1 (555) 456-7890',
        fullDescription: 'Our book club meets monthly to discuss contemporary fiction. This month\'s selection is "The Midnight Library" by Matt Haig. New members are always welcome! Light refreshments will be served. Please RSVP to ensure we have enough copies of the book available.',
        coordinates: { lat: 40.7580, lng: -73.9855 }
    },
    {
        id: 4,
        title: 'Neighborhood Cleanup',
        description: 'Help keep our community clean and beautiful. Gloves and bags provided!',
        type: 'community',
        date: '2023-07-22',
        time: '09:00',
        location: 'Meet at Community Center',
        contact: '+1 (555) 234-5678',
        fullDescription: 'Join your neighbors for our monthly community cleanup day. We\'ll be picking up litter, weeding public spaces, and doing light landscaping. All necessary equipment will be provided. This is a great opportunity to meet your neighbors and make a positive impact on our community. Volunteers will receive a free t-shirt and lunch!',
        coordinates: { lat: 40.7306, lng: -73.9352 }
    },
    {
        id: 5,
        title: 'Summer Concert Series',
        description: 'Enjoy an evening of live music featuring local artists. Food trucks will be on site!',
        type: 'social',
        date: '2023-07-28',
        time: '18:30',
        location: 'Downtown Square',
        contact: '+1 (555) 876-5432',
        fullDescription: 'Our Summer Concert Series continues with performances by local bands and artists. Bring your lawn chairs and blankets for a relaxing evening of music under the stars. Food and beverages will be available for purchase from local vendors. Family-friendly event. No outside alcohol please.',
        coordinates: { lat: 40.7128, lng: -73.9352 }
    }
];

// DOM Elements
let eventsGrid;
let dateRangePicker;
let eventTypeFilter;
let radiusFilter;

// Current user's location (in a real app, this would come from geolocation)
const userLocation = { lat: 40.7128, lng: -73.9352 }; // Default to New York coordinates

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM elements
    eventsGrid = document.getElementById('eventsGrid');
    eventTypeFilter = document.getElementById('eventTypeFilter');
    radiusFilter = document.getElementById('radiusFilter');
    
    // Initialize date range picker
    dateRangePicker = flatpickr("#dateRange", {
        mode: "range",
        dateFormat: "Y-m-d",
        onClose: filterEvents
    });

    // Add event listeners
    eventTypeFilter.addEventListener('change', filterEvents);
    radiusFilter.addEventListener('change', filterEvents);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    
    // Check if user is logged in and update UI
    onAuthStateChanged(auth, (user) => {
        const createEventBtn = document.querySelector('[data-bs-target="#createEventModal"]');
        if (user) {
            // User is signed in
            if (createEventBtn) createEventBtn.classList.remove('d-none');
        } else {
            // User is signed out
            if (createEventBtn) createEventBtn.classList.add('d-none');
        }
    });

    // Initialize form submission for creating events
    const createEventForm = document.getElementById('createEventForm');
    if (createEventForm) {
        createEventForm.addEventListener('submit', handleCreateEvent);
    }

    // Display initial events
    displayEvents(events);
});

// Display events in the grid
function displayEvents(eventsToShow) {
    eventsGrid.innerHTML = '';
    
    if (eventsToShow.length === 0) {
        eventsGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi-calendar-x display-1 text-muted mb-3"></i>
                <h4>No events found</h4>
                <p class="text-muted">Try adjusting your filters or check back later for new events.</p>
            </div>
        `;
        return;
    }

    eventsToShow.forEach(event => {
        const eventDate = new Date(`${event.date}T${event.time}`);
        const now = new Date();
        const isPastEvent = eventDate < now;
        
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 event-col';
        
        col.innerHTML = `
            <div class="card event-card ${isPastEvent ? 'past-event' : ''}" data-id="${event.id}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge badge-${event.type}">${event.type}</span>
                        ${isPastEvent ? '<span class="badge bg-secondary">Past Event</span>' : ''}
                    </div>
                    <h5 class="card-title">${event.title}</h5>
                    <p class="card-text">${event.description}</p>
                    <div class="event-meta">
                        <div class="event-date">
                            <i class="bi-calendar-event"></i>
                            ${formatDate(event.date)} at ${formatTime(event.time)}
                        </div>
                        <div class="event-location">
                            <i class="bi-geo-alt"></i>
                            ${event.location}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add click event to open modal
        col.querySelector('.card').addEventListener('click', () => openEventModal(event));
        
        eventsGrid.appendChild(col);
    });
}

// Filter events based on selected filters
function filterEvents() {
    const selectedType = eventTypeFilter.value;
    const selectedRadius = parseInt(radiusFilter.value);
    const dateRange = dateRangePicker.selectedDates;
    
    let filteredEvents = [...events];
    
    // Filter by event type
    if (selectedType) {
        filteredEvents = filteredEvents.filter(event => event.type === selectedType);
    }
    
    // Filter by date range
    if (dateRange.length === 2) {
        const startDate = new Date(dateRange[0]);
        const endDate = new Date(dateRange[1]);
        
        filteredEvents = filteredEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= startDate && eventDate <= endDate;
        });
    }
    
    // Filter by location radius (simplified for this example)
    if (selectedRadius > 0) {
        filteredEvents = filteredEvents.filter(event => {
            // In a real app, you would calculate the distance between userLocation and event.coordinates
            // For this example, we'll just return a random selection
            return Math.random() > 0.3; // 70% chance of being within radius
        });
    }
    
    displayEvents(filteredEvents);
}

// Reset all filters
function resetFilters() {
    dateRangePicker.clear();
    eventTypeFilter.value = '';
    radiusFilter.value = '10';
    displayEvents(events);
}

// Open event details modal
function openEventModal(event) {
    const modal = new bootstrap.Modal(document.getElementById('eventModal'));
    const eventDate = new Date(`${event.date}T${event.time}`);
    
    // Update modal content
    document.getElementById('eventModalTitle').textContent = event.title;
    document.getElementById('eventTypeBadge').textContent = event.type;
    document.getElementById('eventTypeBadge').className = `badge badge-${event.type}`;
    document.getElementById('eventDateTime').textContent = `${formatDate(event.date)} at ${formatTime(event.time)}`;
    document.getElementById('eventLocation').textContent = event.location;
    document.getElementById('eventContact').textContent = event.contact;
    document.getElementById('eventContact').setAttribute('href', `tel:${event.contact.replace(/\D/g, '')}`);
    document.getElementById('eventDescription').innerHTML = event.fullDescription;
    
    // Update RSVP button state
    const rsvpButton = document.getElementById('rsvpButton');
    if (eventDate < new Date()) {
        rsvpButton.disabled = true;
        rsvpButton.innerHTML = '<i class="bi-calendar-x me-1"></i> Event Ended';
    } else {
        rsvpButton.disabled = false;
        rsvpButton.innerHTML = '<i class="bi-calendar-check me-1"></i> RSVP';
    }
    
    // Add event listener for RSVP button
    rsvpButton.onclick = () => handleRSVP(event.id);
    
    modal.show();
}

// Handle RSVP to an event
function handleRSVP(eventId) {
    if (!auth.currentUser) {
        // Show login modal if user is not logged in
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
        return;
    }
    
    // In a real app, you would save this to a database
    alert(`Thank you for RSVP'ing to this event! We'll send you a confirmation.`);
}

// Handle creating a new event
function handleCreateEvent(e) {
    e.preventDefault();
    
    if (!auth.currentUser) {
        alert('Please log in to create an event.');
        return;
    }
    
    const form = e.target;
    const formData = new FormData(form);
    
    // In a real app, you would save this to a database
    const newEvent = {
        id: Date.now(),
        title: formData.get('title'),
        type: formData.get('type'),
        date: formData.get('date'),
        time: formData.get('time'),
        location: formData.get('location'),
        contact: formData.get('contact'),
        description: formData.get('description'),
        fullDescription: formData.get('description'),
        coordinates: userLocation // In a real app, you would geocode the address
    };
    
    // Add to events array and update display
    events.unshift(newEvent);
    displayEvents(events);
    
    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('createEventModal'));
    modal.hide();
    form.reset();
    
    // Show success message
    alert('Event created successfully!');
}

// Helper function to format date as Month Day, Year
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Helper function to format time as HH:MM AM/PM
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}
