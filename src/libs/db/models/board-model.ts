'use server';
import mongoose, { Schema } from "mongoose";
import { boardType } from "src/types/board";

const BoardSchema = new Schema<boardType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    backgroundColor: {
      type: String,
      required: true,
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'private',
      required: true,
    },
    lists: [{
      type: Schema.Types.ObjectId,
      ref: 'List',
    }]
  },
  { timestamps: true }
);

const Board = mongoose.models?.Board || mongoose.model<boardType>("Board", BoardSchema);

export default Board;
