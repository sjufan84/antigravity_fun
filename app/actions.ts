'use server'

import { google } from '@ai-sdk/google'
import { embed } from 'ai'

export async function generateEmbedding(text: string) {
    try {
        const { embedding } = await embed({
            model: google.textEmbeddingModel('text-embedding-004'),
            value: text,
        })
        return embedding
    } catch (error) {
        console.error('Error generating embedding:', error)
        // Fallback or rethrow depending on desired behavior. 
        // Returning a random small vector to prevent app crash but indicate failure visually could be an option,
        // but let's throw so the UI can handle it or just log it.
        // For now, let's return a zeroed vector or similar if we want to be safe, but rethrowing is better for debugging.
        throw error
    }
}
