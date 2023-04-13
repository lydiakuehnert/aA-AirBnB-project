import { useDispatch } from "react-redux";
import { createReviewThunk } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import { useState } from "react";
import "./ReviewPost.css";
import { getSpotThunk } from "../../store/spots";

export default function ReviewPost({ spot }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [input, setInput] = useState("");
    const [rating, setRating] = useState("");
    const [activeRating, setActiveRating] = useState(rating);
    const [errors, setErrors] = useState({})

    const spotId = spot.id;

    const handleSubmit = async (e) => {
        e.preventDefault()

        const payload = {
            review: input,
            stars: rating
        }

        const result = await dispatch(createReviewThunk({spotId, payload}))

        if (result.message) {
            setErrors(result)
        } else {
            dispatch(getSpotThunk(spotId))
            closeModal()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="review-form-box">
            <h2>How was your stay?</h2>
            {Object.values(errors).length > 0 && <p className="errors">{errors.message}</p>}
            <textarea
                type="text"
                placeholder="Leave your review here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                />
            <div className="rating-input">
                <div onMouseEnter={() => setActiveRating(1)}
                    onMouseLeave={() => setActiveRating(rating)}
                    onClick={() => setRating(1)}>
                    {activeRating > 0 ? <i className="fa-solid fa-star"></i> : <i className="fa-regular fa-star"></i>}
                </div>
                <div onMouseEnter={() => setActiveRating(2)}
                    onMouseLeave={() => setActiveRating(rating)}
                    onClick={() => setRating(2)} >
                    {activeRating > 1 ? <i className="fa-solid fa-star"></i> : <i className="fa-regular fa-star"></i>}
                </div>
                <div onMouseEnter={() => setActiveRating(3)}
                    onMouseLeave={() => setActiveRating(rating)}
                    onClick={() => setRating(3)}>
                    {activeRating > 2 ? <i className="fa-solid fa-star"></i> : <i className="fa-regular fa-star"></i>}
                </div>
                <div onMouseEnter={() => setActiveRating(4)}
                    onMouseLeave={() => setActiveRating(rating)}
                    onClick={() => setRating(4)}>
                    {activeRating > 3 ? <i className="fa-solid fa-star"></i> : <i className="fa-regular fa-star"></i>}
                </div>
                <div onMouseEnter={() => setActiveRating(5)}
                    onMouseLeave={() => setActiveRating(rating)}
                    onClick={() => setRating(5)}>
                    {activeRating > 4 ? <i className="fa-solid fa-star"></i> : <i className="fa-regular fa-star"></i>}
                </div>
                <h5>Stars</h5>
            </div>
            <button type="submit" disabled={input.length < 10 || rating < 1}>Submit Your Review</button>
        </form>
    )
}