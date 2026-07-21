const themeStorageKey = 'funildevagas-theme';
let currentTheme = localStorage.getItem(themeStorageKey) || 'light';

const themeIcons = {
    light: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>`,
    dark: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
};

function applyTheme(theme) {
    if (theme === 'auto') {
        document.documentElement.removeAttribute('data-theme');
        return;
    }

    document.documentElement.setAttribute('data-theme', theme);
}

function updateThemeControl() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const themeKey = currentTheme === 'auto' ? (prefersDark ? 'dark' : 'light') : currentTheme;
    document.getElementById('themeIcon').innerHTML = themeIcons[themeKey];
    applyTheme(currentTheme);
}

async function loadContent() {
    const isLocal = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
    const markdownUrl = isLocal
        ? 'funildevagas.md'
        : 'https://raw.githubusercontent.com/gusosilva/gusosilva.com/main/funildevagas.md';
    const response = await fetch(markdownUrl);
    if (!response.ok) {
        throw new Error(`Não foi possível carregar a página (${response.status}).`);
    }

    document.getElementById('content').innerHTML = marked(await response.text());
}

document.getElementById('themeToggle').addEventListener('click', () => {
    if (currentTheme === 'auto') {
        currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark';
    } else {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    }

    localStorage.setItem(themeStorageKey, currentTheme);
    updateThemeControl();
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (currentTheme === 'auto') {
        updateThemeControl();
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    updateThemeControl();

    try {
        await loadContent();
    } catch (error) {
        console.error(error);
        document.getElementById('content').innerHTML = '<p>Não foi possível carregar esta página agora.</p>';
    }
});
