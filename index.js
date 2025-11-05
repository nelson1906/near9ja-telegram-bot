import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.BOT_TOKEN;
const groupLink = process.env.GROUP_LINK;

const bot = new TelegramBot(token, { polling: true });

// Store user referral codes in memory (we’ll later move this to a DB)
const userReferrals = new Map();

bot.onText(/\/start(.*)/, (msg, match) => {
  const chatId = msg.chat.id;
  const referralId = match[1]?.trim();

  if (referralId) {
    bot.sendMessage(chatId, `You joined using invite code: ${referralId}`);
  } else {
    bot.sendMessage(chatId, "Welcome to NEAR 9ja! Use /getlink to get your referral link.");
  }
});

bot.onText(/\/getlink/, (msg) => {
  const userId = msg.from.id;
  const inviteLink = `https://t.me/${process.env.BOT_USERNAME}?start=${userId}`;

  userReferrals.set(userId, 0); // initialize user
  bot.sendMessage(
    msg.chat.id,
    `Your unique invite link:\n${inviteLink}\n\nShare it with your friends to invite them to the group:\n${groupLink}`
  );
});

console.log("🤖 Bot is running...");
