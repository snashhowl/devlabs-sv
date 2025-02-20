import { Request, Response, NextFunction } from "express";
import {
  getTasksService,
  createTaskService,
  updateTaskService,
  deleteTaskService,
  addSubtaskService,
} from "../services/taskServices";

interface IGetUserAuthInfoRequest extends Request {
  user: { id: string };
}

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userReq = req as IGetUserAuthInfoRequest;
    const tasks = await getTasksService(userReq.user.id);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userReq = req as IGetUserAuthInfoRequest;
    const newTask = await createTaskService(userReq.user.id, req.body);
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

export const addSubtask = async (req: Request, res: Response) => {
  try {
    const parentTaskId = req.params.id;
    const subtaskData = req.body;

    const subtask = await addSubtaskService(parentTaskId, subtaskData);

    res.status(201).json(subtask);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const updatedTask = await updateTaskService(id, completed);
    if (!updatedTask) {
      res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    next(error);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteTaskService(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};
