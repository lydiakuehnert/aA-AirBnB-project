import { csrfFetch } from "./csrf";

const GET_REVIEWS = "reviews/getReviews";
const CREATE_REVIEW = "reviews/createReview";
const GET_USER_REVIEWS = "reviews/getUserReviews";
const DELETE_REVIEW = "reviews/deleteReview";



const getUserReviewsAction = (reviews) => {
    return {
        type: GET_USER_REVIEWS,
        reviews
    }
}

const getReviewsAction = (reviews) => {
    return {
        type: GET_REVIEWS,
        reviews
    }
};

const createReviewAction = (review) => {
    return {
        type: CREATE_REVIEW,
        review
    }
}

const deleteReviewAction = (reviewId) => {
    return {
        type: DELETE_REVIEW,
        reviewId
    }
}


export const getReviewsThunk = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if (res.ok) {
        const reviews = await res.json();
        dispatch(getReviewsAction(reviews.Reviews))
    }
};

export const createReviewThunk = ({spotId, payload}) => async dispatch => {
    try {
        const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        
        if (res.ok) {
            const review = await res.json();
            dispatch(createReviewAction(review))
            return review;
        }
    } catch (e) {
        const data = await e.json()
        return data;
    }
}

// export const deleteSpotThunk = (spotId) => async dispatch => {
//     const res = await csrfFetch(`/api/spots/${spotId}`, {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' }
//     })
//     if (res.ok) {
//         dispatch(deleteSpotAction(spotId))
//     }
// }


const initialState = { spot: {}, user: {} };

const reviewReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_REVIEWS: {
            newState = { ...state, spot: {}, user: {} }
            action.reviews.forEach(review => newState.spot[review.id] = review)
            return newState
        }
        case CREATE_REVIEW: {
            newState = { ...state, spot: { ...state.spot }, user: {} }
            newState.spot[action.review.id] = action.review;
            // newState.singleSpot = action.spot;
            return newState
        }
        // case DELETE_SPOT: {
        //     newState = { ...state, allSpots: { ...state.allSpots }, singleSpot: {} }
        //     delete newState.allSpots[action.spotId]
        //     return newState
        // }
        default:
            return state;
    }
};

export default reviewReducer;