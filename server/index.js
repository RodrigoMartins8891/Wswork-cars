const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());


app.post('/api/chat', async (req, res) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Erro no proxy Anthropic:', err);
    res.status(500).json({ error: 'Erro interno no proxy.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy IA rodando em http://localhost:${PORT}`);
  console.log(`   Configure sua ANTHROPIC_API_KEY no arquivo server/index.js`);
});
