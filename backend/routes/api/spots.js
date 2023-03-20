const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, Review, SpotImage } = require('../../db/models');

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .withMessage('Longitude is not valid'),
    check('name')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleValidationErrors
];

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


router.post('/', requireAuth, validateSpot, async (req, res, next) => {
    const {address, city, state, country, lat, lng, name, description, price} = req.body

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