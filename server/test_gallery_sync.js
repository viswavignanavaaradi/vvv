const axios = require('axios');

const ALBUM_URL = "https://photos.app.goo.gl/TSYfXpw1zqxi59BV9";

async function test() {
    try {
        console.log('Fetching:', ALBUM_URL);
        const response = await axios.get(ALBUM_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const html = response.data;
        console.log('Fetched successfully. HTML length:', html.length);
        console.log('Redirected to URL:', response.request.res.responseUrl || response.config.url);

        // Regex to find Google Photos image base URLs
        const regex = /https:\/\/lh3\.googleusercontent\.com\/pw\/[a-zA-Z0-9\-_]{50,}/g;
        const matches = html.match(regex);

        if (!matches) {
            console.log('No matches found.');
            return;
        }

        const uniqueMatches = [...new Set(matches)];
        console.log(`Found ${uniqueMatches.length} unique image URLs.`);
        console.log('Sample URLs (first 3):');
        uniqueMatches.slice(0, 3).forEach((url, i) => {
            console.log(`${i + 1}: ${url}=w1200`);
        });
    } catch (err) {
        console.error('Error:', err.message);
    }
}

test();
