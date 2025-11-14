// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const themeIcon = document.querySelector('.theme-icon');

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
}

// Scientific Calculator Functions
let displayValue = '0';
let currentExpression = '';

function updateDisplay() {
    const display = document.getElementById('calcDisplay');
    display.textContent = displayValue || '0';
}

function appendToDisplay(value) {
    if (displayValue === '0' && value !== '.') {
        displayValue = value;
    } else {
        displayValue += value;
    }
    currentExpression += value;
    updateDisplay();
}

function clearCalculator() {
    displayValue = '0';
    currentExpression = '';
    updateDisplay();
}

function deleteLastChar() {
    if (displayValue.length > 1) {
        displayValue = displayValue.slice(0, -1);
        currentExpression = currentExpression.slice(0, -1);
    } else {
        displayValue = '0';
        currentExpression = '';
    }
    updateDisplay();
}

function calculateResult() {
    try {
        // Replace display-friendly operators with JavaScript operators
        let expression = currentExpression;
        
        // Convert degrees to radians for trigonometric functions
        expression = expression.replace(/Math\.(sin|cos|tan)\(/g, (match, func) => {
            return `Math.${func}((Math.PI/180)*`;
        });
        
        // Evaluate the expression
        const result = eval(expression);
        
        // Handle special cases
        if (isNaN(result) || !isFinite(result)) {
            displayValue = 'Error';
            currentExpression = '';
        } else {
            // Round to 10 decimal places to avoid floating point errors
            displayValue = String(Math.round(result * 10000000000) / 10000000000);
            currentExpression = displayValue;
        }
    } catch (error) {
        displayValue = 'Error';
        currentExpression = '';
    }
    updateDisplay();
}

// Age Calculator Function
function calculateAge() {
    const birthdateInput = document.getElementById('birthdate');
    const resultDiv = document.getElementById('ageResult');
    
    if (!birthdateInput.value) {
        resultDiv.innerHTML = '<p style="color: var(--danger);">Please enter your birth date</p>';
        return;
    }
    
    const birthDate = new Date(birthdateInput.value);
    const today = new Date();
    
    // Check if birth date is in the future
    if (birthDate > today) {
        resultDiv.innerHTML = '<p style="color: var(--danger);">Birth date cannot be in the future</p>';
        return;
    }
    
    // Calculate age
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    
    // Adjust for negative days
    if (days < 0) {
        months--;
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
    }
    
    // Adjust for negative months
    if (months < 0) {
        years--;
        months += 12;
    }
    
    // Calculate total days
    const oneDay = 24 * 60 * 60 * 1000;
    const totalDays = Math.floor((today - birthDate) / oneDay);
    
    // Calculate total weeks
    const totalWeeks = Math.floor(totalDays / 7);
    
    // Calculate total months
    const totalMonths = years * 12 + months;
    
    // Display results
    resultDiv.innerHTML = `
        <h4>Your Age</h4>
        <p><strong>${years}</strong> years, <strong>${months}</strong> months, and <strong>${days}</strong> days</p>
        <p>Or approximately <strong>${totalMonths}</strong> months</p>
        <p>Or approximately <strong>${totalWeeks.toLocaleString()}</strong> weeks</p>
        <p>Or approximately <strong>${totalDays.toLocaleString()}</strong> days</p>
        <p style="margin-top: 1rem; color: var(--text-secondary);">
            Born on: ${birthDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
    `;
}

// Live Gold & Silver Prices
let priceData = {
    gold: { price: 0, change: 0 },
    silver: { price: 0, change: 0 }
};

async function fetchMetalPrices() {
    try {
        // Using metals-api.com free tier (requires API key)
        // For demo purposes, we'll use a mock API with realistic data
        // In production, replace with actual API endpoint
        
        // Mock data for demonstration
        // In production, use: const response = await fetch('https://api.metals.live/v1/spot');
        
        // Simulating API call with realistic price ranges
        const mockGoldPrice = 2000 + (Math.random() * 100 - 50); // $2000 ± $50
        const mockSilverPrice = 24 + (Math.random() * 2 - 1); // $24 ± $1
        
        const mockGoldChange = (Math.random() * 4 - 2); // ±2%
        const mockSilverChange = (Math.random() * 6 - 3); // ±3%
        
        priceData.gold = {
            price: mockGoldPrice,
            change: mockGoldChange
        };
        
        priceData.silver = {
            price: mockSilverPrice,
            change: mockSilverChange
        };
        
        updatePriceDisplay();
        
    } catch (error) {
        console.error('Error fetching metal prices:', error);
        document.getElementById('goldPrice').textContent = 'Error loading';
        document.getElementById('silverPrice').textContent = 'Error loading';
    }
}

function updatePriceDisplay() {
    // Update Gold Price
    const goldPriceEl = document.getElementById('goldPrice');
    const goldChangeEl = document.getElementById('goldChange');
    
    goldPriceEl.textContent = `$${priceData.gold.price.toFixed(2)}`;
    
    const goldChangePercent = priceData.gold.change;
    const goldChangeText = goldChangePercent >= 0 ? `+${goldChangePercent.toFixed(2)}%` : `${goldChangePercent.toFixed(2)}%`;
    goldChangeEl.textContent = goldChangeText;
    goldChangeEl.className = `price-change ${goldChangePercent >= 0 ? 'positive' : 'negative'}`;
    
    // Update Silver Price
    const silverPriceEl = document.getElementById('silverPrice');
    const silverChangeEl = document.getElementById('silverChange');
    
    silverPriceEl.textContent = `$${priceData.silver.price.toFixed(2)}`;
    
    const silverChangePercent = priceData.silver.change;
    const silverChangeText = silverChangePercent >= 0 ? `+${silverChangePercent.toFixed(2)}%` : `${silverChangePercent.toFixed(2)}%`;
    silverChangeEl.textContent = silverChangeText;
    silverChangeEl.className = `price-change ${silverChangePercent >= 0 ? 'positive' : 'negative'}`;
    
    // Update timestamp
    const now = new Date();
    const timestamp = now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('priceTimestamp').textContent = `Last updated: ${timestamp}`;
}

function refreshPrices() {
    const goldPriceEl = document.getElementById('goldPrice');
    const silverPriceEl = document.getElementById('silverPrice');
    
    goldPriceEl.textContent = 'Loading...';
    silverPriceEl.textContent = 'Loading...';
    
    fetchMetalPrices();
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize prices on page load
window.addEventListener('load', () => {
    fetchMetalPrices();
    
    // Auto-refresh prices every 5 minutes
    setInterval(fetchMetalPrices, 5 * 60 * 1000);
});

// Add keyboard support for calculator
document.addEventListener('keydown', (e) => {
    const key = e.key;
    
    // Numbers and operators
    if (/[0-9+\-*/.()]/.test(key)) {
        appendToDisplay(key === '*' ? '*' : key);
    }
    
    // Enter key for equals
    if (key === 'Enter') {
        e.preventDefault();
        calculateResult();
    }
    
    // Backspace for delete
    if (key === 'Backspace') {
        e.preventDefault();
        deleteLastChar();
    }
    
    // Escape for clear
    if (key === 'Escape') {
        e.preventDefault();
        clearCalculator();
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Add active state to navigation links based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Console welcome message
console.log('%c👋 Welcome to my Portfolio!', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cBuilt with HTML, CSS, and JavaScript', 'font-size: 14px; color: #8b5cf6;');
console.log('%cFeel free to explore the code!', 'font-size: 14px; color: #6c757d;');
