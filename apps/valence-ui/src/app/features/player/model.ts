import { Prisma } from '@prisma/client'

const playerWithCharacters = Prisma.validator<Prisma.PlayerArgs>()({
  include: { characters: true },
})

export type PlayerWithCharacters = Prisma.PlayerGetPayload<typeof playerWithCharacters>
