import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

export const IntimidatorSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true
        },
        phoneNumber: {
            type: Number
        },
        tentacles: {
            type: Number
        },
        password: {
            type: String,
            required: true,
            trim: true,
            validate(value) {
                let regex = /^.*(?=.{8,})(?=.*[A-Z])(?=.*[!@#$%^&+=]).*$/.test(value)
                if (!regex)
                    throw new Error("Password must contain one uppercase letter, one non alphanumeric char and one digit, minimum 8 charts");
            }
        },
        currentEnergy: {
            type: Number
        },
        requiredEnergy: {
            type: Number
        },
        dailyAccessedDoors: [
            {
                door: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Doors'
                }
            }
        ],
        lastWorkDate: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

IntimidatorSchema.pre("save", async function (next) {
    const intimidator = this;
    if (intimidator.isModified('password')) {
        const hashedPassword = await bcrypt.hash(intimidator.password, 10);
        intimidator.password = hashedPassword;
    }
    next()
})

export interface Intimidator extends mongoose.Document {
    _id: string,
    username: string,
    phoneNumber: number,
    tentacles: number,
    password: string,
    createdAt: string,
    dailyAccessedDoors: any, // What type should be here
    requiredEnergy: number,
    currentEnergy: number,
    lastWorkDate: string
};
