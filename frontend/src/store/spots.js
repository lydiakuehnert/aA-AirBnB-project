import { csrfFetch } from "./csrf";

const GET_SPOTS = "spots/getSpots";
const GET_SPOT = "spots/getSpot";
const CREATE_SPOT = "spots/createSpot";
const GET_USER_SPOTS = "spots/getUserSpots";
const DELETE_SPOT = "spots/deleteSpot";
const EDIT_SPOT = "spots/editSpot";


const getUserSpotsAction = (spots) => {
    return {
        type: GET_USER_SPOTS,
        spots
    }
}

const getSpotAction = (spot) => {
    return {
        type: GET_SPOT,
        spot
    }
}

const getSpotsAction = (spots) => {
    return {
        type: GET_SPOTS,
        spots
    }
};

const createSpotAction = (spot) => {
    return {
        type: CREATE_SPOT,
        spot
    }
}

const deleteSpotAction = (spotId) => {
    return {
        type: DELETE_SPOT,
        spotId
    }
}

const editSpotAction = (spot) => {
    return {
        type: EDIT_SPOT,
        spot
    }
}

export const getUserSpotsThunk = () => async dispatch => {
    const res = await csrfFetch('/api/spots/current')

    if (res.ok) {
        const spots = await res.json();
        dispatch(getUserSpotsAction(spots.Spots))
    }
}

export const getSpotThunk = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`);

    if (res.ok) {
        const spot = await res.json()
        dispatch(getSpotAction(spot))
    }
}

export const getSpotsThunk = () => async dispatch => {
    const res = await csrfFetch('/api/spots')

    if (res.ok) {
        const spots = await res.json();
        dispatch(getSpotsAction(spots.Spots))
    }
};

export const createSpotThunk = (payload) => async dispatch => {
    const {newSpot, SpotImages} = payload;
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newSpot)
    })
    
    if (res.ok) {
        const spot = await res.json();
        for (let i = 0; i < SpotImages.length; i++) {
            let img = SpotImages[i]
            await csrfFetch(`/api/spots/${spot.id}/images`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(img)
            })
        }
        dispatch(createSpotAction(spot))
        return spot;
    } else {
        return res.json()
    }
}

export const deleteSpotThunk = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
    if (res.ok) {
        dispatch(deleteSpotAction(spotId))
    }
}

export const editSpotThunk = (payload) => async dispatch => {
    const { newSpot, SpotImages } = payload;
    const res = await csrfFetch(`/api/spots/${newSpot.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSpot)
    })

    if (res.ok) {
        const spot = await res.json();
        for (let i = 0; i < SpotImages.length; i++) {
            let img = SpotImages[i]
            await csrfFetch(`/api/spots/${spot.id}/images`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(img)
            })
        }
        dispatch(editSpotAction(spot))
        return spot;
    } else {
        return res.json()
    }
}


const initialState = {allSpots: {}, singleSpot: {}};

const spotReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_SPOTS: {
            newState = {...state, allSpots: {}, singleSpot: {}}
            action.spots.forEach(spot => newState.allSpots[spot.id] = spot)
            return newState
        }
        case GET_SPOT: {
            newState = {...state, allSpots: {...state.allSpots}, singleSpot: {}}
            newState.singleSpot = action.spot;
            return newState;
        }
        case CREATE_SPOT: {
            newState = {...state, allSpots: {...state.allSpots}, singleSpot:{}}
            newState.allSpots[action.spot.id] = action.spot;
            newState.singleSpot = action.spot;
            return newState
        }
        case GET_USER_SPOTS: {
            newState = {...state, allSpots: {}, singleSpot: {}}
            action.spots.forEach(spot => newState.allSpots[spot.id] = spot)
            return newState
        }
        case DELETE_SPOT: {
            newState = {...state, allSpots: {...state.allSpots}, singleSpot: {}}
            delete newState.allSpots[action.spotId]
            return newState
        }
        case EDIT_SPOT: {
            newState = {...state, allSpots: {...state.allSpots}, singleSpot: {}}
            newState.allSpots[action.spot.id] = action.spot;
            return newState;
        }
        default:
            return state;
    }
};

export default spotReducer;