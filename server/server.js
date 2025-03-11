
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();


const app = express();

app.use(cors());
const port = 3002;
GITHUB_TOKEN = process.env.GITHUB_TOKEN;


app.get('/api/search', async (req , res) => 
    { const query = req.query.q || '';
    try{
        const response = await fetch(`https://api.github.com/search/repositories?q=${query}`,{
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                    'X-GitHub-Api-Version': '2022-11-28'
                },
            }
        );
        const data = await response.json();
        res.json(data);
    } catch(error){
        res.status(500).json({ error: 'failed to fetch data'});
    }
});

app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
});
