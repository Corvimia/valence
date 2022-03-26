import { RequestHandler } from "express";
import Character from "./model";
import db from "../../db";

const list: RequestHandler = async (req, res) => {
  const characters = await db.all<Character[]>(`SELECT id, name, playerId FROM Characters`, []);
  res.send(characters);
};

const create: RequestHandler = async (req, res) => {
  await db.run(`INSERT INTO Characters (name, playerId) VALUES (?, ?);`, [req.body.name, req.body.playerId]);
  const characters = await db.all<Character[]>(`SELECT id, name, playerId FROM Characters WHERE id = last_insert_rowid()`, []);
  res.send(characters[0]);
};

const replace: RequestHandler = async (req, res) => {
  await db.run(`UPDATE Characters SET name = ? WHERE id = ?`, [req.body.name, req.body.id]);
  const characters = await db.all<Character[]>(`SELECT id, name, playerId FROM Characters WHERE id = ?`, [req.body.id]);
  res.send(characters[0]);
};

const remove: RequestHandler = async (req, res) => {

  await db.run(`DELETE FROM Characters WHERE Id = ?`, [req.params.characterId]);

  return res.status(204).send();
};

export default {
  list,
  create,
  replace,
  remove
};
