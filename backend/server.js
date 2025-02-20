const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { HfInference } = require('@huggingface/inference');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

app.post('/api/generate', async (req, res) => {
    try {
        const { prompt, model = 'gpt2' } = req.body;
        
        const result = await hf.textGeneration({
            model: model,
            inputs: prompt,
            parameters: {
                max_length: 100,
                temperature: 0.7,
                top_p: 0.95
            }
        });

        res.json({ 
            success: true, 
            generated_text: result.generated_text 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to generate text' 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});