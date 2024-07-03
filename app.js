const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const app = express();
const ScrapedData = require('./models/scrapData');
const connectDB = require('./db/db')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

connectDB()
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));



app.post('/scrape', async (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        // const data = {
        //     name: $('meta[property="og:site_name"]').attr('content') || $('title').text(),
        //     description: $('meta[name="description"]').attr('content'),
        //     companyLogo: $('meta[property="og:image"]').attr('content'),
        //     facebookURL: $('a[href*="facebook.com"]').attr('href'),
        //     linkedinURL: $('a[href*="linkedin.com"]').attr('href'),
        //     twitterURL: $('a[href*="twitter.com"]').attr('href'),
        //     instagramURL: $('a[href*="instagram.com"]').attr('href'),
        //     address: $('address').text().trim(),
        //     phoneNumber: $('a[href^="tel:"]').attr('href') ? $('a[href^="tel:"]').attr('href').replace('tel:', '') : '',
        //     email: $('a[href^="mailto:"]').attr('href') ? $('a[href^="mailto:"]').attr('href').replace('mailto:', '') : ''
        // };
        const data = {
            // name: $('meta[property="og:site_name"]').attr('content') || $('meta[name="application-name"]').attr('content') || $('meta[name="og:site_name"]').attr('content') || $('title').text().trim(),
            name: $('meta[property="og:site_name"]').attr('content') || $('meta[name="application-name"]').attr('content') || $('meta[name="og:site_name"]').attr('content') || $('title').text().trim(),
            description: $('meta[name="description"]').attr('content'),
            companyLogo: $('meta[property="og:image"]').attr('content') || $('link[rel="icon"]').attr('href'),
            facebookURL: $('a[href*="facebook.com"]').attr('href') || '',
            linkedinURL: $('a[href*="linkedin.com"]').attr('href') || '',
            twitterURL: $('a[href*="twitter.com"]').attr('href') || '',
            instagramURL: $('a[href*="instagram.com"]').attr('href') || '' ,
            address: $('address').text().trim() || '',
            phoneNumber: $('a[href^="tel:"]').attr('href') ? $('a[href^="tel:"]').attr('href').replace('tel:', '') : '',
            email: $('a[href^="mailto:"]').attr('href') ? $('a[href^="mailto:"]').attr('href').replace('mailto:', '') : '',
            url // Save the original URL for reference
        };

        // Save the data to DB
        // fs.writeFileSync( 'data.json', JSON.stringify(data, null, 2));
        const scrapedData = new ScrapedData(data);
        await scrapedData.save();

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error scraping the website');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
