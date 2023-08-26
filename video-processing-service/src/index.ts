import express from 'express'
import ffmpeg from 'fluent-ffmpeg';

const app = express();
app.use(express.json());

app.post('/process-video', (req, res) => {
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    if (!inputFilePath) {
        return res.status(400).send('Bad Request: Missing input file path');
    }
    if (!outputFilePath) {
        return res.status(400).send('Bad Request: Missing output file path');
    }
    ffmpeg(inputFilePath)
        .outputOptions('-vf', 'scale=-1:360') // 360p
        .on('end', () => {
            console.log('Processing finished successfully');
            res.status(200).send('Processing finished successfully');
        })
        .on('error', (err) => {
            console.log(`An error occurred: ${err.message}`);
            res.status(500).send(`Internal Server Error: ${err.message}`)
        })
        .save(outputFilePath);
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})