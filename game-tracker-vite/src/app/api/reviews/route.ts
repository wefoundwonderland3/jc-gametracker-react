import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get('gameId')
    const userId = searchParams.get('userId')

    const where: any = {}
    
    if (gameId) {
      where.gameId = gameId
    }
    
    if (userId) {
      where.userId = userId
    }

    const reviews = await db.review.findMany({
      where,
      include: {
        game: {
          select: {
            id: true,
            title: true,
            coverImage: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      content,
      rating,
      gameId,
      userId
    } = body

    if (!title || !content || !rating || !gameId || !userId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const review = await db.review.create({
      data: {
        title,
        content,
        rating,
        gameId,
        userId
      },
      include: {
        game: {
          select: {
            id: true,
            title: true,
            coverImage: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    // Update game's average rating
    const allReviews = await db.review.findMany({
      where: { gameId }
    })
    
    const averageRating = allReviews.reduce((acc, review) => acc + review.rating, 0) / allReviews.length
    
    await db.game.update({
      where: { id: gameId },
      data: { rating: averageRating }
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}