import { Router } from "express";
import passport from "passport";
import { GetTaskQueryParams, Task, UserRequest } from "../types";
import Tasks from "../schema/tasks";
import { checkValueIsNotEmpty } from "../utils/data";
import { SortOrder } from "mongoose";
import List from "../schema/lists";

const taskRouter = Router();

const setDoneTask = (doneTask: boolean, doneSubTask: boolean | null): boolean | null => {
    let done = null;

    if (doneSubTask) {
        done = doneSubTask;
    } else {
        done = doneTask;
    }

    return done;
}

const setDoneSubTask = (doneTask: boolean, subTask: { done: boolean; name: string}[]): { done: boolean; name: string}[] | null => {
    let data = null;

    if (doneTask) {
        data = subTask?.map((d) => ({
            done: true,
            name: d?.name
        }))
    } else {
        data = subTask
    }

    return data;
}

taskRouter.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = req?.user as UserRequest;
        const query = req?.query as GetTaskQueryParams;

        const startDateParams = query?.startDate  ? JSON.parse(query?.startDate as any) : null;
        
        let filter = {
            user: user?.id,
        } as {
            user: string,
            startDate: any;
        }
        
        if (startDateParams?.length === 2) {
            filter.startDate = {
                $gte: new Date(startDateParams[0]),
                $lte: new Date(startDateParams[1]),
            }
        }
        const sortBy = query.sort ? { createdAt: query.sort === "asc" ? 1 : -1 } : {};

        // const task = await Tasks.find(filter).lean();
        const task = await Tasks.find(filter).sort(sortBy as Record<string, SortOrder> | undefined).lean();
        const data = await Promise.all(
            task.map(async (d) => {

                const list = await List.find({
                    _id: d?.list
                });

                return {
                    ...d,
                    list: list?.length > 0 ? {
                        _id: list[0]?._id,
                        name: list[0]?.name,
                        color: list[0]?.color
                    } : null,
                }
            })
        )
        // const task = await Tasks.find({
        //     user: user?.id,
        // }).lean();

        res.status(200).json({
            data: data,
        });
    } catch (e) {
        console.error(e)
        res.status(500).json({
            error: true,
            message: (e as Error)?.message || "Failed to get task" 
        });
    }
});

taskRouter.get('/length', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = req?.user as UserRequest;

        const task = await Tasks.find({
            user: user?.id,
        }).lean();

        const today = new Date().toISOString().split("T")[0];

        const todayTask = task?.filter((t) => {
            const item = t?.startDate ? new Date(t?.startDate).toISOString().split('T')[0] : null;

            return item === today;
        });

        res.status(200).json({
            data: {
                today: todayTask?.length,
                all: task?.length,
            },
        });
    } catch (e) {
        console.error(e)
        res.status(500).json({
            error: true,
            message: (e as Error)?.message || "Failed to get task" 
        });
    }
})

taskRouter.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = req?.user as UserRequest;

        const body = req?.body as Task;

        checkValueIsNotEmpty(res, [body?.name]);

        const isAllSubtaskDone = body?.subTask ? body?.subTask?.every(i => i.done === true) : null;

        const dataTask = await Tasks.create({
            name: body?.name,
            description: body?.description || null,
            ddone: setDoneTask(body?.done, isAllSubtaskDone),
            list: body?.list || null,
            startDate: body?.startDate ? new Date(body?.startDate) : null,
            dueDate: body?.dueDate ? new Date(body?.dueDate) : null,
            subTask: body?.subTask?.length > 0 ? setDoneSubTask(body?.done, body?.subTask) : null,
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

taskRouter.patch('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const taskId = (req?.params as {id: string})?.id as string
        const user = req?.user as UserRequest;
        const body = req?.body as Task;
        checkValueIsNotEmpty(res, [taskId, body?.name]);

        const isAllSubtaskDone = body?.subTask ? body?.subTask?.every(i => i.done === true) : null;

        const updatedTask = await Tasks.findOneAndUpdate(
            {
                _id: taskId,
                user: user?.id,
            },
            {
                $set: {
                    name: body?.name,
                    description: body?.description,
                    done: setDoneTask(body?.done, isAllSubtaskDone),
                    list: body?.list,
                    startDate: body?.startDate ? new Date(body?.startDate) : null,
                    dueDate: body?.dueDate ? new Date(body?.dueDate) : null,
                    subTask: body?.subTask?.length > 0 ? setDoneSubTask(body?.done, body?.subTask) : null,
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

taskRouter.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const taskId = (req?.params as {id: string})?.id as string
        const user = req?.user as UserRequest;
        checkValueIsNotEmpty(res, [taskId]);

        const deleteTask = await Tasks.findOneAndDelete({
            _id: taskId,
            user: user?.id,
        }).lean();

        if (!deleteTask) {
            return res
                .status(404)
                .json({ 
                    error: true,
                    message: "Task not found" 
            });
        }

        res.status(200).json({ message: "Deleted successfully" });
    } catch (e) {
        res.status(500).json({ 
            error: true,
            message: (e as Error)?.message || "Failed to delete task" 
        });
    }
})

export default taskRouter;