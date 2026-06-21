const eventsList = document.getElementById('events-list');
const announcementsList = document.getElementById('announcements-list');
const galleryGrid = document.getElementById('gallery-grid');
const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxClose = lightbox?.querySelector('.lightbox-close');

const galleryImages = [
  'assets/images/gallery-01.svg',
  'assets/images/gallery-02.svg',
  'assets/images/gallery-03.svg',
  'assets/images/gallery-04.svg',
  'assets/images/gallery-05.svg',
  'assets/images/gallery-06.svg',
];

const defaultEvents = [
  {
    id: 'event-1',
    title: 'Open Conversation Circle',
    date: '2026-08-01',
    description: 'A guided peer circle for young men to share and listen in a safe environment.',
    image: 'assets/images/event-01.svg',
  },
  {
    id: 'event-2',
    title: 'Weekend Reflection Workshop',
    date: '2026-08-15',
    description: 'A journaling and self-awareness workshop focused on emotional wellbeing.',
    image: 'assets/images/event-02.svg',
  },
  {
    id: 'event-3',
    title: 'Community Support Meetup',
    date: '2026-09-05',
    description: 'A meetup to connect with local peers and discuss personal growth strategies.',
    image: 'assets/images/event-03.svg',
  },
];

function saveEvents(events) {
  localStorage.setItem('hisSafeSpaceEvents', JSON.stringify(events));
}

async function loadActivitiesData() {
  const storedEvents = JSON.parse(localStorage.getItem('hisSafeSpaceEvents') || '[]');
  const storedAnnouncements = JSON.parse(localStorage.getItem('hisSafeSpaceAnnouncements') || '[]');

  if (storedEvents.length === 0) {
    let events = defaultEvents;
    try {
      const response = await fetch('data/events.json');
      if (response.ok) {
        events = await response.json();
      }
    } catch (error) {
      console.warn('Unable to load default events from JSON, using inline fallback.', error);
    }
    saveEvents(events);
    renderEvents(events);
  } else {
    renderEvents(storedEvents);
  }

  renderAnnouncements(storedAnnouncements);
  renderGallery();
}

function renderEvents(events) {
  if (!eventsList) return;
  eventsList.innerHTML = '';

  if (events.length === 0) {
    eventsList.innerHTML = '<p class="muted">No upcoming events yet. Add events from the admin page.</p>';
    return;
  }

  events.forEach((event) => {
    const card = document.createElement('article');
    card.className = 'event-card';
    card.innerHTML = `
      <img src="${event.image}" alt="${event.title}" />
      <div>
        <h3>${event.title}</h3>
        <time>${event.date}</time>
        <p>${event.description}</p>
      </div>
    `;
    eventsList.appendChild(card);
  });
}

function renderAnnouncements(announcements) {
  if (!announcementsList) return;
  announcementsList.innerHTML = '';

  if (announcements.length === 0) {
    announcementsList.innerHTML = '<p class="muted">No announcements yet. Add them from the admin page.</p>';
    return;
  }

  announcements.forEach((announcement) => {
    const card = document.createElement('article');
    card.className = 'announcement-card';
    card.innerHTML = `
      <h3>${announcement.title}</h3>
      <p>${announcement.message}</p>
      <time>${announcement.date}</time>
    `;
    announcementsList.appendChild(card);
  });
}

function renderGallery() {
  if (!galleryGrid) return;
  galleryGrid.innerHTML = '';
  galleryImages.forEach((src, index) => {
    const item = document.createElement('button');
    item.className = 'gallery-item';
    item.type = 'button';
    item.innerHTML = `<img src="${src}" alt="Community event photo ${index + 1}" />`;
    item.addEventListener('click', () => openLightbox(src));
    galleryGrid.appendChild(item);
  });
}

function openLightbox(src) {
  if (!lightbox || !lightboxImage) return;
  lightboxImage.src = src;
  lightbox.setAttribute('aria-hidden', 'false');
  lightbox.classList.add('active');
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
}

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

window.addEventListener('load', loadActivitiesData);
