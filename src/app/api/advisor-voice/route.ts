import { NextRequest, NextResponse } from 'next/server'

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY

// ElevenLabs default/premade voice IDs by gender
// These are available on all tiers including free
const VOICE_BY_GENDER: Record<string, string> = {
  'female': '21m00Tcm4TlvDq8ikWAM',  // Rachel - warm female
  'male': 'ErXwobaYiN019PkySvjV',     // Antoni - confident male
}

// Fallback by advisor ID if voiceGender not provided
const VOICE_FALLBACK: Record<string, string> = {
  'target-customer': '21m00Tcm4TlvDq8ikWAM',   // Rachel
  'skeptical-vc': 'ErXwobaYiN019PkySvjV',       // Antoni
  'competitor-customer': 'ErXwobaYiN019PkySvjV', // Antoni
}

export async function POST(request: NextRequest) {
  try {
    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { text, advisorId, voiceGender } = body as { text: string; advisorId: string; voiceGender?: string }

    if (!text || !advisorId) {
      return NextResponse.json(
        { error: 'text and advisorId are required' },
        { status: 400 }
      )
    }

    // Use gender-based voice if provided, otherwise fallback to ID mapping
    const voiceId = (voiceGender && VOICE_BY_GENDER[voiceGender]) || VOICE_FALLBACK[advisorId] || VOICE_BY_GENDER['male']
    if (!voiceId) {
      return NextResponse.json(
        { error: 'No voice configured for this advisor' },
        { status: 404 }
      )
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      }
    )

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'unknown')
      console.error('[advisor-voice] ElevenLabs error:', response.status, errorBody)
      return NextResponse.json(
        { error: 'Voice synthesis failed' },
        { status: 500 }
      )
    }

    // Stream the audio response
    const audioBuffer = await response.arrayBuffer()
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString()
      }
    })
  } catch (error) {
    console.error('[advisor-voice] Error:', error)
    return NextResponse.json(
      { error: 'Voice synthesis failed' },
      { status: 500 }
    )
  }
}
