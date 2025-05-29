import OpenAI from 'openai';
import { APP_CONFIG } from '@/config/envConfig';

export const openai = new OpenAI({
  apiKey: APP_CONFIG.OPENAI.API_KEY,
});
