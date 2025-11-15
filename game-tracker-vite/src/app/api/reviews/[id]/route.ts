import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const review = await db.review.findUnique({
      where: {
        id: params.id
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

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error fetching review:', error)
    return NextResponse.json(
      { error: 'Failed to fetch review' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      title,
      content,
      rating
    } = body

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const review = await db.review.update({
      where: {
        id: params.id
      },
      data: {
        title,
        content,
        rating
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
      where: { gameId: review.gameId }
    })
    
    const averageRating = allReviews.reduce((acc, review) => acc + review.rating, 0) / allReviews.length
    
    await db.game.update({
      where: { id: review.gameId },
      data: { rating: averageRating }
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the review first to update game rating after deletion
    const review = await db.review.findUnique({
      where: { id: params.id }
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    await db.review.delete({
      where: {
        id: params.id
      }
    })

    // Update game's average rating
    const remainingReviews = await db.review.findMany({
      where: { gameId: review.gameId }
    })
    
    if (remainingReviews.length > 0) {
      const averageRating = remainingReviews.reduce((acc, review) => acc + review.rating, 0) / remainingReviews.length
      
      await db.game.update({
        where: { id: review.gameId },
        data: { rating: averageRating }
      })
    } else {
      // If no reviews left, reset rating to 0
      await db.game.update({
        where: { id: review.gameId },
        data: { rating: 0 }
      })
    }

    return NextResponse.json({ message: 'Review deleted successfully' })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    )
  }
}