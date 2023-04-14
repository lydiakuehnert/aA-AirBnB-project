import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpotThunk } from "../../store/spots";
import SpotReviews from "../SpotReviews";
import "./OneSpot.css"

export default function OneSpot() {
    const {spotId} = useParams();

    const dispatch = useDispatch();

    const spot = useSelector(state => state.spots.singleSpot);

    useEffect(() => {
        dispatch(getSpotThunk(spotId))
    }, [dispatch])

    if (!spot) return null;
    if (!spot.id) return null;
    if (!spot.SpotImages) return null;

    return (
        <div className="spot-detail-page">
            <div className="spot-detail-box">
                <h1>{spot.name}</h1>
                <h2>{spot.city}, {spot.state}, {spot.country}</h2>
                <div className="spot-img-box">
                    <img src={spot.SpotImages[0].url}></img>
                    <div className="nested-img-box">
                        {spot.SpotImages.length > 1 && <img src={spot.SpotImages[1].url}></img>}
                        {spot.SpotImages.length > 2 && <img src={spot.SpotImages[2].url}></img>}
                    </div>
                    <div className="nested-img-box">
                        {spot.SpotImages.length > 3 && <img src={spot.SpotImages[3].url}></img>}
                        {spot.SpotImages.length > 4 && <img src={spot.SpotImages[4].url}></img>}
                    </div>
                    {/* {spot.SpotImages && spot.SpotImages.slice(1,5).map(img => (
                        <img key={img.id} src={img.url}></img>
                    ))} */}
                </div>
                <div className="under-pics">
                    <div>
                        <h1>Hosted by {spot.Owner && spot.Owner.firstName} {spot.Owner && spot.Owner.lastName}</h1> 
                        <p>{spot.description}</p>
                    </div>
                    <div className="callout-info-box">
                        <div className="callout-info">
                            <div className="callout-price">
                                <h2>${spot.price}</h2> <h3>night</h3>
                            </div>
                            <h3>
                                <i className="fa-solid fa-star"></i>
                                {spot.avgStarRating ? `${spot.avgStarRating.toFixed(1)} · ${spot.numReviews} ` : "New"}
                                {spot.numReviews === 1 ? "review" : ""}
                                {spot.numReviews > 1 ? "reviews" : ""}
                            </h3>
                        </div>
                        <button onClick={() => alert("Feature Coming Soon...")}>Reserve</button>
                    </div> 
                </div>
            </div> 
            <div className="review-detail-box">
                <SpotReviews spot={spot}/>
            </div>     
        </div>
    )
}