// --- COLUMNS MANAGER ---
const colWrapper = document.getElementById('col-wrapper');
let colIdCounter = 0;

function createColumn() {
    colIdCounter++;
    const col = document.createElement('div');
    col.className = 'column-card';
    col.id = `col-${colIdCounter}`;
    col.innerHTML = `
                <div class="col-header">
                    <div class="col-top-row">
                        <label class="toggle-row" style="margin:0; gap:10px;">
                            <div class="switch" style="transform:scale(0.8)">
                                <input type="checkbox" class="col-active" checked>
                                <span class="slider"></span>
                            </div>
                            <span class="col-title">Colonna ${colIdCounter}</span>
                        </label>
                        <button class="btn-icon" onclick="removeColumn(${colIdCounter})">&times;</button>
                    </div>
                    <select class="mode-select" onchange="updateColStyle(this)">
                    <option value="mix">⚡ Mix (Combina)</option>
                    <option value="solo">⬇ Solo (Non combinare)</option>
                    </select>
                </div>
                <textarea class="col-input" placeholder="Parole..."></textarea>
            `;

    const addBtn = document.querySelector('.add-col-card');
    if (addBtn) colWrapper.insertBefore(col, addBtn);
    else colWrapper.appendChild(col);
}

function updateColStyle(select) {
    const card = select.closest('.column-card');
    if (select.value === 'solo') card.classList.add('mode-solo');
    else card.classList.remove('mode-solo');
}

function initAddButton() {
    const btn = document.createElement('div');
    btn.className = 'add-col-card';
    btn.innerHTML = '+';
    btn.onclick = createColumn;
    colWrapper.appendChild(btn);
}

function removeColumn(id) {
    const el = document.getElementById(`col-${id}`);
    if (el) el.remove();
}

window.onload = () => { createColumn(); createColumn(); createColumn(); initAddButton(); };

// --- CORE ALGORITHMS ---

function toggleCustomSeparator(select) {
    const input = document.getElementById('custom-separator');
    if (select.value === 'custom') {
        input.style.display = 'block';
        input.focus();
    } else {
        input.style.display = 'none';
    }
}

// 1. Cartesian Product
const cartesian = (a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())), [[]]);

// 2. Permutations
const getPermutations = (arr) => {
    if (arr.length <= 1) return [arr];
    return arr.reduce((acc, item, i) =>
        acc.concat(getPermutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map(val => [item, ...val])),
        []);
};

// 3. Power Set (All Subsets) - Filtered to preserve original order
const getAllSubsets = (array) => {
    const result = [];
    result.push([]);
    for (let i = 0; i < array.length; i++) {
        const len = result.length;
        for (let j = 0; j < len; j++) {
            result.push([...result[j], array[i]]);
        }
    }
    // Remove empty and sort by length for better UX
    return result.filter(x => x.length > 0).sort((a, b) => a.length - b.length);
};

