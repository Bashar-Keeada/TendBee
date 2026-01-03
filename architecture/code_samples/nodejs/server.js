/**
 * TendBee Node.js/Express Backend - Core Implementation Examples
 * Working skeleton code for key features.
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const Redis = require('ioredis');
const { MongoClient } = require('mongodb');

// ============================================================================
// CONFIGURATION
// ============================================================================

const config = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_ALGORITHM: 'HS256',
  ACCESS_TOKEN_EXPIRE_MINUTES: 15,
  REFRESH_TOKEN_EXPIRE_DAYS: 7,
  MAGIC_LINK_EXPIRE_MINUTES: 15,
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET || 'webhook-secret',
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
};

// ============================================================================
// INITIALIZE SERVICES
// ============================================================================

const app = express();
app.use(express.json());

let db;
let redis;

async function initializeServices() {
  // MongoDB
  const mongoClient = new MongoClient(config.MONGO_URL);
  await mongoClient.connect();
  db = mongoClient.db('tendbee');
  console.log('Connected to MongoDB');

  // Redis
  redis = new Redis(config.REDIS_URL);
  console.log('Connected to Redis');
}

// ============================================================================
// AUTHENTICATION HELPERS
// ============================================================================

function hashPassword(password) {
  return bcrypt.hashSync(password, 12);
}

function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

function createAccessToken(userId, userType) {
  const expiresIn = config.ACCESS_TOKEN_EXPIRE_MINUTES * 60;
  const token = jwt.sign(
    {
      sub: userId,
      type: userType,
      jti: uuidv4(),
    },
    config.JWT_SECRET,
    {
      algorithm: config.JWT_ALGORITHM,
      expiresIn: `${config.ACCESS_TOKEN_EXPIRE_MINUTES}m`,
    }
  );
  return { token, expiresIn };
}

function createRefreshToken(userId) {
  return jwt.sign(
    {
      sub: userId,
      type: 'refresh',
      jti: uuidv4(),
    },
    config.JWT_SECRET,
    {
      algorithm: config.JWT_ALGORITHM,
      expiresIn: `${config.REFRESH_TOKEN_EXPIRE_DAYS}d`,
    }
  );
}

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, config.JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const user = await db.collection('users').findOne(
      { id: payload.sub },
      { projection: { _id: 0, password_hash: 0 } }
    );

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  });
}

// ============================================================================
// AUTH ENDPOINTS
// ============================================================================

/**
 * POST /api/auth/login
 * Login with email/password or request magic link
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, method, user_type } = req.body;

    // Magic link flow
    if (method === 'magic_link') {
      const token = crypto.randomBytes(32).toString('base64url');
      
      await redis.setex(
        `magic_link:${token}`,
        config.MAGIC_LINK_EXPIRE_MINUTES * 60,
        JSON.stringify({ email })
      );

      // TODO: Send email with magic link
      // const link = `https://app.tendbee.se/auth/verify?token=${token}`;
      // await sendMagicLinkEmail(email, link);

      return res.json({
        message: 'Magic link sent to your email',
        expires_in: config.MAGIC_LINK_EXPIRE_MINUTES * 60,
      });
    }

    // Password login
    const user = await db.collection('users').findOne({ email });

    if (!user || !verifyPassword(password, user.password_hash || '')) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { token: accessToken, expiresIn } = createAccessToken(
      user.id,
      user.user_type || 'jobseeker'
    );
    const refreshToken = createRefreshToken(user.id);

    // Store refresh token
    await redis.setex(
      `refresh_token:${user.id}`,
      config.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
      refreshToken
    );

    res.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: expiresIn,
      user: {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/magic-link
 * Request magic link for passwordless login
 */
