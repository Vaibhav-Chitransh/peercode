import { Schema, models, model, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  bio?: string;
  picture: string;
  location?: string;
  portfolioWebsite?: string;
  leetcodeId?: string;
  codeforcesId?: string;
  githubId?: string;
  reputation?: number;
  saved: Schema.Types.ObjectId[];
  joinedAt: Date;
  leetcodeVerified?: boolean;
  codeforcesVerified?: boolean;
  githubVerified?: boolean;
};

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  bio: { type: String },
  picture: { type: String, required: true },
  location: { type: String },
  portfolioWebsite: { type: String },
  leetcodeId: { type: String },
  codeforcesId: { type: String },
  githubId: { type: String },
  reputation: { type: Number, default: 0 },
  saved: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  joinedAt: { type: Date, default: Date.now },
  leetcodeVerified: { type: Boolean, default: false },
  codeforcesVerified: { type: Boolean, default: false },
  githubVerified: { type: Boolean, default: false },
});

const User = models.User || model<IUser>("User", UserSchema);
export default User;
