"use server";

import OpenAI from "openai";
import { createClient } from "./supabase/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function embedText(content: string, title: string, name: string) {
  try {
    const textToEmbed = `Title: ${title}. Content: ${content}. Author: ${name}`;

    const response = await openai.embeddings.create({
      model: "text-embedding-3-small", // 1536 dimension
      input: textToEmbed,
    });

    return response.data[0].embedding;
  } catch (error: any) {
    console.error("OpenAI Embedding Error:", error);
    throw new Error("Failed to process embedding securely.");
  }
}


export async function searchSimilarPosts(query: string, limit: number = 5) {
  try {
    // 1. Convert the user's plain text query into a vector
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });

    const queryVector = response.data[0].embedding;

    // 2. Call the Supabase RPC function to find similar posts based on the query vector
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("match_posts", {
      query_embedding: queryVector,
      match_threshold: 0.2,
      match_count: limit,
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Search Error:", error);
    throw new Error(`Failed to search for similar posts. ${error}`, );
  }
}