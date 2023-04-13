import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteReviewThunk } from "../../store/reviews";
import "./DeleteReview.css"

export default function DeleteReview({ review }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();


    const handleDelete = (e) => {
        e.preventDefault()
        return dispatch(deleteReviewThunk(review.id)).then(closeModal)
    }

    return (
        <div className="delete-modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <button onClick={handleDelete} className="yes-button">Yes (Delete Review)</button>
            <button onClick={closeModal} className="no-button">No (Keep Review)</button>
        </div>
    )
}