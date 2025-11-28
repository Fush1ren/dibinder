import { model, Schema } from "mongoose";

const ListsSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        color: {
            type: String,
        },
        user: {
            type: Schema.Types.ObjectId,
            required: true,
        }
    },
    { timestamps: true }
)

const List = model('list', ListsSchema);

export default List;