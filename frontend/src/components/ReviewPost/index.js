import { useDispatch } from "react-redux";
import { createReviewThunk } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import { useState } from "react";
import "./ReviewPost.css";

export default function ReviewPost({ spot }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [input, setInput] = useState("");
    const [rating, setRating] = useState("");

    const spotId = spot.id;

    // const onChange = (number) => {
    //     setRating(parseInt(number));
    // };

    const handleSubmit = (e) => {
        e.preventDefault()

        const payload = {
            review: input,
            stars: rating
        }

        return dispatch(createReviewThunk({spotId, payload})).then(closeModal)
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>How was your stay?</h1>
            <input 
                type="text"
                placeholder="Leave your review here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                />
            <div className="rating-input">
                <div className={rating > 0 ? "filled" : "empty"}
                    onClick={() => setRating(1)}>
                    <i className="fa-regular fa-star"></i>
                </div>
                <div className={rating > 1 ? "filled" : "empty"}
                    onClick={() => setRating(2)} >
                    <i className="fa-regular fa-star"></i>
                </div>
                <div className={rating > 2 ? "filled" : "empty"}
                    onClick={() => setRating(3)}>
                    <i className="fa-regular fa-star"></i>
                </div>
                <div className={rating > 3 ? "filled" : "empty"}
                    onClick={() => setRating(4)}>
                    <i className="fa-regular fa-star"></i>
                </div>
                <div className={rating > 4 ? "filled" : "empty"}
                    onClick={() => setRating(5)}>
                    <i className="fa-regular fa-star"></i>
                </div>
            </div>
            <button type="submit">Submit Your Review</button>
        </form>
    )
}