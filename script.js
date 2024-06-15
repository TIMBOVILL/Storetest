if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log('Service Worker registered'))
        .catch(err => console.log('Service Worker registration failed', err));
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

document.addEventListener('DOMContentLoaded', function() {
    const appGrid = document.getElementById('app-grid');
    const appDetails = document.getElementById('app-details');
    const manifests = ['manifests/2048.json', 'manifests/stack.json', 'manifests/mania.json', 'manifests/sm64.json'];

    if (appGrid) {
        manifests.forEach(manifest => {
            fetch(manifest)
                .then(response => response.json())
                .then(data => {
                    const appCard = document.createElement('div');
                    appCard.classList.add('app-card');
                    appCard.innerHTML = `
                        <img src="${data.icon}" alt="${data.name}">
                        <h3>${data.name}</h3>
                    `;
                    appCard.addEventListener('click', () => {
                        window.location.href = `app.html?manifest=${manifest}`;
                    });
                    appGrid.appendChild(appCard);
                });
        });
    }

    if (appDetails) {
        const urlParams = new URLSearchParams(window.location.search);
        const manifest = urlParams.get('manifest');

        if (manifest) {
            fetch(manifest)
                .then(response => response.json())
                .then(data => {
                    const installButton = document.createElement('button');
                    installButton.textContent = 'Install';
                    installButton.className = 'install-button';

                    installButton.addEventListener('click', () => {
                        if (deferredPrompt) {
                            deferredPrompt.prompt();
                            deferredPrompt.userChoice.then((choiceResult) => {
                                if (choiceResult.outcome === 'accepted') {
                                    console.log('User accepted the install prompt');
                                } else {
                                    console.log('User dismissed the install prompt');
                                }
                                deferredPrompt = null;
                            });
                        } else {
                            window.location.href = data.install_url;
                        }
                    });

                    const screenshots = data.screenshots.map(src => `<img src="${src}" alt="Screenshot">`).join('');
                    appDetails.innerHTML = `
                        <div class="background" style="background-image: url(${data.background});"></div>
                        <img src="${data.icon}" alt="${data.name}" class="app-icon">
                        <h1>${data.name}</h1>
                        <p>${data.developer}</p>
                        <div class="app-metadata">
                            <div class="app-rating">
                                <span>${data.rating}</span> ★
                                <span>(${data.reviews} reviews)</span>
                            </div>
                            <div class="app-downloads">
                                <span>${data.downloads}</span>
                            </div>
                        </div>
                        <div class="install-section"></div>
                        <div class="screenshots">
                            ${screenshots}
                        </div>
                        <div class="about-section">
                            <h2>About this game</h2>
                            <p>${data.description}</p>
                        </div>
                    `;

                    document.querySelector('.install-section').appendChild(installButton);
                });
        }
    }
});