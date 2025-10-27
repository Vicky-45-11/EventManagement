// script.js - Frontend Logic using localStorage

const STORAGE_KEY = 'localEvents';
const eventsList = document.getElementById('eventsList');
const form = document.getElementById('addEventForm');
const messageElement = document.getElementById('message');
const clearBtn = document.getElementById('clearBtn');

// --- 1. Data Persistence Functions ---

function loadEvents() {
    const eventsJSON = localStorage.getItem(STORAGE_KEY);
    return eventsJSON ? JSON.parse(eventsJSON) : [];
}

function saveEvents(events) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    renderEvents(events);
}

// --- 2. Rendering Function ---

function renderEvents(events) {
    eventsList.innerHTML = '';
    
    // Sort events by date and time
    events.sort((a, b) => {
        const dateTimeA = new Date(`${a.date}T${a.time || '00:00'}`);
        const dateTimeB = new Date(`${b.date}T${b.time || '00:00'}`);
        return dateTimeA - dateTimeB;
    });

    if (events.length === 0) {
        eventsList.innerHTML = '<p id="loadingMsg">No events scheduled. Add one above!</p>';
        clearBtn.classList.add('hidden');
        return;
    }

    events.forEach(event => {
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('event-entry');

        const formattedDate = new Date(event.date).toLocaleDateString('en-US', { 
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' 
        });
        const timeDisplay = event.time ? ` @ ${event.time}` : '';
        
        entryDiv.innerHTML = `
            <h3>${event.title}</h3>
            <p class="event-date-time"><i class="far fa-calendar-alt"></i> ${formattedDate}${timeDisplay}</p>
            <p>${event.description}</p>
            <button class="delete-btn" data-id="${event.id}"><i class="fas fa-trash"></i> Delete</button>
        `;
        eventsList.appendChild(entryDiv);
    });

    clearBtn.classList.remove('hidden');
}

// --- 3. Event Handlers ---

// Handle form submission to add new event
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const description = document.getElementById('description').value.trim();

    if (!title || !date || !description) {
        messageElement.textContent = 'Error: Please fill in all required fields.';
        messageElement.className = 'error-msg';
        messageElement.classList.remove('hidden');
        return;
    }

    const newEvent = {
        id: Date.now(), // Use timestamp as a simple unique ID
        title,
        date,
        time,
        description
    };

    const currentEvents = loadEvents();
    currentEvents.push(newEvent);
    saveEvents(currentEvents);

    // Provide success feedback and clear form
    messageElement.textContent = `Success! Event "${title}" saved locally.`;
    messageElement.className = 'success-msg';
    messageElement.classList.remove('hidden');
    form.reset();
});

// Handle deletion of a single event
eventsList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const eventId = parseInt(e.target.getAttribute('data-id'));
        if (confirm("Are you sure you want to delete this event?")) {
            const currentEvents = loadEvents();
            const updatedEvents = currentEvents.filter(event => event.id !== eventId);
            saveEvents(updatedEvents);
            messageElement.textContent = 'Event deleted.';
            messageElement.className = 'success-msg';
            messageElement.classList.remove('hidden');
        }
    }
});

// Handle clearing ALL events
clearBtn.addEventListener('click', () => {
    if (confirm("WARNING: This will delete ALL saved events permanently. Continue?")) {
        saveEvents([]);
        messageElement.textContent = 'All local events have been cleared.';
        messageElement.className = 'error-msg';
        messageElement.classList.remove('hidden');
    }
});

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    renderEvents(loadEvents());
});