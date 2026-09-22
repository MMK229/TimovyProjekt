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

// ─────────────────────────────────────────────────────────────────────────
// ZÁPISNICE – upravujte priamo tu
// Každý objekt = jedno stretnutie. Polia:
//   num        – číslo stretnutia
//   date       – dátum stretnutia (reťazec, napr. '22. 9. 2026')
//   nextDate   – dátum budúceho stretnutia alebo null
//   attendees  – pole účastníkov
//   author     – kto vypracoval zápis (reťazec alebo null)
//   content    – obsah stretnutia (reťazec)
//   tasks      – pole úloh do budúceho stretnutia
//   prevTasks  – zhodnotenie úloh z predch. stretnutia (reťazec alebo null)
// ─────────────────────────────────────────────────────────────────────────
const defaultData = [

    //
    // ZÁPISNICA 1 (22. 9. 2026)
    //
    {
        id: 1,
        num: 1,
        date: '22. 9. 2026',
        nextDate: null,
        attendees: [
            'Ing. Juraj Paška',
            'Bc. Dávid Vég',
            'Bc. Lara Malíková',
            'Bc. Roman Gális',
            'Bc. Marek Ďurica',
            'Bc. Marek Kormoš'
        ],
        author: 'Marek Ďurica',
        content: 'Základné informácie ohľadom témy – vysvetlenie a priblíženie úlohy a jej možného výstupu, administratívne veci, dohoda o tímovej komunikácii a ďalších stretnutiach.',
        tasks: [
            'Naštudovanie problematiky',
            'Rozdelenie úloh',
            'Pokus rozbehnúť projekt v aktuálnom stave'
        ],
        prevTasks: null
    },

    // ── Pridajte ďalšie zápisnice sem, napr.: ──
    // ,{
    //   id: 2,
    //   num: 2,
    //   date: '29. 9. 2026',
    //   nextDate: '6. 10. 2026',
    //   attendees: ['Ing. Juraj Paška', 'Bc. Dávid Vég', ...],
    //   author: 'Bc. Dávid Vég',
    //   content: 'Popis obsahu stretnutia...',
    //   tasks: ['Úloha 1', 'Úloha 2'],
    //   prevTasks: 'Všetky úlohy z predchádzajúceho stretnutia boli splnené.'
    // }
];


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

function saveData(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
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