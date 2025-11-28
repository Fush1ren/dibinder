import { Router } from "express";
import passport from "passport";
import { Task, UserRequest } from "../types";
import Tasks from "../schema/tasks";
import { checkValueIsNotEmpty } from "../utils/data";

const taskRouter = Router();

taskRouter.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = req?.user as UserRequest;

        const task = await Tasks.find({
            user: user?.id,
        }).lean();

        res.status(200).json({
            data: task,
        });
    } catch (e) {
        console.error(e)
        res.status(500).json({
            error: true,
            message: (e as Error)?.message || "Failed to get task" 
        });
    }
});

taskRouter.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = req?.user as UserRequest;

        const body = req?.body as Task;

        checkValueIsNotEmpty(res, [body?.name]);

        const dataTask = await Tasks.create({
            name: body?.name,
            description: body?.description || null,
            done: body?.done || false,
            list: body?.list || null,
            startDate: body?.startDate || null,
            dueDate: body?.dueDate || null,
            subTask: body?.subTask || null,
            user: user?.id,
        });

        res.status(201).json({
            message: `Successfuly Create ${body?.name} task!`,
            data: dataTask,
        });
    } catch (e) {
        res.status(500).json({ 
            error: true,
            message: (e as Error)?.message || "Failed to create task!" 
        });
    }
});

taskRouter.patch('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const taskId = (req?.params as {id: string})?.id as string
        const user = req?.user as UserRequest;
        const body = req?.body as Task;
        checkValueIsNotEmpty(res, [taskId, body?.name]);

        const updatedTask = await Tasks.findOneAndUpdate(
            {
                _id: taskId,
                user: user?.id,
            },
            {
                $set: {
                    name: body?.name,
                    description: body?.description,
                    done: body?.done,
                    list: body?.list,
                    startDate: body?.startDate,
                    subTask: body?.subTask,
                }
            },
            {
                new: true,
                runValidatorsL: true,
            }
        ).lean();

        if (!updatedTask) {
             return res
                .status(404)
                .json({ 
                    error: true,
                    message: "Task not found or you don't have permission" 
                });
        }

        res.status(200).json(updatedTask);
    } catch (e) {
        res.status(500).json({ 
            error: true,
            message: (e as Error)?.message || "Failed to update task" 
        });
    }
});

export default taskRouter;