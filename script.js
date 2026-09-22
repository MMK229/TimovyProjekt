// Tab switching
function showTab(name, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + name).classList.add('active');
    btn.classList.add('active');
}

// Zapisnica accordion
function toggleZapisnica(card) {
    card.classList.toggle('open');
}

// Storage key
const STORAGE_KEY = 'timovy_projekt_zapisnice_v1';

function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const stored = JSON.parse(raw);
            // Merge: use defaultData as base, then append any extra entries added via form
            const defaultIds = new Set(defaultData.map(d => d.id));
            const extras = stored.filter(s => !defaultIds.has(s.id));
            return [...defaultData, ...extras];
        }
    } catch(e) {}
    return defaultData;
}

function renderZapisnice() {
    const data = loadData();
    const list = document.getElementById('zapisnice-list');
    if (!data.length) {
        list.innerHTML = `<div class="empty-state"><div class="icon">📝</div><p>Zatiaľ neboli pridané žiadne zápisnice.</p></div>`;
        return;
    }
    list.innerHTML = data.map((z, idx) => {
        const taskItems = Array.isArray(z.tasks)
            ? z.tasks.map(t => `<li>${t}</li>`).join('')
            : z.tasks.split('\n').filter(Boolean).map(t => `<li>${t.trim()}</li>`).join('');

        const prevSection = z.prevTasks ? `
        <div class="zapisnica-section">
          <h4>Plnenie úloh z predchádzajúceho stretnutia</h4>
          <p>${z.prevTasks}</p>
        </div>` : '';

        const attendeeList = Array.isArray(z.attendees)
            ? z.attendees.join(', ')
            : z.attendees;

        const shortAttendees = Array.isArray(z.attendees)
            ? z.attendees.slice(0, 3).map(a => a.split(' ').pop()).join(', ') + (z.attendees.length > 3 ? ` +${z.attendees.length - 3}` : '')
            : z.attendees;

        return `
      <div class="zapisnica-card" id="z-${idx}">
        <div class="zapisnica-header" onclick="toggleZapisnica(document.getElementById('z-${idx}'))">
          <div class="zapisnica-meta">
            <span class="zapisnica-date">${z.date}</span>
            <span class="zapisnica-num">Stretnutie č. ${z.num}</span>
            <span class="zapisnica-people">${shortAttendees}</span>
          </div>
          <span class="toggle-icon">⌄</span>
        </div>
        <div class="zapisnica-body">
          <div class="zapisnica-section">
            <h4>Zúčastnení</h4>
            <ul>${attendeeList.split(', ').map(a => `<li>${a}</li>`).join('')}</ul>
          </div>
          ${prevSection}
          <div class="zapisnica-section">
            <h4>Obsah stretnutia</h4>
            <p>${z.content}</p>
          </div>
          <div class="zapisnica-section">
            <h4>Úlohy do budúceho stretnutia</h4>
            <ul>${taskItems}</ul>
          </div>
          ${z.nextDate ? `<div class="zapisnica-footer">Dátum budúceho stretnutia: <strong>${z.nextDate}</strong></div>` : ''}
          ${z.author ? `<div class="zapisnica-footer" style="margin-top:6px;">Vypracoval: <strong>${z.author}</strong></div>` : ''}
        </div>
      </div>`;
    }).join('');
}

renderZapisnice();