'use server'

import { google } from '@ai-sdk/google'
import { embed } from 'ai'
import { prisma } from '@/lib/prisma'

const model = google.textEmbedding('gemini-embedding-001');

// Create a new star and save to DB
export async function createStar(content: string, x: number, y: number, z: number, color: string) {
    try {
        const { embedding } = await embed({
            model,
            value: content,
            providerOptions: {
                google: {
                    outputDimensionality: 3072,
                    taskType: 'SEMANTIC_SIMILARITY',
                },
            },
        })

        const star = await prisma.star.create({
            data: {
                content,
                x,
                y,
                z,
                color,
                embedding: JSON.stringify(embedding),
            }
        })

        return {
            id: star.id,
            content: star.content,
            color: star.color,
            createdAt: star.createdAt.getTime(),
            embedding: embedding,
            position: [star.x, star.y, star.z] as [number, number, number]
        }
    } catch (error) {
        console.error('Error creating star:', error)
        throw error
    }
}

// Fetch all stars
export async function getStars() {
    try {
        const stars = await prisma.star.findMany()
        return stars.map(s => ({
            id: s.id,
            content: s.content,
            color: s.color,
            createdAt: s.createdAt.getTime(),
            embedding: JSON.parse(s.embedding) as number[],
            position: [s.x, s.y, s.z] as [number, number, number]
        }))
    } catch (error) {
        console.error("Failed to fetch stars", error);
        return [];
    }
}

// Search stars by semantic similarity
export async function searchStars(query: string) {
    try {
        // 1. Generate query embedding
        const { embedding: queryEmbedding } = await embed({
            model,
            value: query,
            providerOptions: {
                google: {
                    outputDimensionality: 3072,
                    taskType: 'SEMANTIC_SIMILARITY',
                },
            },
        })

        // 2. Fetch all stars
        const stars = await getStars()

        // 3. Calculate cosine similarity
        const results = stars.map(star => {
            const similarity = cosineSimilarity(queryEmbedding, star.embedding)
            return { star, similarity }
        })
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 5)

        return results
    } catch (error) {
        console.error('Error searching stars:', error)
        return []
    }
}

// Helper: Cosine Similarity
function cosineSimilarity(a: number[], b: number[]) {
    if (a.length !== b.length) return 0;
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
}

// Delete a star from the database
export async function deleteStar(id: string) {
    try {
        await prisma.star.delete({
            where: { id }
        })
        return { success: true }
    } catch (error) {
        console.error('Error deleting star:', error)
        return { success: false, error: 'Failed to delete star' }
    }
}

// Legacy export if needed, or we can just remove it.
// The prompt said "You already have generateEmbedding", implying I can use it.
// But I'm effectively replacing its usage.
export async function generateEmbedding(text: string) {
    const { embedding } = await embed({
        model,
        value: text,
        providerOptions: {
            google: {
                outputDimensionality: 3072,
                taskType: 'SEMANTIC_SIMILARITY',
            },
        },
    })
    return embedding;
}
