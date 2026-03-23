// const express = require('express');
// const fetch   = require('node-fetch');
// const app     = express();

// app.use(express.json());

// // ===== CONFIG =====
// const VERIFY_TOKEN       = 'shopbot_verify_2024';
// const GROQ_API_KEY       = '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';       // তোমার Groq key
// const PAGE_ACCESS_TOKEN  = 'EAAUIJVgt7zIBRKBQSlMdGtV5ZAEQS9MBe9WpPzAn2OyVzE2qhRZAIaRb6l0uUZCm59VHFQUnBg78rJIi4kO7bh4QGJRbybOluRUqYdOVlhjRU0Kt9vslMtBRZCpJZB0W1bxZAipqZBwd7sjuKrv3NUETjhijiQJjCfvSlAeQZCRtVSeVpAAalEkPqb8vzSjWUtpFTTZAIXrZAi0Sshzj9nZA705zQpkhLsHRrFAzNJNS80ZD';      // তোমার Page token
// const GROQ_MODEL         = 'llama-3.3-70b-versatile';
// // ==================

// const FAQ_CONTEXT = `
// প্রশ্ন ১: delivery কত দিন লাগে / ডেলিভারি / কখন পাবো
// উত্তর ১: ডেলিভারি সময় ২-৩ কার্যদিবস। ঢাকার মধ্যে সাধারণত ১-২ দিন লাগে।

// প্রশ্ন ২: payment কিভাবে করব / টাকা / বিকাশ / নগদ / COD
// উত্তর ২: আমরা Cash on Delivery (COD) গ্রহণ করি। পণ্য হাতে পাওয়ার পর টাকা দিন।

// প্রশ্ন ৩: কোথায় deliver করো / সারা বাংলাদেশ / location / জেলা
// উত্তর ৩: সারা বাংলাদেশে ডেলিভারি দেওয়া হয়। সকল জেলায় সার্ভিস আছে।

// প্রশ্ন ৪: return policy / ফেরত / রিপ্লেসমেন্ট / পণ্য খারাপ / নষ্ট
// উত্তর ৪: পণ্য পাওয়ার ৩ দিনের মধ্যে সমস্যা হলে বিনামূল্যে রিপ্লেসমেন্ট দেওয়া হবে।

// প্রশ্ন ৫: product quality / কোয়ালিটি / মান / আসল / original
// উত্তর ৫: সব পণ্য Premium Export Quality। ১০০% অরিজিনাল গ্যারান্টি।
// `.trim();

// const SYSTEM_PROMPT = `তুমি ShopBot BD-এর একজন বিনয়ী ও সহায়ক কাস্টমার সার্ভিস প্রতিনিধি।
// তুমি Bangla এবং English উভয় ভাষায় বুঝতে পারো এবং সবসময় বাংলায় উত্তর দাও।

// আমাদের FAQ:
// ${FAQ_CONTEXT}

// নিয়ম:
// ১. সবসময় বাংলায় উত্তর দাও।
// ২. উত্তর সংক্ষিপ্ত রাখো, ২-৩ লাইন।
// ৩. বিনয়ী ও আন্তরিক ভাষায় কথা বলো।
// ৪. FAQ মিললে সেই উত্তর দাও।
// ৫. অজানা হলে বলো: আপনার প্রশ্নটি বুঝতে পারিনি, একটু বিস্তারিত বলবেন?
// ৬. কখনো মিথ্যা তথ্য দেবে না।`;

// // Groq API call
// async function getGroqReply(userMessage) {
//   try {
//     const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${GROQ_API_KEY}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         model: GROQ_MODEL,
//         max_tokens: 300,
//         temperature: 0.7,
//         messages: [
//           { role: 'system', content: SYSTEM_PROMPT },
//           { role: 'user',   content: userMessage }
//         ]
//       })
//     });

//     const data = await response.json();

//     if (data.choices && data.choices[0] && data.choices[0].message) {
//       return data.choices[0].message.content.trim();
//     }

//     console.error('Groq unexpected response:', JSON.stringify(data));
//     return 'দুঃখিত, এই মুহূর্তে উত্তর দিতে পারছি না। একটু পরে আবার চেষ্টা করুন।';

