const authenticateToken = require('../tokenValidation');

const express = require('express');
const crypto = require('crypto');

const router = express.Router();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;

router.post('/encrypt', authenticateToken, (req, res) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);

  let encrypted = cipher.update(JSON.stringify(req.body));
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  res.send(iv.toString('hex') + ':' + encrypted.toString('hex'));
});

router.post('/decrypt', authenticateToken, (req, res) => {
  const textParts = req.body.qrcode.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  res.json(JSON.parse(decrypted.toString()));
})

module.exports = router;