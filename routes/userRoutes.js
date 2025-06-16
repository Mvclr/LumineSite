import express from "express";
import path from "path";
import bcrypt from "bcrypt";
import User from "../classes/User.js";
import connection from "../db/db_server.js";
import { fileURLToPath } from "url";
import { verifyJWTMiddleware } from "../controllers/jwtController.js";
import isLoggedIn from "../controllers/IsLoggedIn.js";


const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


router.use(express.static(path.join(__dirname, "../public")));

router.post('/delete/user', verifyJWTMiddleware, (req, res) => {
  const username = req.cookies.username;
  connection.query(
    "SELECT id FROM users WHERE username = ?", [username],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao buscar usuário." });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      const userId = results[0].id;
      connection.query(
        "DELETE FROM favorites WHERE user_id = ?", [userId],
        (err1) => {
          if (err1) {
            return res.status(500).json({ error: "Erro ao deletar favoritos do usuário." });
          }

          connection.query(
            "DELETE FROM users WHERE id = ?", [userId],
            (err2) => {
              if (err2) {
                return res.status(500).json({ error: "Erro ao deletar usuário." });
              }
              res.status(200).json({ message: "Usuário e favoritos deletados com sucesso." });
            }
          );
        }
      );
    }
  );
});

export default router;
