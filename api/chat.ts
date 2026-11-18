// Vercel Serverless Function: POST /api/chat
// Kunci DeepSeek diambil dari Environment Variables Vercel (DEEPSEEK_API_KEY) — bukan dari kode.
import { handleChat } from '../server/chatHandler.js';

export async function POST(request: Request): Promise<Response> {
  return handleChat(request, process.env);
}

export async function OPTIONS(request: Request): Promise<Response> {
  return handleChat(request, process.env);
}
