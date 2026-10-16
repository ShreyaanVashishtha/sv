import fs from 'fs';
import path from 'path';
import { redis } from '@/lib/redis';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const PRIMARY_MESSAGES_FILE = path.join(process.cwd(), 'data', 'messages.json');
const TMP_MESSAGES_FILE = path.join('/tmp', 'sv7_messages.json');
const REDIS_MESSAGES_KEY = 'sv7_contact_messages';

declare global {
  var __sv7_messages_cache: ContactMessage[] | undefined;
}

export async function getMessages(): Promise<ContactMessage[]> {
  try {
    if (globalThis.__sv7_messages_cache) {
      return globalThis.__sv7_messages_cache;
    }

    if (redis) {
      try {
        const remote = await redis.get<ContactMessage[]>(REDIS_MESSAGES_KEY);
        if (Array.isArray(remote)) {
          globalThis.__sv7_messages_cache = remote;
          return remote;
        }
      } catch (err) {
        console.warn('Failed to read messages from Redis:', err);
      }
    }

    let raw = '';
    if (fs.existsSync(TMP_MESSAGES_FILE)) {
      try {
        raw = fs.readFileSync(TMP_MESSAGES_FILE, 'utf-8');
      } catch (e) {}
    }

    if (!raw && fs.existsSync(PRIMARY_MESSAGES_FILE)) {
      raw = fs.readFileSync(PRIMARY_MESSAGES_FILE, 'utf-8');
    }

    const messages = JSON.parse(raw || '[]') as ContactMessage[];

    if (redis && messages.length > 0) {
      try {
        await redis.set(REDIS_MESSAGES_KEY, messages);
      } catch (e) {}
    }

    globalThis.__sv7_messages_cache = messages;
    return messages;
  } catch (error) {
    console.error('Error reading messages:', error);
    return [];
  }
}

async function persistMessages(messages: ContactMessage[]) {
  globalThis.__sv7_messages_cache = messages;

  if (redis) {
    try {
      await redis.set(REDIS_MESSAGES_KEY, messages);
    } catch (e) {
      console.error('Failed to write messages to Redis:', e);
    }
  }

  const json = JSON.stringify(messages, null, 2);

  try {
    const dir = path.dirname(PRIMARY_MESSAGES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(PRIMARY_MESSAGES_FILE, json, 'utf-8');
  } catch (e) {}

  try {
    fs.writeFileSync(TMP_MESSAGES_FILE, json, 'utf-8');
  } catch (e) {}
}

export async function saveMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): Promise<ContactMessage> {
  const messages = await getMessages();
  const newMessage: ContactMessage = {
    ...msg,
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    read: false,
  };

  messages.unshift(newMessage);
  await persistMessages(messages);
  return newMessage;
}

export async function deleteMessage(id: string): Promise<boolean> {
  try {
    const messages = (await getMessages()).filter((m) => m.id !== id);
    await persistMessages(messages);
    return true;
  } catch (error) {
    return false;
  }
}

export async function markMessageRead(id: string): Promise<boolean> {
  try {
    const messages = (await getMessages()).map((m) => (m.id === id ? { ...m, read: true } : m));
    await persistMessages(messages);
    return true;
  } catch (error) {
    return false;
  }
}
