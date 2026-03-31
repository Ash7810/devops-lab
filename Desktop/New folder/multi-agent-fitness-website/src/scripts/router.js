// This file handles the routing logic for navigating between different pages.

const routes = {
    home: 'src/pages/home.html',
    dashboard: 'src/pages/dashboard.html',
    agentStudio: 'src/pages/agent-studio.html',
    settings: 'src/pages/settings.html',
};

function navigateTo(page) {
    const pagePath = routes[page];
    if (pagePath) {
        fetch(pagePath)
            .then(response => response.text())
            .then(html => {
                document.getElementById('app').innerHTML = html;
            })
            .catch(error => {
                console.error('Error loading page:', error);
            });
    } else {
        console.error('Page not found:', page);
    }
}

document.addEventListener('click', (event) => {
    if (event.target.matches('[data-route]')) {
        event.preventDefault();
        const page = event.target.getAttribute('data-route');
        navigateTo(page);
    }
});

// Initial navigation to home page
navigateTo('home');