app.post('/api/auth/magic-link', async (req, res) => {
  try {
    const { email } = req.body;
    const token = crypto.randomBytes(32).toString('base64url');

    await redis.setex(
      `magic_link:${token}`,
      config.MAGIC_LINK_EXPIRE_MINUTES * 60,
      JSON.stringify({ email })
    );

    // TODO: Send email
    res.json({
      message: 'Magic link sent',
      expires_in: config.MAGIC_LINK_EXPIRE_MINUTES * 60,
    });
  } catch (error) {
    console.error('Magic link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/verify-magic-link
 * Verify magic link token and return JWT
 */
app.post('/api/auth/verify-magic-link', async (req, res) => {
  try {
    const { token } = req.body;

    // Get and delete token (single use)
    const data = await redis.get(`magic_link:${token}`);
    if (!data) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    await redis.del(`magic_link:${token}`);

    const { email } = JSON.parse(data);

    // Find or create user
    let user = await db.collection('users').findOne({ email });

    if (!user) {
      user = {
        id: uuidv4(),
        email,
        user_type: 'jobseeker',
        created_at: new Date().toISOString(),
        consent: {
          gdpr: true,
          gdpr_timestamp: new Date().toISOString(),
        },
      };
      await db.collection('users').insertOne(user);
    }

    const { token: accessToken, expiresIn } = createAccessToken(
      user.id,
      user.user_type || 'jobseeker'
    );
    const refreshToken = createRefreshToken(user.id);

    res.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: expiresIn,
      user: {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
      },
    });
  } catch (error) {
    console.error('Verify magic link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
app.post('/api/auth/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body;

    const payload = jwt.verify(refresh_token, config.JWT_SECRET);

    if (payload.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid token type' });
    }

    // Verify token is still valid (not revoked)
    const storedToken = await redis.get(`refresh_token:${payload.sub}`);
    if (!storedToken || storedToken !== refresh_token) {
      return res.status(401).json({ error: 'Token revoked' });
    }

    const user = await db.collection('users').findOne({ id: payload.sub });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Issue new tokens (rotate refresh token)
    const { token: accessToken, expiresIn } = createAccessToken(
      payload.sub,
      user.user_type || 'jobseeker'
    );
    const newRefreshToken = createRefreshToken(payload.sub);

    // Update stored refresh token
    await redis.setex(
      `refresh_token:${payload.sub}`,
      config.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
      newRefreshToken
    );

    res.json({
      access_token: accessToken,
      refresh_token: newRefreshToken,
      token_type: 'Bearer',
      expires_in: expiresIn,
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Refresh token expired' });
    }
    console.error('Refresh error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/logout
 * Logout user by invalidating refresh token
 */
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    await redis.del(`refresh_token:${req.user.id}`);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// JOB INGESTION ENDPOINTS
// ============================================================================

/**
 * Verify HMAC-SHA256 webhook signature
 */
function verifyWebhookSignature(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(`sha256=${expected}`),
    Buffer.from(signature || '')
  );
}

/**
 * Generate dedupe fingerprint for a job
 */
function generateFingerprint(job) {
  let key;
  if (job.source && job.external_id) {
    key = `${job.source}:${job.external_id}`;
  } else {
    // Fallback fingerprint
    const components = [
      (job.title || '').toLowerCase().trim(),
      (job.company || '').toLowerCase().trim(),
      (job.location?.city || '').toLowerCase().trim(),
      (job.published_at || '').slice(0, 10),
    ];
    key = components.join('|');
  }
  return crypto.createHash('sha256').update(key).digest('hex');
}

/**
 * Normalize Platsbanken job to canonical schema
 */
function normalizePlatsbankenJob(raw) {
  return {
    job_id: `platsbanken:${raw.id || raw.annonsid}`,
    source: 'platsbanken',
    title: raw.rubrik || raw.title || '',
    description: raw.beskrivning || raw.description || '',
    company: raw.arbetsgivare?.namn || raw.company || '',
    location: {
      city: raw.arbetsort?.namn || '',
      region: raw.lan?.namn || '',
      country: 'Sverige',
    },
    employment_type: raw.anstallningstyp || 'heltid',
    published_at: raw.publiceringsdatum || new Date().toISOString(),
    application_url: raw.webbplats || raw.application_url,
    fingerprint: generateFingerprint({
      source: 'platsbanken',
      external_id: raw.id || raw.annonsid,
    }),
  };
}

const normalizers = {
  platsbanken: normalizePlatsbankenJob,
  // Add more normalizers as needed
};

/**
 * POST /api/jobs/ingest
 * Webhook endpoint for ingesting jobs from external sources
 */
app.post('/api/jobs/ingest', async (req, res) => {
  try {
    // Verify webhook signature
    const signature = req.headers['x-webhook-signature'];
    if (signature) {
      const rawBody = JSON.stringify(req.body);
      if (!verifyWebhookSignature(rawBody, signature, config.WEBHOOK_SECRET)) {
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const { source, job_id, payload, action = 'create' } = req.body;

    // Check idempotency
    const idempotencyKey = `${source}:${job_id}`;
    const existing = await redis.get(`ingest:${idempotencyKey}`);
    if (existing) {
      return res.json({ ingest_id: existing, status: 'already_processing' });
    }

    // Create ingest record
    const ingestId = uuidv4();

    await db.collection('ingest_logs').insertOne({
      ingest_id: ingestId,
      source,
      external_job_id: job_id,
      status: 'queued',
      action,
      created_at: new Date().toISOString(),
    });

    // Set idempotency key (24 hour TTL)
    await redis.setex(`ingest:${idempotencyKey}`, 86400, ingestId);

    // Queue for background processing
    await redis.rpush(
      'ingest_queue',
      JSON.stringify({
        ingest_id: ingestId,
        source,
        job_id,
        payload,
      })
    );

    res.status(202).json({ ingest_id: ingestId, status: 'queued' });
  } catch (error) {
    console.error('Ingest error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Background worker to process ingested jobs
 * (Run this as a separate process in production)
 */
async function processIngestQueue() {
  while (true) {
    try {
      // Blocking pop from queue
      const item = await redis.blpop('ingest_queue', 10);
      if (!item) continue;

      const data = JSON.parse(item[1]);
      const { ingest_id, source, job_id, payload } = data;

      console.log(`Processing job: ${source}:${job_id}`);

      // Normalize
      const normalizer = normalizers[source];
      if (!normalizer) {
        throw new Error(`Unknown source: ${source}`);
      }

      const normalized = normalizer(payload);

      // Check for duplicates
      const existingJob = await db
        .collection('jobs')
        .findOne({ fingerprint: normalized.fingerprint });

      if (existingJob) {
        // Update existing
        await db.collection('jobs').updateOne(
          { fingerprint: normalized.fingerprint },
          {
            $set: {
              updated_at: new Date().toISOString(),
              raw_payload: payload,
            },
          }
        );

        await db.collection('ingest_logs').updateOne(
          { ingest_id },
          {
            $set: {
              status: 'duplicate',
              canonical_job_id: existingJob.job_id,
            },
          }
        );
        continue;
      }

      // TODO: Generate embeddings (call Python service or use JS equivalent)
      // normalized.embedding = await generateEmbedding(normalized);

      // Save to database
      await db.collection('jobs').insertOne({
        ...normalized,
        status: 'active',
        raw_payload: payload,
        created_at: new Date().toISOString(),
      });

      // Queue for matching
      await redis.rpush(
        'match_queue',
        JSON.stringify({
          job_id: normalized.job_id,
          timestamp: new Date().toISOString(),
        })
      );

      // Update ingest log
      await db.collection('ingest_logs').updateOne(
        { ingest_id },
        {
          $set: {
            status: 'completed',
            canonical_job_id: normalized.job_id,
            completed_at: new Date().toISOString(),
          },
        }
      );

      console.log(`Completed: ${normalized.job_id}`);
    } catch (error) {
      console.error('Worker error:', error);
      // Add to DLQ
      // ...
    }
  }
}

// ============================================================================
// START SERVER
// ============================================================================

const PORT = process.env.PORT || 8001;

initializeServices()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Start background worker (in production, run separately)
    if (process.env.RUN_WORKER === 'true') {
      processIngestQueue().catch(console.error);
    }
  })
  .catch((error) => {
    console.error('Failed to initialize:', error);
    process.exit(1);
  });

module.exports = app;