//   } catch (err) {
//     console.error('Groq API error:', err.message);
//     return 'দুঃখিত, সিস্টেমে সমস্যা হচ্ছে। একটু পরে আবার লিখুন।';
//   }
// }

// // Send message to Facebook
// async function sendFacebookMessage(recipientId, messageText) {
//   try {
//     const response = await fetch(
//       `https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           recipient:      { id: recipientId },
//           message:        { text: messageText },
//           messaging_type: 'RESPONSE'
//         })
//       }
//     );

//     const data = await response.json();

//     if (data.error) {
//       console.error('Facebook send error:', data.error.message);
//     } else {
//       console.log(`Reply sent to ${recipientId}`);
//     }

//   } catch (err) {
//     console.error('Facebook API error:', err.message);
//   }
// }

// // Webhook Verification (GET)
// app.get('/webhook', (req, res) => {
//   const mode      = req.query['hub.mode'];
//   const token     = req.query['hub.verify_token'];
//   const challenge = req.query['hub.challenge'];

//   console.log('Verify request received');

//   if (mode === 'subscribe' && token === VERIFY_TOKEN) {
//     console.log('Webhook verified!');
//     res.status(200).send(challenge);
//   } else {
//     console.log('Verification failed');
//     res.status(403).send('Forbidden');
//   }
// });

// // Receive Messages (POST)
// app.post('/webhook', async (req, res) => {
//   const body = req.body;

//   res.status(200).send('EVENT_RECEIVED');

//   if (!body || body.object !== 'page') return;
//   if (!body.entry || !body.entry[0]) return;

//   const entry = body.entry[0];
//   if (!entry.messaging || !entry.messaging[0]) return;

//   const messaging = entry.messaging[0];

//   if (messaging.message && messaging.message.is_echo) return;
//   if (messaging.delivery || messaging.read) return;
//   if (!messaging.message || !messaging.message.text) return;

//   const senderId    = messaging.sender.id;
//   const userMessage = messaging.message.text.trim();

//   console.log(`Message from ${senderId}: "${userMessage}"`);
//   console.log('Getting AI reply from Groq...');

//   const replyText = await getGroqReply(userMessage);
//   console.log(`Reply: "${replyText}"`);

//   await sendFacebookMessage(senderId, replyText);
// });

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log('');
//   console.log('ShopBot BD - Facebook Auto-Reply Agent');
//   console.log('=======================================');
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Webhook: http://localhost:${PORT}/webhook`);
//   console.log('');
// });






const express = require('express');
const fetch   = require('node-fetch');
const app     = express();

app.use(express.json());

const VERIFY_TOKEN = 'shopbot_verify_2024';
const N8N_WEBHOOK  = 'http://localhost:5678/webhook/facebook-message';

// Webhook Verification (GET)
app.get('/webhook', (req, res) => {
  const mode      = req.query['hub.mode'];
  const token     = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  console.log('Verify request received');
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified!');
    res.status(200).send(challenge);
  } else {
    res.status(403).send('Forbidden');
  }
});

// Receive Facebook Messages (POST) → Forward to n8n
app.post('/webhook', async (req, res) => {
  const body = req.body;
  res.status(200).send('EVENT_RECEIVED');

  if (!body || body.object !== 'page') return;
  if (!body.entry || !body.entry[0]) return;

  const entry = body.entry[0];
  if (!entry.messaging || !entry.messaging[0]) return;

  const messaging = entry.messaging[0];
  if (messaging.message && messaging.message.is_echo) return;
  if (messaging.delivery || messaging.read) return;
  if (!messaging.message || !messaging.message.text) return;

  const senderId    = messaging.sender.id;
  const messageText = messaging.message.text.trim();

  console.log(`Message from ${senderId}: "${messageText}"`);
  console.log('Forwarding to n8n...');

  try {
    await fetch(N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId, messageText })
    });
    console.log('Forwarded to n8n successfully');
  } catch (err) {
    console.error('n8n forward error:', err.message);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log('');
  console.log('ShopBot BD - Webhook Server');
  console.log('============================');
  console.log(`Server running on port ${PORT}`);
  console.log('Waiting for Facebook messages...');
  console.log('');
});