function processKeywords() {
    const cols = document.querySelectorAll('.column-card');
    let mixColsData = [];
    let soloColsData = [];

    // 1. Extract Data
    cols.forEach(c => {
        if (!c.querySelector('.col-active').checked) return;

        const mode = c.querySelector('.mode-select').value;
        let text = c.querySelector('.col-input').value;
        const doTrim = document.getElementById('trim-spaces').checked;
        let lines = text.split('\n').map(s => doTrim ? s.trim() : s);
        if (document.getElementById('remove-empty').checked) lines = lines.filter(s => s !== '');

        if (lines.length > 0 || mode === 'mix') { // Allow empty mix cols if needed
            if (lines.length === 0 && mode === 'mix') lines = [''];

            if (mode === 'mix') mixColsData.push(lines);
            else if (lines.length > 0) soloColsData.push(lines);
        }
    });

    // 2. Determine Strategy for Mix Cols
    const strategy = document.getElementById('combo-strategy').value;
    let setsToCombine = [];
    // setsToCombine will be array of arrays of columns.
    // e.g. [[ColA], [ColA, ColB], [ColA, ColB, ColC]]

    if (mixColsData.length > 0) {
        if (strategy === 'full') {
            // Just one set: [A, B, C]
            setsToCombine.push(mixColsData);
        }
        else if (strategy === 'accumulative') {
            // [A], [A, B], [A, B, C]
            for (let i = 1; i <= mixColsData.length; i++) {
                setsToCombine.push(mixColsData.slice(0, i));
            }
        }
        else if (strategy === 'min2') {
            // [A, B], [A, B, C]
            for (let i = 2; i <= mixColsData.length; i++) {
                setsToCombine.push(mixColsData.slice(0, i));
            }
        }
        else if (strategy === 'powerset') {
            // All possible subsets of columns
            // Note: This operates on columns, not words yet
            setsToCombine = getAllSubsets(mixColsData);
        }
    }

    // 3. Execute Mix Logic
    let finalRows = [];
    const usePermutations = document.getElementById('permute-mode').checked;

    // Security check
    if (usePermutations && mixColsData.length > 5) {
        if (!confirm("Attenzione: Combinare Permutazioni e molte colonne può bloccare il browser. Procedere?")) return;
    }

    setsToCombine.forEach(colSet => {
        // Cartesian product of the current set of columns
        let product = cartesian(colSet);

        product.forEach(combo => {
            let cleanCombo = combo.filter(w => w !== '');
            if (cleanCombo.length > 0) {
                if (usePermutations) {
                    // Generate permutations for this specific combination
                    let perms = getPermutations(cleanCombo);
                    perms.forEach(p => finalRows.push(p));
                } else {
                    finalRows.push(cleanCombo);
                }
            }
        });
    });

    // 4. Add "Solo" columns (appended at end)
    soloColsData.forEach(group => {
        group.forEach(word => finalRows.push([word]));
    });

    // 5. Format & Output
    let separator = document.getElementById('separator').value;
    if (separator === 'custom') {
        separator = document.getElementById('custom-separator').value;
    }

    const casing = document.getElementById('text-case').value;
    const before = document.getElementById('wrap-before').value;
    const after = document.getElementById('wrap-after').value;

    const mBroad = document.getElementById('match-broad').checked;
    const mPhrase = document.getElementById('match-phrase').checked;
    const mExact = document.getElementById('match-exact').checked;

    let outputLines = [];

    finalRows.forEach(row => {
        // Apply Casing
        let processedRow = row.map(word => {
            if (casing === 'lower') return word.toLowerCase();
            if (casing === 'upper') return word.toUpperCase();
            if (casing === 'capitalize') return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            return word;
        });

        let baseStr = processedRow.join(separator);
        let fullStr = `${before}${baseStr}${after}`;

        if (baseStr.trim() === '') return;

        if (mBroad) outputLines.push(fullStr);
        if (mPhrase) outputLines.push(`"${fullStr}"`);
        if (mExact) outputLines.push(`[${fullStr}]`);
    });

    const maxLen = parseInt(document.getElementById('max-len').value) || 0;
    if (maxLen > 0 && fullStr.length > maxLen) { return; } // Salta questa riga se è troppo lunga

    if (document.getElementById('remove-duplicates').checked) {
        outputLines = [...new Set(outputLines)];
    }

    document.getElementById('output-text').value = outputLines.join('\n');
    document.getElementById('count-val').innerText = outputLines.length;
}

function clearAll() {
    document.querySelectorAll('.col-input').forEach(el => el.value = '');
    document.getElementById('output-text').value = '';
    document.getElementById('count-val').innerText = '0';
}

function copyOutput() {
    const el = document.getElementById('output-text');
    el.select();
    navigator.clipboard.writeText(el.value).then(() => {
        const t = document.getElementById("toast");
        t.className = "show";
        setTimeout(() => t.className = "", 3000);
    });
}


