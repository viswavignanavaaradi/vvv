const express = require('express');
const axios = require('axios');
const router = express.Router();

let cache = {
    data: null,
    timestamp: 0
};

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes
const ALBUM_URL = "https://photos.google.com/share/AF1QipPxjMKZ5PJIc9G2sIfqlIzcdNXj_3107jg2arKy56YpzC5csr6jz9MFiwOzQaBOiw?pli=1&key=TTNpd1lIRUZ1QnVHZ3Z1SUEzZ3FCbnpPY3hBSFpR";

router.get('/', async (req, res) => {
    const now = Date.now();

    // Return cached data if valid
    if (cache.data && (now - cache.timestamp < CACHE_TTL)) {
        return res.json(cache.data);
    }

    try {
        console.log('[Gallery Sync] Fetching album from Google Photos...');
        const response = await axios.get(ALBUM_URL);
        const html = response.data;

        // Regex to find Google Photos image base URLs in shared albums
        // Improved regex to capture common pattern in shared albums
        const regex = /https:\/\/lh3\.googleusercontent\.com\/pw\/[a-zA-Z0-9\-_]{50,}/g;
        const matches = html.match(regex);

        if (!matches) {
            console.error('[Gallery Sync] No matches found in HTML. Check if link is still public.');
            throw new Error('No images found in album HTML');
        }

        // Filter and transform
        const uniqueMatches = [...new Set(matches)];
        console.log(`[Gallery Sync] Found ${uniqueMatches.length} raw matches.`);

        // In Google Photos shared albums, the actual content photos usually appear 
        // after UI elements. However, we'll take lahat to be safe and let user see.
        const images = uniqueMatches.map((baseUrl, index) => ({
            id: index + 1,
            src: `${baseUrl}=w1200`, // Using 1200 for high quality
            category: 'all',
            caption: 'VVV Impact Moment'
        }));

        console.log(`[Gallery Sync] Successfully parsed ${images.length} images.`);

        cache.data = images;
        cache.timestamp = now;

        res.json(images);
    } catch (error) {
        console.error('[Gallery Sync Error]:', error.message);
        // Fallback to cache if available
        if (cache.data) {
            return res.json(cache.data);
        }
        res.status(500).json({ error: 'Failed to sync gallery' });
    }
});

module.exports = router;
