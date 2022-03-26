import { Prisma } from '@prisma/client'

const characterWithPlayer = Prisma.validator<Prisma.CharacterArgs>()({
  include: { player: true },
})

export type CharacterWithPlayer = Prisma.CharacterGetPayload<typeof characterWithPlayer>
