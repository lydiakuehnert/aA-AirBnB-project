import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReviewsThunk } from "../../store/reviews";
import ReviewPost from "../ReviewPost";
import OpenModalButton from "../OpenModalButton";
import DeleteReview from "../DeleteReview";
import "./SpotReviews.css";

export default function SpotReviews({spot}) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const reviewsObj = useSelector(state => state.reviews.spot);
    const reviews = Object.values(reviewsObj)

    useEffect(() => {
        dispatch(getReviewsThunk(spot.id))
    }, [dispatch])

    if (reviews.length < 1) return <p>Loading...</p>;
    if (!spot) return <p>Loading...</p>;
    if (!spot.Owner) return <p>Loading...</p>;

    return (
        <div className="spot-reviews">
            <h1>
                <i className="fa-solid fa-star"></i>
                {spot.avgStarRating ? `${spot.avgStarRating.toFixed(1)} · ${spot.numReviews} ` : "New"}
                {spot.numReviews === 1 ? "review" : ""}
                {spot.numReviews > 1 ? "reviews" : ""}
            </h1>
            {sessionUser && sessionUser.id !== spot.Owner.id && !reviews.find(review => review.userId === sessionUser.id) &&
            <OpenModalButton
                buttonText="Post Your Review"
                className="modal-post-review"
                modalComponent={<ReviewPost spot={spot} />}
            />}
            {sessionUser && !reviews.length && sessionUser.id !== spot.Owner.id && <h5>Be the first to post a review!</h5>}
            {reviews.length > 0 && reviews.slice().reverse().map(review => {
                const reviewMonth = review.createdAt.split("")[6]
                const reviewMonth2 = review.createdAt.split("-")[1];
                let month;
                if (reviewMonth2 < 10) month = months[reviewMonth-1]
                if (reviewMonth2 >= 10) month = months[reviewMonth2-1]
                const year = review.createdAt.split("-")[0]
                return (
                    <div key={review.id} className="one-review-box">
                        <h4>{review.User && review.User.firstName}</h4>
                        <h5>
                            {month} {year}
                        </h5>
                        <p>{review.review}</p>
                        {sessionUser && sessionUser.id === review.userId && <OpenModalButton
                            buttonText="Delete"
                            modalComponent={<DeleteReview review={review} spotId={spot.id}/>}
                        />}
                    </div>
                )
            })}
        </div>
    )
}