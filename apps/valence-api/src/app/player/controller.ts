import { RequestHandler } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const list: RequestHandler = async (req, res) => {
  const players = await prisma.player.findMany({
    include: {
      characters: true
    }
  })
  res.send(players);
};

const create: RequestHandler = async (req, res) => {

  const player = await prisma.player.create({
    data: {
      name: req.body.name,
    }
  });

  res.send(player);
};

const replace: RequestHandler = async (req, res) => {

  const player = await prisma.player.update({
    where: {
      id: parseInt(req.body.id, 10)
    },
    data: {
      name: req.body.name,
    }
  });

  res.send(player);
};

const remove: RequestHandler = async (req, res) => {

  await prisma.player.delete({
    where: {
      id: parseInt(req.params.playerId, 10)
    },
  });

  return res.status(204).send();
};

export default {
  list,
  create,
  replace,
  remove
};
