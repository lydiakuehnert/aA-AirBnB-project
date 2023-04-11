import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReviewsThunk } from "../../store/reviews";

export default function SpotReviews({spotId}) {
    const dispatch = useDispatch();

    const reviewsObj = useSelector(state => state.reviews.spot);
    const reviews = Object.values(reviewsObj)

    useEffect(() => {
        dispatch(getReviewsThunk(spotId))
    }, [dispatch])

    return (
        <div className="spot-reviews">
            {reviews.length > 0 && reviews.map(review => (
                <div key={review.id}>{review.User.firstName}</div>
            ))}
        </div>
    )
}