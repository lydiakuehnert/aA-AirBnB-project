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



module.exports = router;