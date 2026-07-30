import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
  ticketNo: string;
  userType: 'CUSTOMER' | 'PROFESSIONAL';
  userName: string;
  userPhone: string;
  subject: string;
  issueType: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  assignedAgent: string;
  createdAt: Date;
}

const TicketSchema: Schema = new Schema({
  ticketNo: { type: String, required: true, unique: true },
  userType: { type: String, enum: ['CUSTOMER', 'PROFESSIONAL'], required: true },
  userName: { type: String, required: true },
  userPhone: { type: String, required: true },
  subject: { type: String, required: true },
  issueType: { type: String, default: 'General Inquiry' },
  priority: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], default: 'MEDIUM' },
  status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'], default: 'OPEN' },
  assignedAgent: { type: String, default: 'Support Lead' },
  createdAt: { type: Date, default: Date.now },
});

export const Ticket = mongoose.model<ITicket>('Ticket', TicketSchema);
