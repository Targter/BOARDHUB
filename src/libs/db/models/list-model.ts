'use server';
import mongoose, { Schema } from "mongoose";
import { listType } from "src/types/list";

const ListSchema = new Schema<listType>(
  {
    title: {
      type: String,
      required: true,
    },
    boardId: {
      type: String,
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    cards: [{
      type: Schema.Types.ObjectId,
      ref: 'Card',
      required: true,
    }]
  },
  { timestamps: true }
);

const List = mongoose.models?.List || mongoose.model<listType>("List", ListSchema);

export default List; 