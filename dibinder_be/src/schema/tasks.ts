import { model, Schema } from "mongoose";

const TasksSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        done: {
            type: Boolean,
            required: true,
            default: false,
        },
        list: {
            type: Schema.Types.ObjectId,
            ref: 'list'
        },
        dueDate: {
            type: Date,
        },
        subTask: [
            {
                name: {
                    type: String,
                    required: true
                },
                done: {
                    type: Boolean,
                    required: true,
                    default: false,
                }
            }
        ],
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
    },
    { timestamps: true }
);

const Tasks = model('task', TasksSchema);

export default Tasks;