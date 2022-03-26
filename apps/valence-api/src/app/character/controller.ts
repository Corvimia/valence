import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const list: RequestHandler = async (req, res) => {
  const characters = await prisma.character.findMany({
    include: {
      player: true,
    },
  });
  res.send(characters);
};

const get: RequestHandler = async (req, res) => {
  const character = await prisma.character.findFirst({
    where: {
      id: Number(req.params.characterId),
    },
    include: {
      player: true,
    },
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
