import { RequestHandler } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const list: RequestHandler = async (req, res) => {
  const skills = await prisma.skill.findMany();
  res.send(skills);
};

const create: RequestHandler = async (req, res) => {

  const skill = await prisma.skill.create({
    data: {
      name: req.body.name,
    }
  });

  res.send(skill);
};

const replace: RequestHandler = async (req, res) => {

  const skill = await prisma.skill.update({
    where: {
      id: parseInt(req.body.id, 10)
    },
    data: {
      name: req.body.name,
    }
  });

  res.send(skill);
};

const remove: RequestHandler = async (req, res) => {

  await prisma.skill.delete({
    where: {
      id: parseInt(req.params.skillId, 10)
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
