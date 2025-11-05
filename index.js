import TelegramBot from "node-telegram-bot-api";

const token = "YOUR_BOT_TOKEN_HERE";
const groupLink = "https://t.me/near9ja";
const bot = new TelegramBot(token, { polling: true });

// In-memory database for now
const users = new Map();

bot.onText(/\/start(.*)/, (msg, match) => {
  const chatId = msg.chat.id;
  const refCode = match[1]?.trim();

  if (!users.has(chatId)) {
    users.set(chatId, { username: msg.from.username || "anonymous", invites: 0 });
  }

  // Handle referral
  if (refCode && refCode !== String(chatId) && users.has(Number(refCode))) {
    const refUser = users.get(Number(refCode));
    refUser.invites += 1;
    bot.sendMessage(Number(refCode), `🎉 Someone joined using your invite link! You now have ${refUser.invites} invites.`);
  }

  bot.sendMessage(
    chatId,
    `👋 Welcome to NEAR 9ja!\n\nJoin our community: ${groupLink}\n\nUse /getlink to get your personal invite link.`
  );
});

bot.onText(/\/getlink/, (msg) => {
  const chatId = msg.chat.id;
  if (!users.has(chatId)) {
    users.set(chatId, { username: msg.from.username || "anonymous", invites: 0 });
  }

  const inviteLink = `https://t.me/${bot.username}?start=${chatId}`;
  bot.sendMessage(chatId, `✨ Your personal invite link:\n${inviteLink}`);
});

console.log("🚀 Bot is running...");
