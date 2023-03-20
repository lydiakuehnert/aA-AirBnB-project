const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, Review, SpotImage } = require('../../db/models');


router.get('/', async (req, res) => {

    const spots = await Spot.findAll({
        include: [
            { model: SpotImage },
            { model : Review }
        ]
    });

    const spotsList = []
    spots.forEach(spot => {
        spotsList.push(spot.toJSON())
    })
    spotsList.forEach(spot => {
        spot.SpotImages.forEach(img => {
            if (img.preview === true) spot.previewImage = img.url
            else spot.previewImage = 'no preview image found'
        })
        if (!spot.SpotImages.length) spot.previewImage = 'no preview image found'
        delete spot.SpotImages
        
        let count = 0;
        let sum = 0;
        spot.Reviews.forEach(review => {
            count++;
            sum += review.stars;
        })
        let avg = sum / count;
        spot.avgRating = avg;
        if (!spot.Reviews.length) spot.avgRating = 'no average rating'
        delete spot.Reviews
    })
    
    res.status(200).json({Spots: spotsList})
})


router.get('/current', requireAuth, async (req, res) => {

    const spots = await Spot.findAll({
        where: {
            ownerId: req.user.id
        },
        include: [
            { model: SpotImage },
            { model: Review }
        ]
    });

    const spotsList = []
    spots.forEach(spot => {
        spotsList.push(spot.toJSON())
    })
    spotsList.forEach(spot => {
        spot.SpotImages.forEach(img => {
            if (img.preview === true) spot.previewImage = img.url
            else spot.previewImage = 'no preview image found'
        })
        if (!spot.SpotImages.length) spot.previewImage = 'no preview image found'
        delete spot.SpotImages

        let count = 0;
        let sum = 0;
        spot.Reviews.forEach(review => {
            count++;
            sum += review.stars;
        })
        let avg = sum / count;
        spot.avgRating = avg;
        if (!spot.Reviews.length) spot.avgRating = 'no average rating'
        delete spot.Reviews
    })

    res.status(200).json({ Spots: spotsList })
})

router.post('/', requireAuth, async (req, res, next) => {
    const {address, city, state, country, lat, lng, name, description, price} = req.body

    if (!address) {
        const err = new Error('Street address is required')
        err.status = 400;
        return next(err)
    }

    const spot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })
    res.status(201).json(spot)
})


module.exports = router;