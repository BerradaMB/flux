const express = require('express');
const Parser = require('rss-parser');
const cors = require('cors');

const app = express();
const parser = new Parser();

app.use(cors());

const rssFeeds = [
  'https://www.foot01.com/equipe/paris/news.rss',
  'https://madeinparisiens.ouest-france.fr/flux/rss_news.php',
 
];

// Endpoint pour récupérer les actualités
app.get('/news', async (req, res) => {
  let newsItems = [];

  for (const url of rssFeeds) {
    try {
      const feed = await parser.parseURL(url);
      const siteName = new URL(url).hostname;

      feed.items.forEach((item) => {
        newsItems.push({
          title: item.title,
          link: item.link,
          description: item.contentSnippet,
          image: item.enclosure?.url || null,
          source: siteName,
        });
      });
    } catch (err) {
      console.error(`Erreur lors de la récupération du flux ${url}:`, err);
    }
  }

  // Trier les articles par date (si disponible)
  newsItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  res.json(newsItems);
});

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
