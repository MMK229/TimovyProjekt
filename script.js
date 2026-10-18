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

const TEAM_MEMBERS = [
    'Ing. Juraj Paška',
    'Bc. Dávid Vég',
    'Bc. Lara Malíková',
    'Bc. Roman Gális',
    'Bc. Marek Ďurica',
    'Bc. Marek Kormoš'
];

function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const stored = JSON.parse(raw);
            const defaultIds = new Set(defaultData.map(d => d.id));
            const extras = stored.filter(s => !defaultIds.has(s.id));
            return [...defaultData, ...extras];
        }
    } catch(e) {}
    return defaultData;
}

function saveDataToStorage(newZapisnica) {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        let stored = raw ? JSON.parse(raw) : [];
        stored.push(newZapisnica);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch(e) {
        console.error('Chyba pri ukladaní', e);
    }
}

function renderZapisnice() {
    const data = loadData();
    const list = document.getElementById('zapisnice-list');

    // Tu je teraz iba jeden čistý nadpis spojený s tlačidlom v jednom riadku
    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 10px;">
            <div class="section-label" style="margin-bottom: 0;">Zápisnice stretnutí</div>
            <button class="add-btn" onclick="openAddForm()">+ Napísať zápisnicu</button>
        </div>
        <div id="form-container"></div>
    `;

    if (!data.length) {
        html += `<div class="empty-state"><div class="icon">📝</div><p>Zatiaľ neboli pridané žiadne zápisnice.</p></div>`;
    } else {
        html += data.map((z, idx) => {
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

            return `
          <div class="zapisnica-card" id="z-${idx}">
            <div class="zapisnica-header" onclick="toggleZapisnica(document.getElementById('z-${idx}'))">
              <div class="zapisnica-meta">
                <span class="zapisnica-date">${z.date}</span>
                <span class="zapisnica-num">Stretnutie č. ${z.num}</span>
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

    list.innerHTML = html;
}

function openAddForm() {
    const container = document.getElementById('form-container');
    if (container.innerHTML.trim() !== '') {
        container.innerHTML = '';
        return;
    }

    const data = loadData();
    const nextNum = data.length > 0 ? Math.max(...data.map(d => d.num)) + 1 : 1;

    const dObj = new Date();
    const today = `${dObj.getDate()}. ${dObj.getMonth() + 1}. ${dObj.getFullYear()}`;

    const checkboxesHtml = TEAM_MEMBERS.map((m, i) => `
        <label class="checkbox-label">
            <input type="checkbox" name="attendee" value="${m}" checked class="attendee-cb"> <span>${m}</span>
        </label>
    `).join('');

    container.innerHTML = `
        <div class="add-form">
            <h3>Nová zápisnica zo stretnutia</h3>
            <form id="new-zapisnica-form" onsubmit="saveNewZapisnica(event)">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Číslo stretnutia</label>
                        <input type="number" id="f-num" value="${nextNum}" required>
                    </div>
                    <div class="form-group">
                        <label>Dátum stretnutia</label>
                        <input type="text" id="f-date" value="${today}" required>
                    </div>
                    <div class="form-group">
                        <label>Dátum budúceho stretnutia (nepovinné)</label>
                        <input type="text" id="f-nextDate" placeholder="napr. 16. 10. 2026">
                    </div>
                    <div class="form-group">
                        <label>Vypracoval (Autor)</label>
                        <input type="text" id="f-author" placeholder="Meno a priezvisko" value="Marek Ďurica">
                    </div>
                    <div class="form-group full">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                            <label style="margin-bottom:0;">Zúčastnení</label>
                            <label class="checkbox-label" style="font-weight: 600; color: var(--blue); cursor: pointer;">
                                <input type="checkbox" id="select-all-attendees" checked onchange="toggleAllAttendees(this)"> <span>Všetci</span>
                            </label>
                        </div>
                        <div class="checkbox-group">
                            ${checkboxesHtml}
                        </div>
                    </div>
                    <div class="form-group full">
                        <label>Obsah stretnutia</label>
                        <textarea id="f-content" placeholder="Hlavné body a priebeh stretnutia..." required></textarea>
                    </div>
                    <div class="form-group full">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                            <label style="margin-bottom:0;">Úlohy do budúceho stretnutia</label>
                            <button type="button" class="add-btn" style="padding: 4px 10px; font-size: 12px;" onclick="addTaskRow()">+ Pridať úlohu</button>
                        </div>
                        <div id="tasks-container" class="task-row-container">
                            <div class="task-input-row">
                                <input type="text" class="task-input" placeholder="Zadajte úlohu..." required>
                                <button type="button" class="remove-task-btn" onclick="this.parentElement.remove()">×</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="cancel-btn" onclick="document.getElementById('form-container').innerHTML=''">Zrušiť</button>
                    <button type="submit" class="add-btn">Uložiť zápisnicu</button>
                </div>
            </form>
        </div>
    `;
    container.scrollIntoView({ behavior: 'smooth' });
}

