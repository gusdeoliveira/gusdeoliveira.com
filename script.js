// State management
let currentLang = localStorage.getItem('preferred-language') || 'pt';
let currentTheme = localStorage.getItem('preferred-theme') || 'auto';

// Language and theme data
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

const themes = {
    light: {
        nextTheme: 'Dark',
        iconFile: 'icons/theme-light.svg',
        iconFileDark: 'icons/theme-light-dark.svg',
        displayName: 'Light'
    },
    dark: {
        nextTheme: 'Light',
        iconFile: 'icons/theme-dark.svg',
        iconFileDark: 'icons/theme-dark-dark.svg',
        displayName: 'Dark'
    }
};

// Apply theme function
function applyTheme(theme) {
    if (theme === 'auto') {
        // Remove data-theme to let CSS prefers-color-scheme work
        document.documentElement.removeAttribute('data-theme');
    } else {
        // Set explicit theme
        document.documentElement.setAttribute('data-theme', theme);
    }
}

// Apply saved preferences on load
applyTheme(currentTheme);

// Load content function
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
            // Fallback to Portuguese if English fails
            if (currentLang === 'en') {
                currentLang = 'pt';
                loadContent();
            }
        });
}

// Update UI elements
function updateUI() {
    // Determine if we're in dark mode (either explicit or auto)
    const isDarkMode = currentTheme === 'dark' || 
        (currentTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // Language button - shows current language
    const langText = document.getElementById('langText');
    const langIcon = document.getElementById('langIcon');
    langText.textContent = languages[currentLang].display;
    langIcon.src = isDarkMode ? 'icons/language-dark.svg' : 'icons/language.svg';
    document.getElementById('langToggle').title = `Switch to ${languages[currentLang].nextLang}`;
    
    // Theme button - shows current theme icon
    const themeIcon = document.getElementById('themeIcon');
    if (currentTheme !== 'auto') {
        themeIcon.src = isDarkMode ? themes[currentTheme].iconFileDark : themes[currentTheme].iconFile;
        themeIcon.parentElement.title = `Switch to ${themes[currentTheme].nextTheme}`;
    } else {
        // Auto theme: determine icon based on system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const currentThemeForAuto = prefersDark ? 'dark' : 'light';
        themeIcon.src = prefersDark ? themes[currentThemeForAuto].iconFileDark : themes[currentThemeForAuto].iconFile;
        themeIcon.parentElement.title = prefersDark ? 'Switch to Light' : 'Switch to Dark';
    }
    
    // Apply theme
    applyTheme(currentTheme);
}

// Event listeners
document.getElementById('langToggle').addEventListener('click', () => {
    currentLang = currentLang === 'pt' ? 'en' : 'pt';
    localStorage.setItem('preferred-language', currentLang);
    updateUI();
    loadContent();
});

document.getElementById('themeToggle').addEventListener('click', () => {
    // Toggle between light and dark only (no auto for user selection)
    if (currentTheme === 'auto') {
        // If currently auto, switch to the opposite of system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        currentTheme = prefersDark ? 'light' : 'dark';
    } else {
        // Toggle between light and dark
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    }
    
    localStorage.setItem('preferred-theme', currentTheme);
    updateUI();
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    loadContent();
});

// Listen for system theme changes when in auto mode
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (currentTheme === 'auto') {
        updateUI();
    }
});
