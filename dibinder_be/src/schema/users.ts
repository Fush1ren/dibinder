import { model, Schema, SchemaDefinition } from "mongoose";
import { UserSchema } from "../types";

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        photoUrl: {
            type: String,
        }
    }  as SchemaDefinition<UserSchema>
);

userSchema.index({
    email: 'text'
});

const Users = model('Users', userSchema);

export default Users;