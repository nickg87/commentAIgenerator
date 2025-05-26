import { Router } from 'express';
import { Client } from '../models/Client.js';
import { Site } from '../models/Site.js';
import { Request as Req } from '../models/Request.js';
import { Comment } from '../models/Comment.js';
import { generateComment } from '../services/openaiService.js';

export const api = Router();

// CRUD Clients
api.get('/clients', async (_, res) => res.json(await Client.findAll()));
api.post('/clients', async (req, res) => res.json(await Client.create(req.body)));
api.patch('/clients/:id', async (req, res) => {
  const c = await Client.findByPk(req.params.id);
  res.json(await c.update(req.body));
});
api.delete('/clients/:id', async (req, res) => res.json(await Client.destroy({ where: { id: req.params.id } })));

// CRUD Sites
api.get('/sites', async (_, res) => res.json(await Site.findAll({ include: Client })));
api.post('/sites', async (req, res) => res.json(await Site.create(req.body)));

// Generate comment
api.post('/generate-comment', async (req, res) => {
  //await Client.create({ id: 1, name: 'Example Client', active: true });
  //await Site.create({ id: 1, clientId: 1, url: 'parcuri.ro', active: true });

  await Client.findOrCreate({
    where: { id: 1 },
    defaults: {
      name: 'Example Client',
      active: true
    }
  });

  await Site.findOrCreate({
    where: { id: 1 },
    defaults: {
      clientId: 1,
      url: 'parcuri.ro',
      active: true
    }
  });

  try {
    const { clientId, siteId } = req.body;
    const { generatedComment, userName, usage } = await generateComment(req.body);
    console.log(generatedComment)
    // persist request + comment
    const requestRecord = await Req.create({
      clientId,
      siteId,
      requestQuery: JSON.stringify(req.body),
      totalTokens: usage.total_tokens
    });
    await Comment.create({ requestId: requestRecord.id, comment: generatedComment });

    res.json({ generatedComment, userName, rating: req.body.rating, usage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed' });
  }
});

// Comments list
api.get('/comments', async (_, res) => {
  const data = await Comment.findAll({ include: { model: Req, include: [Client, Site] } });
  res.json(data);
});
