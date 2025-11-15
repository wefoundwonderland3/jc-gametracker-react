import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const genre = searchParams.get('genre')
    const platform = searchParams.get('platform')
    const completed = searchParams.get('completed')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (userId) {
      where.userId = userId
    }
    
    if (genre && genre !== 'all') {
      where.genre = genre
    }
    
    if (platform && platform !== 'all') {
      where.platform = platform
    }
    
    if (completed === 'true') {
      where.completed = true
    } else if (completed === 'false') {
      where.completed = false
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const games = await db.game.findMany({
      where,
      include: {
        reviews: {
          select: {
            rating: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(games)
  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      coverImage,
      genre,
      platform,
      releaseDate,
      userId
    } = body

    if (!title || !userId) {
      return NextResponse.json(
        { error: 'Title and userId are required' },
        { status: 400 }
      )
    }

    const game = await db.game.create({
      data: {
        title,
        description,
        coverImage,
        genre,
        platform,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        userId
      },
      include: {
        reviews: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(game, { status: 201 })
  } catch (error) {
    console.error('Error creating game:', error)
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    )
  }
}