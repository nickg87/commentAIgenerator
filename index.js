import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './db.js';
import { Client } from './models/Client.js';
import { Site } from './models/Site.js';
import { Request } from './models/Request.js';
import { Comment } from './models/Comment.js';
import { api } from './routes/api.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

await initDb();
await Client.sync();
await Site.sync();
await Request.sync();
await Comment.sync();

const app = express();
app.use(express.json());
app.use('/api', api);
app.use(express.static(path.join(__dirname, 'public')));

// THIS IS THE NEW LINE/BLOCK:
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// END NEW LINE/BLOCK

app.listen(process.env.PORT, () => console.log(`Server on ${process.env.PORT}`));