function toggleAllAttendees(master) {
    const checkboxes = document.querySelectorAll('.attendee-cb');
    checkboxes.forEach(cb => cb.checked = master.checked);
}

function addTaskRow() {
    const container = document.getElementById('tasks-container');
    const row = document.createElement('div');
    row.className = 'task-input-row';
    row.innerHTML = `
        <input type="text" class="task-input" placeholder="Zadajte úlohu..." required>
        <button type="button" class="remove-task-btn" onclick="this.parentElement.remove()">×</button>
    `;
    container.appendChild(row);
}

function saveNewZapisnica(e) {
    e.preventDefault();

    // Zber úloh z dynamických riadkov
    const taskInputs = document.querySelectorAll('.task-input');
    const tasksArray = Array.from(taskInputs).map(i => i.value.trim()).filter(Boolean);

    // Zber zúčastnených z checkboxov
    const checkedAttendees = document.querySelectorAll('.attendee-cb:checked');
    const attendeesArray = Array.from(checkedAttendees).map(cb => cb.value);

    const newZ = {
        id: Date.now(),
        num: parseInt(document.getElementById('f-num').value),
        date: document.getElementById('f-date').value,
        nextDate: document.getElementById('f-nextDate').value.trim() || null,
        attendees: attendeesArray,
        author: document.getElementById('f-author').value.trim() || null,
        content: document.getElementById('f-content').value.trim(),
        tasks: tasksArray,
        prevTasks: null
    };

    saveDataToStorage(newZ);

    // Generovanie JS kódu
    const jsCode = `    {
        id: ${newZ.id},
        num: ${newZ.num},
        date: '${newZ.date}',
        nextDate: ${newZ.nextDate ? `'${newZ.nextDate}'` : 'null'},
        attendees: [
            ${newZ.attendees.map(a => `'${a}'`).join(',\n            ')}
        ],
        author: ${newZ.author ? `'${newZ.author}'` : 'null'},
        content: '${newZ.content.replace(/'/g, "\\'")}',
        tasks: [
            ${newZ.tasks.map(t => `'${t.replace(/'/g, "\\'")}'`).join(',\n            ')}
        ],
        prevTasks: null
    },`;

    // Zobrazenie modálneho okna (pop-up) s kódom
    showModalCode(jsCode);

    document.getElementById('form-container').innerHTML = '';
    renderZapisnice();
}

function showModalCode(codeText) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Zápisnica úspešne uložená! 🎉</h3>
            <p>Skopírujte si tento kód a vložte ho do súboru <strong>zapisnice.js</strong> vo vašom GitHube:</p>
            <textarea class="modal-textarea" id="modal-code-box" readonly>${codeText}</textarea>
            <div class="modal-actions">
                <button type="button" class="cancel-btn" onclick="this.closest('.modal-overlay').remove()">Zavrieť</button>
                <button type="button" class="add-btn" onclick="copyModalCode()">Skopírovať do schránky</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('modal-code-box').select();
}

function copyModalCode() {
    const box = document.getElementById('modal-code-box');
    box.select();
    navigator.clipboard.writeText(box.value).then(() => {
        alert('Kód bol skopírovaný do schránky! 📋');
    });
}

renderZapisnice();