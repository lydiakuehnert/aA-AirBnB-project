import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReviewsThunk } from "../../store/reviews";
import ReviewPost from "../ReviewPost";
import OpenModalButton from "../OpenModalButton";

export default function SpotReviews({spot}) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const dispatch = useDispatch();

    const reviewsObj = useSelector(state => state.reviews.spot);
    const reviews = Object.values(reviewsObj)

    useEffect(() => {
        dispatch(getReviewsThunk(spot.id))
    }, [dispatch])

    if (!reviews) return null;

    return (
        <div className="spot-reviews">
            <h1>
                <i className="fa-solid fa-star"></i>
                {spot.avgStarRating ? `${spot.avgStarRating.toFixed(1)} · ${spot.numReviews} ` : "New"}
                {spot.numReviews === 1 ? "review" : ""}
                {spot.numReviews > 1 ? "reviews" : ""}
            </h1>
            <OpenModalButton
                buttonText="Post Your Review"
                modalComponent={<ReviewPost spot={spot} />}
            />
            {reviews.length > 0 && reviews.map(review => (
                <div key={review.id}>
                    <h4>{review.User && review.User.firstName}</h4>
                    <h5>
                        {review.createdAt.split("-")[1]}
                        {review.createdAt.split("-")[0]}
                    </h5>
                    <p>{review.review}</p>
                </div>
            ))}
        </div>
    )
}