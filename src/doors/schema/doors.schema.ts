import * as mongoose from 'mongoose';

export const DoorSchema = new mongoose.Schema({
    doorNumber: {
        type: Number,
        required: true
    },
    energy: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
    },
    lastActiveDate: {
        type: String
    }
});

export interface Door {
    _id: string,
    doorNumber: number,
    energy: number,
    isActive: boolean,
    lastActiveDate: string
};