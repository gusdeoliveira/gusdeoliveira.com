let currentLang = localStorage.getItem('preferred-language') || 'pt';
let currentTheme = localStorage.getItem('preferred-theme') || 'auto';

const languages = {
    pt: {
        file: 'README.md',
        display: 'PT',
        nextLang: 'EN'
    },
    en: {
        file: 'README-en.md',
        display: 'EN',
        nextLang: 'PT'
    }
};

const themeIcons = {
    light: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="4"/>
  <path d="M12 1v2"/>
  <path d="M12 21v2"/>
  <path d="M4.22 4.22l1.42 1.42"/>
  <path d="M18.36 18.36l1.42 1.42"/>
  <path d="M1 12h2"/>
  <path d="M21 12h2"/>
  <path d="M4.22 19.78l1.42-1.42"/>
  <path d="M18.36 5.64l1.42-1.42"/>
</svg>`,
    dark: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
</svg>`
};

function applyTheme(theme) {
    if (theme === 'auto') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
}

applyTheme(currentTheme);

function loadContent() {
    const fileName = languages[currentLang].file;
    fetch(`https://raw.githubusercontent.com/gusosilva/gusosilva.com/main/${fileName}`)
        .then(response => response.text())
        .then(data => {
            const readmeHtml = marked(data);
            const container = document.getElementById('content');
            container.innerHTML = readmeHtml;
        })
        .catch(error => {
            console.error("Oops:", error);
            if (currentLang === 'en') {
                currentLang = 'pt';
                loadContent();
            }
        });
}

function updateUI() {
    const langText = document.getElementById('langText');
    langText.textContent = languages[currentLang].display;
    
    const themeIcon = document.getElementById('themeIcon');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const themeKey = currentTheme === 'auto' ? (prefersDark ? 'dark' : 'light') : currentTheme;
    themeIcon.innerHTML = themeIcons[themeKey];
    
    applyTheme(currentTheme);
}

document.getElementById('langToggle').addEventListener('click', () => {
    currentLang = currentLang === 'pt' ? 'en' : 'pt';
    localStorage.setItem('preferred-language', currentLang);
    updateUI();
    loadContent();
});

document.getElementById('themeToggle').addEventListener('click', () => {
    if (currentTheme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        currentTheme = prefersDark ? 'light' : 'dark';
    } else {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    }
    
    localStorage.setItem('preferred-theme', currentTheme);
    updateUI();
});

document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    loadContent();
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (currentTheme === 'auto') {
        updateUI();
    }
});
