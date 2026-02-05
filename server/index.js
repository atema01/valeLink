import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

const PORT = Number(process.env.PORT) || 3001;
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : true;

app.use(cors({ origin: corsOrigins }));
app.use(express.json({ limit: '1mb' }));

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || null;
};

const validatePayload = (payload) => {
  const requiredFields = ['senderName', 'receiverName', 'backgroundId', 'message', 'buttonStyle', 'template'];
  for (const field of requiredFields) {
    if (!payload?.[field] || typeof payload[field] !== 'string') {
      return `${field} is required`;
    }
  }

  if (payload.photoUrl && typeof payload.photoUrl !== 'string') {
    return 'photoUrl must be a string';
  }

  return null;
};

const normalizeAnswer = (answer) => {
  if (typeof answer !== 'string') return null;
  const normalized = answer.toLowerCase().trim();
  if (normalized === 'accepted' || normalized === 'yes') return 'accepted';
  if (normalized === 'rejected' || normalized === 'no') return 'rejected';
  return null;
};

const buildShareUrl = (slug) => {
  const baseUrl = process.env.PUBLIC_BASE_URL || 'http://localhost:5173';
  const trimmed = baseUrl.replace(/\/$/, '');
  return `${trimmed}/p/${slug}`;
};

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/links', async (req, res) => {
  const error = validatePayload(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const metadata = {
    userAgent: req.get('user-agent') || null,
    ip: getClientIp(req),
    clientMeta: req.body.metadata || null
  };

  let link;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const slug = nanoid(8);
    try {
      link = await prisma.link.create({
        data: {
          slug,
          senderName: req.body.senderName,
          receiverName: req.body.receiverName,
          photoUrl: req.body.photoUrl || null,
          backgroundId: req.body.backgroundId,
          message: req.body.message,
          buttonStyle: req.body.buttonStyle,
          template: req.body.template,
          metadata
        }
      });
      break;
    } catch (err) {
      if (err && err.code === 'P2002') {
        continue;
      }
      console.error('Failed to create link', err);
      return res.status(500).json({ error: 'Failed to create link' });
    }
  }

  if (!link) {
    return res.status(500).json({ error: 'Failed to generate a unique link' });
  }

  return res.json({
    slug: link.slug,
    shareUrl: buildShareUrl(link.slug)
  });
});

app.get('/api/links/:slug', async (req, res) => {
  try {
    const link = await prisma.link.update({
      where: { slug: req.params.slug },
      data: {
        viewCount: { increment: 1 },
        lastViewedAt: new Date()
      },
      select: {
        senderName: true,
        receiverName: true,
        photoUrl: true,
        backgroundId: true,
        message: true,
        buttonStyle: true,
        template: true,
        answer: true,
        answeredAt: true,
        viewCount: true,
        lastViewedAt: true
      }
    });

    return res.json({
      link: {
        senderName: link.senderName,
        receiverName: link.receiverName,
        photoUrl: link.photoUrl,
        backgroundId: link.backgroundId,
        message: link.message,
        buttonStyle: link.buttonStyle,
        template: link.template,
        answer: link.answer,
        answeredAt: link.answeredAt
      },
      viewCount: link.viewCount,
      lastViewedAt: link.lastViewedAt
    });
  } catch (err) {
    if (err && err.code === 'P2025') {
      return res.status(404).json({ error: 'Link not found' });
    }

    console.error('Failed to load link', err);
    return res.status(500).json({ error: 'Failed to load link' });
  }
});

app.get('/api/links/:slug/status', async (req, res) => {
  try {
    const link = await prisma.link.findUnique({
      where: { slug: req.params.slug },
      select: {
        senderName: true,
        receiverName: true,
        answer: true,
        answeredAt: true
      }
    });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    return res.json({
      senderName: link.senderName,
      receiverName: link.receiverName,
      answer: link.answer,
      answeredAt: link.answeredAt
    });
  } catch (err) {
    console.error('Failed to load link status', err);
    return res.status(500).json({ error: 'Failed to load link status' });
  }
});

app.post('/api/links/:slug/answer', async (req, res) => {
  const answer = normalizeAnswer(req.body?.answer);
  if (!answer) {
    return res.status(400).json({ error: 'Answer must be accepted or rejected' });
  }

  try {
    const link = await prisma.link.findUnique({
      where: { slug: req.params.slug },
      select: { id: true, answer: true, answeredAt: true }
    });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    if (link.answeredAt) {
      return res.status(409).json({ error: 'Link already answered', answer: link.answer, answeredAt: link.answeredAt });
    }

    const updated = await prisma.link.update({
      where: { slug: req.params.slug },
      data: {
        answer,
        answeredAt: new Date(),
        answeredMeta: {
          userAgent: req.get('user-agent') || null,
          ip: getClientIp(req)
        }
      },
      select: {
        answer: true,
        answeredAt: true
      }
    });

    return res.json(updated);
  } catch (err) {
    console.error('Failed to save answer', err);
    return res.status(500).json({ error: 'Failed to save answer' });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
