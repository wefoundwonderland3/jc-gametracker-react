import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (userId) {
      // Get achievements for a specific user with unlock status
      const userAchievements = await db.userAchievement.findMany({
        where: { userId },
        include: {
          achievement: true
        },
        orderBy: {
          unlockedAt: 'desc'
        }
      })

      // Get all achievements to show locked ones too
      const allAchievements = await db.achievement.findMany({
        orderBy: {
          requirement: 'asc'
        }
      })

      // Merge achievements with unlock status
      const achievementsWithStatus = allAchievements.map(achievement => {
        const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id)
        return {
          ...achievement,
          unlocked: !!userAchievement,
          unlockedAt: userAchievement?.unlockedAt
        }
      })

      return NextResponse.json(achievementsWithStatus)
    } else {
      // Get all achievements (for admin purposes)
      const achievements = await db.achievement.findMany({
        orderBy: {
          requirement: 'asc'
        }
      })

      return NextResponse.json(achievements)
    }
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      icon,
      requirement
    } = body

    if (!name || !description || !icon || !requirement) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const achievement = await db.achievement.create({
      data: {
        name,
        description,
        icon,
        requirement: parseFloat(requirement)
      }
    })

    return NextResponse.json(achievement, { status: 201 })
  } catch (error) {
    console.error('Error creating achievement:', error)
    return NextResponse.json(
      { error: 'Failed to create achievement' },
      { status: 500 }
    )
  }
}