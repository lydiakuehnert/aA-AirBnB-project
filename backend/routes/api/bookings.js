const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, Review, ReviewImage, User, SpotImage, Booking } = require('../../db/models');


router.get('/current', requireAuth, async (req, res) => {

    const bookings = await Booking.findAll({
        where: {
            userId: req.user.id
        },
        include: [
            {
                model: Spot,
                include: { model: SpotImage },
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
            }
        ]
    });

    const bookingList = []
    bookings.forEach(booking => {
        bookingList.push(booking.toJSON())
    })
    bookingList.forEach(booking => {
        booking.Spot.SpotImages.forEach(img => {
            if (img.preview === true) booking.Spot.previewImage = img.url
            else booking.Spot.previewImage = 'no preview image found'
        })
        if (!booking.Spot.SpotImages.length) booking.Spot.previewImage = 'no preview image found'
        delete booking.Spot.SpotImages
    })

    res.status(200).json({Bookings: bookingList})
})


router.put('/:bookingId', requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;
    const booking = await Booking.findByPk(bookingId)
    if (!booking) {
        return res.status(404).json({ message: "Booking couldn't be found" })
    }

    const bookingJson = booking.toJSON();
    if (bookingJson.userId !== userId) {
        const err = new Error("Booking must belong to the current user");
        return next(err)
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    const startTime = start.getTime()
    const endTime = end.getTime()
    const now = new Date()
    const nowTime = now.getTime()

    if (endTime <= startTime) {
        const err = new Error("Bad Request")
        err.errors = { endDate: "endDate cannot come before startDate" }
        err.status = 400;
        return next(err)
    }

    if (nowTime >= startTime || nowTime >= endTime) {
        const err = new Error("Past bookings can't be modified");
        err.status = 403;
        return next(err)
    }


    const spot = await Spot.findByPk(bookingJson.spotId, {
        include: [
            { model: Booking }
        ]
    })
    const spotJson = spot.toJSON();
    spotJson.Bookings.forEach(booking => {
        const startB = booking.startDate.getTime()
        const endB = booking.endDate.getTime();
        if ((startTime === startB && endTime === endB) ||
            (startTime >= startB && startTime <= endB) ||
            (endTime >= startB && endTime <= endB)) {
            const err = new Error("Sorry, this spot is already booked for the specified dates");
            err.errors = { startDate: "Start date conflicts with an existing booking", endDate: "End date conflicts with an existing booking" };
            err.status = 403;
            return next(err)
        }
    })


    booking.startDate = startDate;
    booking.endDate = endDate;

    await booking.save()

    res.status(200).json(booking)
})



module.exports = router;