import { MongoClient, Db, ObjectId } from 'mongodb'
import type { SimulationData } from '@/types/simulation'
import type { ResearchContext } from '@/types/research'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not set in environment variables')
}

// Cached connection for serverless (Next.js API routes)
let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

async function getDb(): Promise<Db> {
  if (cachedDb) return cachedDb

  const client = new MongoClient(MONGODB_URI!)
  await client.connect()
  cachedClient = client
  cachedDb = client.db('shipit')
  return cachedDb
}

// Report document stored in MongoDB
export interface ReportDocument {
  _id?: ObjectId
  prompt: string
  research: ResearchContext
  simulation: SimulationData
  versions: {
    timestamp: Date
    edit: string
    affectedSections: string[]
  }[]
  createdAt: Date
  updatedAt: Date
}

/**
 * Save a new report to MongoDB
 */
export async function saveReport(
  prompt: string,
  research: ResearchContext,
  simulation: SimulationData
): Promise<string> {
  const db = await getDb()
  const result = await db.collection<ReportDocument>('reports').insertOne({
    prompt,
    research,
    simulation,
    versions: [],
    createdAt: new Date(),
    updatedAt: new Date()
  })
  return result.insertedId.toString()
}

/**
 * Load a report by ID
 */
export async function loadReport(id: string): Promise<ReportDocument | null> {
  const db = await getDb()
  return db.collection<ReportDocument>('reports').findOne({ _id: new ObjectId(id) })
}

/**
 * Update a report's simulation data (after an edit)
 */
export async function updateReport(
  id: string,
  simulation: SimulationData,
  editDescription: string,
  affectedSections: string[]
): Promise<void> {
  const db = await getDb()
  await db.collection<ReportDocument>('reports').updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        simulation,
        updatedAt: new Date()
      },
      $push: {
        versions: {
          timestamp: new Date(),
          edit: editDescription,
          affectedSections
        }
      }
    }
  )
}

/**
 * List recent reports (for "load previous" feature)
 */
export async function listReports(limit: number = 10): Promise<Pick<ReportDocument, '_id' | 'prompt' | 'createdAt'>[]> {
  const db = await getDb()
  return db.collection<ReportDocument>('reports')
    .find({}, { projection: { prompt: 1, createdAt: 1 } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray()
}
