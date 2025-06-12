document.addEventListener('DOMContentLoaded', function() {
    // Theme Switching
    const themeSelect = document.getElementById('themeSelect');
    const savedTheme = localStorage.getItem('theme');
    document.body.className = savedTheme || 'dark';
    themeSelect.value = document.body.className;

    themeSelect.addEventListener('change', function() {
        document.body.className = this.value;
        localStorage.setItem('theme', this.value);
    });

    // Chat Toggling
    const openChat = document.getElementById('openChat');
    const closeChat = document.getElementById('closeChat');
    const chatContainer = document.getElementById('chatContainer');

    openChat.addEventListener('click', function() {
        chatContainer.classList.add('show');
    });

    closeChat.addEventListener('click', function() {
        chatContainer.classList.remove('show');
    });

    // Mobile Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navUl = document.querySelector('nav ul');

    mobileMenuBtn.addEventListener('click', function() {
        navUl.classList.toggle('show');
        mobileMenuBtn.textContent = navUl.classList.contains('show') ? '×' : '☰';
    });

    navUl.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            navUl.classList.remove('show');
            mobileMenuBtn.textContent = '☰';
        });
    });

    // Form Validation
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const name = this.querySelector('#name').value.trim();
            const email = this.querySelector('#email').value.trim();
            const message = this.querySelector('#message').value.trim();

            if (!name || !email || !message) {
                e.preventDefault();
                alert('Please fill out all fields.');
                return;
            }

            if (!validateEmail(email)) {
                e.preventDefault();
                alert('Please enter a valid email address.');
            }
        });
    }

    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            const email = this.querySelector('input[type="email"]').value.trim();

            if (!email) {
                e.preventDefault();
                alert('Please enter your email address.');
                return;
            }

            if (!validateEmail(email)) {
                e.preventDefault();
                alert('Please enter a valid email address.');
            }
        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // Chart Initialization
    const commodities = ['Gold', 'Oil', 'Silver', 'Copper', 'Platinum', 'Palladium'];
    const chartColors = [
        'rgba(255, 99, 132, 1)', // Red
        'rgba(54, 162, 235, 1)', // Blue
        'rgba(255, 206, 86, 1)', // Yellow
        'rgba(75, 192, 192, 1)', // Green
        'rgba(153, 102, 255, 1)', // Purple
        'rgba(255, 159, 64, 1)' // Orange
    ];

    for (let i = 1; i <= 6; i++) {
        const ctx = document.getElementById(`marketChart${i}`).getContext('2d');
        window[`chart${i}`] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: `${commodities[i-1]} Price`,
                    data: [],
                    borderColor: chartColors[i-1],
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }

    // Chat Functionality
    document.getElementById('sendButton').addEventListener('click', sendMessage);
    document.getElementById('userInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const userInput = document.getElementById('userInput');
        const message = userInput.value.trim();
        if (message) {
            appendMessage('user', message);
            fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            })
            .then(response => response.json())
            .then(data => {
                appendMessage('bot', data.text);
                if (data.chartData) {
                    updateChart(data.chartData);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                appendMessage('bot', 'Sorry, there was an error processing your request.');
            });
            userInput.value = '';
        }
    }

    function appendMessage(sender, text) {
        const messages = document.getElementById('messages');
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = text;
        messages.appendChild(messageElement);
        messages.scrollTop = messages.scrollHeight;
    }

    function updateChart(chartData) {
        const { chartId, labels, datasets } = chartData;
        const chart = window[`chart${chartId}`];
        if (chart) {
            chart.data.labels = labels;
            chart.data.datasets[0].data = datasets[0].data;
            chart.update();
        }
    }

    // Back to Top Button
    const backToTop = document.createElement('button');
    backToTop.textContent = '↑';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        padding: 0.5rem 1rem;
        background: var(--primary-color);
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        display: none;
        z-index: 1000;
    `;
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', function() {
        backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});