import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotsThunk } from "../../store/spots";
import SpotCard from "../SpotCard";

export default function AllSpots() {
    const dispatch = useDispatch();

    const spotsObj = useSelector(state => state.spots.allSpots);
    const spots = Object.values(spotsObj)

    useEffect(() => {
        dispatch(getSpotsThunk())
    }, [dispatch])

    return (
        <>
            {spots.length > 0 && spots.map(spot => (
                <SpotCard spot={spot}/>
            ))}
        </>
    )
}