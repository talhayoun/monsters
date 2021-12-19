const mongoose = require("mongoose");
const DoorM = require("../doors/schema/doors.schema");
const Mongo = 'mongodb+srv://talHayoun:123456123456@cluster0.eet0k.mongodb.net/Monsters?retryWrites=true&w=majority'
const Rooms =
    [
        new DoorM({
            doorNumber: 300,
            energy: 10,
            isActive: true,
        }),
        new DoorM({
            doorNumber: 310,
            energy: 25,
            isActive: true,
        }),
        new DoorM({
            doorNumber: 320,
            energy: 50,
            isActive: true,
        }),
        new DoorM({
            doorNumber: 450,
            energy: 5,
            isActive: true,
        })
    ]

mongoose.connect(Mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ignoreUndefined: true
});

let roomsIds = [];

Rooms.map(async (room, index) => {
    roomsIds.push(room._id);
    await room.save((err, result) => {
        console.log(err, result)
        if (room === Rooms.length - 1) {
            console.log("Done seeding heroes");
        }
    })
})

module.exports = Rooms;