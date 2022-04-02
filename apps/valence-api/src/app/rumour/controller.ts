import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const list: RequestHandler = async (req, res) => {
  const rumours = await prisma.rumour.findMany({
    include: {
      skill: true,
    },
  });
  res.send(rumours);
};

const create: RequestHandler = async (req, res) => {
  const skill = await prisma.rumour.create({
    data: {
      text: req.body.text,
      threshold: parseInt(req.body.threshold, 10),
      skill: {
        connect: {
          id: parseInt(req.body.skillId, 10),
        },
      },
    },
  });

  res.send(skill);
};

const replace: RequestHandler = async (req, res) => {
  res.status(500).send('Not implemented');
};

const remove: RequestHandler = async (req, res) => {
  await prisma.rumour.delete({
    where: {
      id: parseInt(req.params.rumourId, 10),
    },
  });

  return res.status(204).send();
};

export default {
  list,
  create,
  replace,
  remove,
};
