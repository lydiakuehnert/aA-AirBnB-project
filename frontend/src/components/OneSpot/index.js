import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpotThunk } from "../../store/spots";
import "./OneSpot.css"

export default function OneSpot() {
    const {spotId} = useParams();

    const dispatch = useDispatch();

    const spot = useSelector(state => state.spots.singleSpot);

    useEffect(() => {
        dispatch(getSpotThunk(spotId))
    }, [dispatch])

    if (!spot) return null;

    return (
        <div>
            {spot.id}
        </div>
    )
}