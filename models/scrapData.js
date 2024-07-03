const mongoose = require('mongoose');

const scrapedDataSchema = new mongoose.Schema({
    name: String,
    description: String,
    companyLogo: String,
    facebookURL: String,
    linkedinURL: String,
    twitterURL: String,
    instagramURL: String,
    address: String,
    phoneNumber: String,
    email: String,
    url: { type: String, required: true }
});

// Define a model for the scraped data
const ScrapedData = mongoose.model('ScrapedData', scrapedDataSchema);

module.exports = ScrapedData;