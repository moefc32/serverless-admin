export default {
    emailBlacklist: {
        isCaseSensitive: false,
        findAllMatches: true,
        keys: [
            { name: 'address', weight: 1.00 },
        ],
        threshold: 0.2,
        ignoreLocation: true,
    },
    urlShortener: {
        isCaseSensitive: false,
        findAllMatches: true,
        keys: [
            { name: 'title', weight: 0.35 },
            { name: 'shortUrl', weight: 0.65 },
        ],
        threshold: 0.2,
        ignoreLocation: true,
    },
};
