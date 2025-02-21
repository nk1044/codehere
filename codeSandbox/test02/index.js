import express from 'express';
import CodeRunner from './codeServer/CodeRunner.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
    });

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.post('/run-code', CodeRunner);