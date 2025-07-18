'use server';
import mongoose, { Schema } from "mongoose";
import { cardType } from "src/types/card";

const CardSchema = new Schema<cardType>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    isCompleted: {
      type: Boolean,
      default: false,
      required: true,
    },
    list: {
      type: Schema.Types.ObjectId,
      ref: 'List',
      required: true,
    },
    position: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

const Card = mongoose.models?.Card || mongoose.model<cardType>("Card", CardSchema);

export default Card; 