import { RequestHandler } from "express";
import { Query } from "express-serve-static-core";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const list: RequestHandler = async (req, res) => {
  const characters = await prisma.character.findMany({
    include: {
      player: true,
    },
  });
  res.send(characters);
};

function getIncludes(query: Query): Prisma.CharacterInclude {
  const include: Prisma.CharacterInclude = {};
  switch (query.includes) {
    case "true":
      include.player = true;
      include.characterSkills = {
        include: {
          skill: true,
        },
      };
      break;
  }
  return include;
}

const get: RequestHandler = async (req, res) => {
  const include = getIncludes(req.query);

  const character = await prisma.character.findFirst({
    where: {
      id: Number(req.params.characterId),
    },
    include,
  });
  res.send(character);
};

const create: RequestHandler = async (req, res) => {

  const character = await prisma.character.create({
    data: {
      name: req.body.name,
      player: {
        connect: {
          id: req.body.playerId,
        },
      },
    },
  });

  const skills = await prisma.skill.findMany();

  await Promise.all(
    skills.map((skill) => {
      return prisma.characterSkill.create({
        data: {
          level: 0,
          character: {
            connect: {
              id: character.id,
            },
          },
          skill: {
            connect: {
              id: skill.id,
            },
          },
        },
      });
    })
  );

  res.send(character);
};

const replace: RequestHandler = async (req, res) => {

  const character = await prisma.character.update({
    where: {
      id: parseInt(req.body.id, 10),
    },
    data: {
      name: req.body.name,
    },
  });


  res.send(character);
};

const remove: RequestHandler = async (req, res) => {

  await prisma.character.delete({
    where: {
      id: parseInt(req.params.characterId, 10)
    }
  });

  return res.status(204).send();
};

export default {
  list,
  get,
  create,
  replace,
  remove
};
