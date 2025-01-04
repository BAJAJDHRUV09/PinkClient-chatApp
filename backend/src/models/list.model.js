import mongoose from "mongoose";    

const contactListSchema = new mongoose.Schema(
    {
        userId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"User",
                    required:true,
                    unique:true,
                },
        contacts:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }],
    }
);

const List = mongoose.model("List",contactListSchema);

export default List;