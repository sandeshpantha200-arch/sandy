const alumni = [
  { id: 'mira-shah', name: 'Mira Shah', year: 2014, role: 'Product Designer', field: 'Design', city: 'Ahmedabad', image: 'photo-1534528741775-53994a69daeb', bio: 'A sample profile for a Horizon alum working across thoughtful digital products and community projects.' },
  { id: 'arjun-mehta', name: 'Arjun Mehta', year: 2011, role: 'Science Educator', field: 'Education', city: 'Vadodara', image: 'photo-1500648767791-00dcc994a43e', bio: 'A sample profile for an educator who brings curiosity and hands-on learning into the classroom.' },
  { id: 'nisha-patel', name: 'Nisha Patel', year: 2017, role: 'Software Engineer', field: 'Technology', city: 'Bengaluru', image: 'photo-1531123897727-8f129e1688ce', bio: 'A sample profile for a software engineer building useful tools with a collaborative team.' },
  { id: 'dev-kapoor', name: 'Dev Kapoor', year: 2009, role: 'Community Health Worker', field: 'Health', city: 'Surat', image: 'photo-1506794778202-cad84cf45f1d', bio: 'A sample profile for a health professional supporting stronger local communities.' },
  { id: 'tara-joshi', name: 'Tara Joshi', year: 2013, role: 'Brand Strategist', field: 'Business', city: 'Mumbai', image: 'photo-1544005313-94ddf0286df2', bio: 'A sample profile for a strategist helping growing organizations communicate with clarity.' },
  { id: 'kabir-rao', name: 'Kabir Rao', year: 2018, role: 'Architectural Designer', field: 'Design', city: 'Pune', image: 'photo-1507003211169-0a1dd7228f2d', bio: 'A sample profile for a designer interested in the places and spaces that bring people together.' },
  { id: 'sana-iyer', name: 'Sana Iyer', year: 2010, role: 'Learning Consultant', field: 'Education', city: 'Jaipur', image: 'photo-1551836022-d5d88e9218df', bio: 'A sample profile for a learning consultant helping students find confidence in their next steps.' },
  { id: 'rohan-das', name: 'Rohan Das', year: 2016, role: 'Data Analyst', field: 'Technology', city: 'Hyderabad', image: 'photo-1517841905240-472988babdf9', bio: 'A sample profile for an analyst turning complex information into practical decisions.' }
];

const events = [
  { id: 'meet-the-network', day: '20', month: 'MAR', year: '2027', title: 'Meet the Network', description: 'An easygoing afternoon to catch up, trade stories, and make a few new introductions.', location: 'Horizon G.B.S. School' },
  { id: 'career-table', day: '17', month: 'APR', year: '2027', title: 'The Career Table', description: 'Small-group conversations about first jobs, unexpected turns, and what comes next.', location: 'Online community session' },
  { id: 'give-back-day', day: '08', month: 'MAY', year: '2027', title: 'A Day at Horizon', description: 'Come back to campus, reconnect with teachers, and spend time with current students.', location: 'Horizon G.B.S. School' }
];

const alumniGrid = document.querySelector('#alumni-grid');
const searchInput = document.querySelector('#alumni-search');
const fieldFilter = document.querySelector('#field-filter');
const toast = document.querySelector('#toast');
let toastTimer;

function readStored(key, fallback = []) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3000);
}

function renderAlumni() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedField = fieldFilter.value;
  const matches = alumni.filter((member) => {
    const searchable = `${member.name} ${member.role} ${member.city} ${member.year} ${member.field}`.toLowerCase();
    return searchable.includes(query) && (selectedField === 'all' || member.field === selectedField);
  });

  document.querySelector('#result-count').textContent = `${matches.length} ${matches.length === 1 ? 'profile' : 'profiles'}`;
  if (!matches.length) {
    alumniGrid.innerHTML = '<p class="empty-state">No profiles match that search. Try another name, city, or field.</p>';
    return;
  }

  alumniGrid.innerHTML = matches.map((member) => `
    <article class="alumni-card">
      <div class="alumni-photo">
        <img src="https://images.unsplash.com/${member.image}?auto=format&fit=crop&w=600&q=80" alt="Illustrative portrait for ${member.name}" loading="lazy">
        <span class="sample-label">Sample profile</span>
      </div>
      <div class="alumni-info">
        <h3>${member.name}</h3>
        <p class="alumni-role">${member.role}</p>
        <p>Class of ${member.year} · ${member.city}</p>
        <button class="text-button" type="button" data-profile="${member.id}" aria-label="View sample profile for ${member.name}">View profile <span aria-hidden="true">→</span></button>
      </div>
    </article>`).join('');
}

