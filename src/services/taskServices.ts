import Task from "../models/Task";

export const getTasksService = async (userId: string) => {
  return await Task.find({ user: userId });
};

export const createTaskService = async (userId: string, taskData: any) => {
  return await new Task({ ...taskData, user: userId }).save();
};
export const addSubtaskService = async (
  parentTaskId: string,
  subtaskData: any
) => {
  const subtask = new Task(subtaskData);
  await subtask.save();

  await Task.findByIdAndUpdate(parentTaskId, {
    $push: { subtasks: subtask._id },
  });

  return subtask;
};

export const updateTaskService = async (taskId: string, completed: boolean) => {
  return await Task.findByIdAndUpdate(
    taskId,
    { completed: completed },
    { new: true }
  );
};

export const deleteTaskService = async (taskId: string) => {
  return await Task.findByIdAndDelete(taskId);
};
