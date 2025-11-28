import { Router } from "express";
import passport from "passport";
import { UserRequest } from "../types";
import List from "../schema/lists";
import { checkValueIsNotEmpty } from "../utils/data";
import Tasks from "../schema/tasks";

const listRouter = Router();

listRouter.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = req?.user as UserRequest;

        
        const lists = await List.find({
            user: user?.id
        }).lean();
        
        const data = await Promise.all(
            lists.map(async (d) => {
                const task = await Tasks.find({
                    user: user?.id,
                    list: d._id,
                })
                .sort('createdAt')
                .lean();

                return {
                    ...d,
                    task,
                };
            })
        );


        res.status(200).json({
            data: data
        });
    } catch (e) {
        console.error(e)
        res.status(500).json({
            error: true,
            message: (e as Error)?.message || "Failed to get list" 
        });
    }
});

listRouter.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = req?.user as UserRequest;
        const body = req?.body as { name: string, color: string };
        checkValueIsNotEmpty(res, [body.name]);

        const newList = await List.create({
            name: body?.name,
            color: body?.color?.toLowerCase() || null,
            user: user?.id,
        });

        res.status(201).json({
            message: `Successfuly Create ${body?.name} list!`,
            data: newList,
        });
    } catch (e) {
        res.status(500).json({ 
            error: true,
            message: (e as Error)?.message || "Failed to create list!" 
        });
    }
});

listRouter.patch('/:id',  passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const listId = (req?.params as {id: string})?.id as string
        const user = req?.user as UserRequest;
        const body = req?.body as { name: string, color: string };
        checkValueIsNotEmpty(res, [listId, body?.name])

        const updatedList = await List.findOneAndUpdate(
            {
                _id: listId,
                user: user?.id,
            },
            {
                $set: {
                    name: body?.name,
                    color: body?.color ? body?.color?.toLowerCase() : null,
                    user: user?.id
                },
            },
            {
                new: true,
                runValidators: true,
            }
        ).lean();

        if (!updatedList) {
            return res
                .status(404)
                .json({ 
                    error: true,
                    message: "List not found or you don't have permission" 
                });
        }

        res.status(200).json({
            message: 'Success to update list',
            data: updatedList,
        });
    } catch (e) {
        res.status(500).json({ 
            error: true,
            message: (e as Error)?.message || "Failed to update list" 
        });
    }
});

export default listRouter;