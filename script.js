document.addEventListener('DOMContentLoaded', function() {
    const appGrid = document.getElementById('app-grid');
    const appDetails = document.getElementById('app-details');
    const manifests = ['manifests/2048.json', 'manifests/stack.json', 'manifests/Mania.json', 'manifests/sm64.json'];

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
                        <h3>${data.developer}</h3>
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
                                <span>${data.downloads}+</span>
                                <span>Downloads</span>
                            </div>
                            <div class="app-content-rating">
                                <span>${data.content_rating}</span>
                            </div>
                        </div>
                        <a href="${data.install_url}" class="install-button">Install</a>
                        <div class="screenshots">${screenshots}</div>
                        <div id="about-this-game">
                            <h2>About this game</h2>
                            <p>${data.description}</p>
                        </div>
                    `;
                });
        }
    }
});