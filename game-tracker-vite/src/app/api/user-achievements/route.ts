import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const userAchievements = await db.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true
      },
      orderBy: {
        unlockedAt: 'desc'
      }
    })

    return NextResponse.json(userAchievements)
  } catch (error) {
    console.error('Error fetching user achievements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user achievements' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      achievementId
    } = body

    if (!userId || !achievementId) {
      return NextResponse.json(
        { error: 'userId and achievementId are required' },
        { status: 400 }
      )
    }

    // Check if already unlocked
    const existing = await db.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Achievement already unlocked' },
        { status: 400 }
      )
    }

    const userAchievement = await db.userAchievement.create({
      data: {
        userId,
        achievementId
      },
      include: {
        achievement: true
      }
    })

    return NextResponse.json(userAchievement, { status: 201 })
  } catch (error) {
    console.error('Error unlocking achievement:', error)
    return NextResponse.json(
      { error: 'Failed to unlock achievement' },
      { status: 500 }
    )
  }
}

// Function to check and unlock achievements based on user stats
export async function checkAchievements(userId: string) {
  try {
    // Get user's current stats
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        games: true,
        reviews: true,
        achievements: {
          include: {
            achievement: true
          }
        }
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    const totalHours = user.games.reduce((acc, game) => acc + game.hoursPlayed, 0)
    const completedGames = user.games.filter(game => game.completed).length
    const totalGames = user.games.length
    const totalReviews = user.reviews.length
    const unlockedAchievementIds = user.achievements.map(ua => ua.achievementId)

    // Get all achievements
    const allAchievements = await db.achievement.findMany()

    // Check each achievement
    for (const achievement of allAchievements) {
      if (unlockedAchievementIds.includes(achievement.id)) {
        continue // Already unlocked
      }

      let shouldUnlock = false

      // Check achievement conditions based on requirements
      if (achievement.name.includes('Novato')) {
        shouldUnlock = totalGames >= 1
      } else if (achievement.name.includes('Maratón')) {
        shouldUnlock = totalHours >= achievement.requirement
      } else if (achievement.name.includes('Coleccionista')) {
        shouldUnlock = totalGames >= achievement.requirement
      } else if (achievement.name.includes('Crítico')) {
        shouldUnlock = totalReviews >= achievement.requirement
      } else if (achievement.name.includes('Explorador')) {
        const uniqueGenres = new Set(user.games.map(game => game.genre).filter(Boolean))
        shouldUnlock = uniqueGenres.size >= achievement.requirement
      } else if (achievement.name.includes('Leyenda')) {
        shouldUnlock = totalHours >= achievement.requirement
      }

      if (shouldUnlock) {
        await db.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id
          }
        })
      }
    }

    return true
  } catch (error) {
    console.error('Error checking achievements:', error)
    return false
  }
}