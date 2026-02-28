const fs = require('fs');
const content = fs.readFileSync('c:/ngo/server/gallery_html.html', 'utf8');

// Google Photos uses "https://lh3.googleusercontent.com/pw/..." for images in shared albums
// We need to find these patterns. They are often in JSON arrays.
const regex = /https:\/\/lh3\.googleusercontent\.com\/pw\/[a-zA-Z0-9\-_]+/g;
const matches = content.match(regex);

if (matches) {
    const uniqueMatches = [...new Set(matches)];
    console.log(`Found ${uniqueMatches.length} unique images.`);
    // The first few might be profile pics or UI elements, but the bulk will be album photos
    uniqueMatches.slice(0, 10).forEach((url, i) => {
        console.log(`${i + 1}: ${url}`);
    });
} else {
    console.log('No matches found.');
}
