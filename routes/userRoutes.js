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

router.post('/delete/user', verifyJWTMiddleware,(req, res) =>{
    const username = req.cookies.username;
    
    connection.query(
        "SELECT id FROM users WHERE username = ?",
        [username],
        (err, userRows) => {
          if (err) {
            return res.status(500).json({ error: "Erro ao buscar usuário." });
          }
          if (userRows.length === 0) {
            return res.status(404).json({ error: "Usuário não encontrado." });
          }
          const userId = userRows[0].id;
  
          connection.query(
            "DELETE FROM users WHERE id = ?", [userId],
            (err2) => {
              if (err2) {
                return res.status(500).json({ error: "Erro ao deletar usuário." });
              }
              res.status(200).json({ message: "Usuário deletado com sucesso." });

            }
          );
        }
      );
})

export default router;
