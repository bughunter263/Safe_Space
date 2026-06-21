const eventForm = document.getElementById('event-form');
const clearFormButton = document.getElementById('clear-form');
const eventTitle = document.getElementById('event-title');
const eventDate = document.getElementById('event-date');
const eventDescription = document.getElementById('event-description');
const eventImage = document.getElementById('event-image');
const eventId = document.getElementById('event-id');
const eventsAdminList = document.getElementById('events-admin-list');
const announcementText = document.getElementById('announcement-text');
const announcementButton = document.getElementById('add-announcement');
const announcementsAdminList = document.getElementById('announcements-admin-list');

function getStoredEvents() {
  return JSON.parse(localStorage.getItem('hisSafeSpaceEvents') || '[]');
}

function getStoredAnnouncements() {
  return JSON.parse(localStorage.getItem('hisSafeSpaceAnnouncements') || '[]');
}

function saveEvents(events) {
  localStorage.setItem('hisSafeSpaceEvents', JSON.stringify(events));
}

function saveAnnouncements(announcements) {
  localStorage.setItem('hisSafeSpaceAnnouncements', JSON.stringify(announcements));
}

function renderAdminEvents() {
  if (!eventsAdminList) return;
  const events = getStoredEvents();
  eventsAdminList.innerHTML = '';

  if (events.length === 0) {
    eventsAdminList.innerHTML = '<p class="muted">No events added yet.</p>';
    return;
  }

  events.forEach((event) => {
    const row = document.createElement('div');
    row.className = 'event-row';
    row.innerHTML = `
      <div>
        <h4>${event.title}</h4>
        <time>${event.date}</time>
        <p>${event.description}</p>
      </div>
      <div class="event-actions">
        <button type="button" class="button button-secondary" data-edit="${event.id}">Edit</button>
        <button type="button" class="button button-secondary" data-delete="${event.id}">Delete</button>
      </div>
    `;
    eventsAdminList.appendChild(row);
  });
}

function renderAdminAnnouncements() {
  if (!announcementsAdminList) return;
  const announcements = getStoredAnnouncements();
  announcementsAdminList.innerHTML = '';

  if (announcements.length === 0) {
    announcementsAdminList.innerHTML = '<p class="muted">No announcements added yet.</p>';
    return;
  }

  announcements.forEach((announcement) => {
    const row = document.createElement('div');
    row.className = 'announcement-row';
    row.innerHTML = `
      <div>
        <h4>${announcement.title}</h4>
        <p>${announcement.message}</p>
        <time>${announcement.date}</time>
      </div>
      <button type="button" class="button button-secondary" data-delete-announcement="${announcement.id}">Delete</button>
    `;
    announcementsAdminList.appendChild(row);
  });
}

function resetForm() {
  eventForm?.reset();
  if (eventId) eventId.value = '';
}

function handleEventSubmit(event) {
  event.preventDefault();
  if (!eventTitle || !eventDate || !eventDescription || !eventImage) return;

  const title = eventTitle.value.trim();
  const date = eventDate.value;
  const description = eventDescription.value.trim();
  const image = eventImage.value.trim();

  if (!title || !date || !description || !image) {
    return;
  }

  const events = getStoredEvents();
  const id = eventId?.value || Date.now().toString();
  const existing = events.find((item) => item.id === id);

  const record = { id, title, date, description, image };

  if (existing) {
    const index = events.findIndex((item) => item.id === id);
    events[index] = record;
  } else {
    events.unshift(record);
  }

  saveEvents(events);
  renderAdminEvents();
  resetForm();
  window.location.href = 'activities.html';
}

function handleAdminClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const editId = target.dataset.edit;
  const deleteId = target.dataset.delete;
  const deleteAnnouncementId = target.dataset.deleteAnnouncement;

  if (editId) {
    const events = getStoredEvents();
    const record = events.find((item) => item.id === editId);
    if (!record) return;
    if (eventTitle) eventTitle.value = record.title;
    if (eventDate) eventDate.value = record.date;
    if (eventDescription) eventDescription.value = record.description;
    if (eventImage) eventImage.value = record.image;
    if (eventId) eventId.value = record.id;
  }

  if (deleteId) {
    const events = getStoredEvents().filter((item) => item.id !== deleteId);
    saveEvents(events);
    renderAdminEvents();
  }

  if (deleteAnnouncementId) {
    const announcements = getStoredAnnouncements().filter((item) => item.id !== deleteAnnouncementId);
    saveAnnouncements(announcements);
    renderAdminAnnouncements();
  }
}

function handleAnnouncementAdd() {
  if (!announcementText) return;
  const text = announcementText.value.trim();
  if (!text) return;

  const announcements = getStoredAnnouncements();
  announcements.unshift({
    id: Date.now().toString(),
    title: 'Community update',
    message: text,
    date: new Date().toLocaleDateString(),
  });

  saveAnnouncements(announcements);
  announcementText.value = '';
  renderAdminAnnouncements();
}

function initAdminDashboard() {
  renderAdminEvents();
  renderAdminAnnouncements();
  eventForm?.addEventListener('submit', handleEventSubmit);
  clearFormButton?.addEventListener('click', resetForm);
  window.addEventListener('click', handleAdminClick);
  announcementButton?.addEventListener('click', handleAnnouncementAdd);
}

if (document.body.contains(document.getElementById('event-form'))) {
  initAdminDashboard();
}
