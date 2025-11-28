import { Response } from "express";

export const checkValueIsNotEmpty = (res: Response, data: string[] | number[]) => {
    const missingData = data?.filter((dat) => !dat);

    if (missingData?.length > 0) {
        return res.status(400).json({
            error: true,
            message: `Data cannot be empty!`
        });
    }
}