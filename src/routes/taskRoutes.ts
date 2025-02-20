import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  addSubtask,
} from "../controllers/taskController";
import auth from "../middlewares/auth";

const router = Router();

router.get("/", auth, getTasks);
router.post("/", auth, createTask);
router.post("/:id/subtask", addSubtask);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);

export default router;
