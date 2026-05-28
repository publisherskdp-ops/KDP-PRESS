import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  luluJobId: string;
  externalId: string;
  books: Array<{
    bookId: string;
    id: string;
    title: string;
    format: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  shippingAmount: number;
  shippingCharged: boolean;
  grossAmount: number;
  grossAmountCharged: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    luluJobId: { type: String, required: true, index: true },
    externalId: { type: String, required: true, unique: true },
    books: [
      {
        bookId: { type: String, required: true },
        id: String,
        title: String,
        format: String,
        quantity: Number,
        price: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingAmount: { type: Number, required: true },
    shippingCharged: { type: Boolean, required: true, default: true },
    grossAmount: { type: Number, required: true },
    grossAmountCharged: { type: Number, required: true },
    status: { type: String, default: 'PENDING', index: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