function renderEvents() {
  const joined = readStored('horizon-rsvps');
  document.querySelector('#events-grid').innerHTML = events.map((event) => `
    <article class="event-card">
      <div class="event-date"><strong>${event.day}</strong><span>${event.month} ${event.year}</span></div>
      <h3>${event.title}</h3>
      <p>${event.description}</p>
      <div class="event-bottom"><span class="event-location">${event.location}</span><button class="rsvp-button ${joined.includes(event.id) ? 'is-joined' : ''}" type="button" data-rsvp="${event.id}" aria-pressed="${joined.includes(event.id)}">${joined.includes(event.id) ? 'Going ✓' : 'RSVP +'}</button></div>
    </article>`).join('');
}

function openDialog(id) {
  const dialog = document.getElementById(id);
  if (dialog && !dialog.open) dialog.showModal();
}

document.addEventListener('click', (event) => {
  const openButton = event.target.closest('[data-open-dialog]');
  const closeButton = event.target.closest('.dialog-close');
  const profileButton = event.target.closest('[data-profile]');
  const rsvpButton = event.target.closest('[data-rsvp]');

  if (openButton) openDialog(openButton.dataset.openDialog);
  if (closeButton) closeButton.closest('dialog').close();

  if (profileButton) {
    const member = alumni.find((entry) => entry.id === profileButton.dataset.profile);
    if (member) {
      document.querySelector('#profile-content').innerHTML = `
        <div class="profile-top"><img src="https://images.unsplash.com/${member.image}?auto=format&fit=crop&w=300&q=80" alt="Illustrative portrait for ${member.name}"><div><p class="eyebrow">SAMPLE ALUMNI PROFILE</p><h2 id="profile-title">${member.name}</h2><p>Class of ${member.year} · ${member.city}</p></div></div>
        <p class="profile-copy"><strong>${member.role}</strong> · ${member.field}<br>${member.bio}</p>
        <p class="profile-copy">This is an illustrative directory entry. Replace it with a verified alumni profile before launch.</p>`;
      openDialog('profile-dialog');
    }
  }

  if (rsvpButton) {
    const selected = rsvpButton.dataset.rsvp;
    const joined = readStored('horizon-rsvps');
    const next = joined.includes(selected) ? joined.filter((id) => id !== selected) : [...joined, selected];
    localStorage.setItem('horizon-rsvps', JSON.stringify(next));
    renderEvents();
    showToast(next.includes(selected) ? 'Your RSVP is saved in this browser.' : 'Your RSVP has been removed.');
  }
});

searchInput.addEventListener('input', renderAlumni);
fieldFilter.addEventListener('change', renderAlumni);

document.querySelector('.menu-toggle').addEventListener('click', (event) => {
  const button = event.currentTarget;
  const nav = document.querySelector('#main-nav');
  const isOpen = nav.classList.toggle('is-open');
  button.setAttribute('aria-expanded', String(isOpen));
  button.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

document.querySelectorAll('#main-nav a').forEach((link) => link.addEventListener('click', () => {
  document.querySelector('#main-nav').classList.remove('is-open');
  const menuToggle = document.querySelector('.menu-toggle');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
}));

document.querySelector('#story-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const stories = readStored('horizon-stories');
  stories.push({ name: formData.get('name').trim(), story: formData.get('story').trim(), savedAt: new Date().toISOString() });
  localStorage.setItem('horizon-stories', JSON.stringify(stories));
  form.reset();
  document.querySelector('#story-dialog').close();
  showToast('Your story is saved in this browser.');
});

document.querySelector('#newsletter-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const emailInput = document.querySelector('#newsletter-email');
  const emails = readStored('horizon-newsletter');
  if (!emails.includes(emailInput.value.trim().toLowerCase())) {
    emails.push(emailInput.value.trim().toLowerCase());
    localStorage.setItem('horizon-newsletter', JSON.stringify(emails));
  }
  emailInput.value = '';
  showToast('You are subscribed in this browser demo.');
});

document.querySelectorAll('dialog').forEach((dialog) => dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
}));

document.querySelector('#current-year').textContent = new Date().getFullYear();
renderAlumni();
renderEvents();
