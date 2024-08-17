const express = require('express');
const https = require('https'); 

const app = express();


const fetchFromAPI = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';

        
            res.on('data', (chunk) => {
                data += chunk;
            });

            
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
};

app.get('/categories/:categoryname/products', async (req, res) => {
    const { categoryname } = req.params;
    const { price_min, price_max, sort, limit, page } = req.query;

    const apiUrl = 'https://api.ecommerce.com/products?category=${categoryname}&price_min=${price_min}&price_max=${price_max}&sort=${sort}&limit=${limit}&page=${page}';

    try {
        const products = await fetchFromAPI(apiUrl);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/categories/:categoryname/products/:productid', async (req, res) => {
    const { productid } = req.params;

    const apiUrl = 'https://api.ecommerce.com/products/${productid}';

    try {
        const productDetails = await fetchFromAPI(apiUrl);
        res.json(productDetails);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product details' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port ${PORT}");
});