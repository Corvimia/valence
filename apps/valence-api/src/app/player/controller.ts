import { RequestHandler } from "express";
import Player from "./model";
import db from "../../db";

const list: RequestHandler = async (req, res) => {
  const players = await db.all<Player[]>(`SELECT id, name FROM Players`, []);
  res.send(players);
};

const create: RequestHandler = async (req, res) => {
  await db.run(`INSERT INTO Players (name) VALUES (?);`, [req.body.name]);
  const players = await db.all<Player[]>(`SELECT id, name FROM Players WHERE id = last_insert_rowid()`, []);
  res.send(players[0]);
};

const replace: RequestHandler = async (req, res) => {
  await db.run(`UPDATE Players SET name = ? WHERE id = ?`, [req.body.name, req.body.id]);
  const players = await db.all<Player[]>(`SELECT id, name FROM Players WHERE id = ?`, [req.body.id]);
  res.send(players[0]);
};

const remove: RequestHandler = async (req, res) => {

  await db.run(`DELETE FROM Players WHERE Id = ?`, [req.params.playerId]);

  return res.status(204).send();
};

export default {
  list,
  create,
  replace,
  remove
};
