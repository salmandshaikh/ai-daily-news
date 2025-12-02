document.addEventListener('DOMContentLoaded', () => {
    fetch('data/news.json')
        .then(response => response.json())
        .then(data => {
            renderNews(data);
        })
        .catch(error => {
            console.error('Error loading news:', error);
            document.getElementById('news-grid').innerHTML = '<p>Error loading news data. Please try again later.</p>';
        });
});

function renderNews(data) {
    // Update timestamp
    const date = new Date(data.updated);
    document.getElementById('last-updated').textContent = `Last updated: ${date.toLocaleString()}`;

    const articles = data.articles;
    if (!articles || articles.length === 0) return;

    // Render Hero Article (First one)
    const heroArticle = articles[0];
    const heroSection = document.getElementById('hero-news');

    heroSection.innerHTML = `
        <div class="hero-card">
            ${heroArticle.image && heroArticle.image.trim() !== '' ? `<div class="hero-image">
                <img src="${heroArticle.image}" 
                     alt="${heroArticle.title}" 
                     loading="lazy"
                     onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop';">
            </div>` : ''}
            <div class="hero-content">
                <h2><a href="${heroArticle.url}" target="_blank" rel="noopener noreferrer">${heroArticle.title}</a></h2>
                <p>${heroArticle.summary || 'No summary available.'}</p>
                <div class="meta-info">
                    <span class="meta-tag">Top Story</span>
                    <span class="meta-source">${heroArticle.source_name || heroArticle.source}</span>
                    <span class="meta-source">${new Date(heroArticle.published).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    `;

    // Render Remaining Articles
    const newsGrid = document.getElementById('news-grid');
    newsGrid.innerHTML = ''; // Clear existing

    // Start from index 1
    for (let i = 1; i < articles.length; i++) {
        const article = articles[i];
        const card = document.createElement('div');
        card.className = 'news-card';

        card.innerHTML = `
            ${article.image && article.image.trim() !== '' ? `<div class="card-image">
                <img src="${article.image}" 
                     alt="${article.title}" 
                     loading="lazy"
                     onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop';">
            </div>` : ''}
            <h3><a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.title}</a></h3>
            <p>${article.summary || 'No summary available.'}</p>
            <div class="meta-info">
                <span class="meta-tag">${article.source}</span>
                <span class="meta-source">${article.source_name || ''}</span>
            </div>
        `;
        newsGrid.appendChild(card);
    }
}
