import mongoose from "mongoose"


const User = new mongoose.Schema({
    password: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    roles: [{type: String, ref: 'Role', default: "ADMIN"}]
})

export default mongoose.model("User", User);




