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

    // Pridajte ďalšie zápisnice sem:
    // {
    //     id: 2,
    //     num: 2,
    //     date: '29. 9. 2026',
    //     nextDate: '6. 10. 2026',
    //     attendees: [
    //         'Ing. Juraj Paška',
    //         'Bc. Dávid Vég'
    //     ],
    //     author: 'Bc. Dávid Vég',
    //     content: 'Popis obsahu stretnutia...',
    //     tasks: [
    //         'Úloha 1',
    //         'Úloha 2'
    //     ],
    //     prevTasks: 'Všetky úlohy z predchádzajúceho stretnutia boli splnené.'
    // }
];