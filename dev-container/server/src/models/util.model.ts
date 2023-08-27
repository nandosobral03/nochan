import mongoose from 'mongoose';

export const utilSchema = new mongoose.Schema({
    currentId: { type: Number, default: 0 },
});

export const Util = mongoose.model('Util', utilSchema);