/* eslint-disable @typescript-eslint/no-unused-vars */
// "user server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag from "@/database/tag.model";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
    try {
        connectToDatabase();

        const { userId } = params;

        const user = await User.findById(userId);

        if(!user) throw new Error("User not found");

        // find interactions for the user and group by tags...
        // Interaction...

        // Replace with actual logic to get top tags
        return [{_id: "1", name: "JavaScript" }, { _id: "2", name: "React" }, { _id: "3", name: "Node.js" }]; 
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getAllTags(params: GetAllTagsParams) {
    try {
        connectToDatabase();

        const tags = await Tag.find({});
        return {tags};
    } catch (error) {
        console.log(error);
        throw error;
    }
}