import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotsThunk } from "../../store/spots";
import SpotCard from "../SpotCard";
import "./AllSpots.css"

export default function AllSpots() {
    const dispatch = useDispatch();

    const spotsObj = useSelector(state => state.spots.allSpots);
    const spots = Object.values(spotsObj)

    useEffect(() => {
        dispatch(getSpotsThunk())
    }, [dispatch])

    return (
        <div className="all-spots">
            {spots.length > 0 && spots.map(spot => (
                <SpotCard key={spot.id} spot={spot}/>
            ))}
        </div>
    )
}