import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createSpotThunk } from "../../store/spots";
import { editSpotThunk } from "../../store/spots";
import "./SpotForm.css";


function SpotForm({spot, formType}) {
    const {name, address, city, state, country, lat, lng, description, price} = spot
    const [name1, setName] = useState(formType === "Update your Spot" ? name : "");
    const [address1, setAddress] = useState(formType === "Update your Spot" ? address : "");
    const [city1, setCity] = useState(formType === "Update your Spot" ? city : "");
    const [state1, setState] = useState(formType === "Update your Spot" ? state : "");
    const [country1, setCountry] = useState(formType === "Update your Spot" ? country : "");
    const [lat1, setLat] = useState(formType === "Update your Spot" ? lat : "");
    const [lng1, setLng] = useState(formType === "Update your Spot" ? lng : "");
    const [description1, setDescription] = useState(formType === "Update your Spot" ? description : "");
    const [price1, setPrice] = useState(formType === "Update your Spot" ? price : "");
    const [url1, setUrl1] = useState("")
    const [url2, setUrl2] = useState("")
    const [url3, setUrl3] = useState("")
    const [url4, setUrl4] = useState("")
    const [url5, setUrl5] = useState("")
    const [SpotImages, setSpotImg] = useState([]);
    const [errors, setErrors] = useState({});
    const [displayErrors, setDisplayErrors] = useState(false)
    // const [submitted, setSubmit] = useState(false);

    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        const err = {};
        if (name1.length < 1) err.name1 = "Name is required";
        if (address1.length < 1) err.address1 = "Address is required";
        if (city1.length < 1) err.city1 = "City is required";
        if (country1.length < 1) err.country1 = "Country is required";
        if (state1.length < 1) err.state1 = "State is required";
        if (lat1.length < 1) err.lat1 = "Latitude is required";
        if (lng1.length < 1) err.lng1 = "Longitude is required";
        if (description1.length < 30) err.description1 = "Description needs a minimum of 30 characters";
        if (price1.length < 1) err.price1 = "Price is required";
        if (isNaN(price1)) err.price1 = "Price must be a number."; 
        if (url1.length < 1 && formType === "Create a new Spot") err.url1 = "Preview image is required."
        if (!url1.includes(".png") && !url1.includes(".jpg") && !url1.includes(".jpeg")) err.url1 = "Image URL must end in .png, .jpg, or .jpeg."
        if (url2 !== "" && !url2.includes(".png") && !url2.includes(".jpg") && !url2.includes(".jpeg")) err.url2 = "Image URL must end in .png, .jpg, or .jpeg."
        if (url3 !== "" && !url3.includes(".png") && !url3.includes(".jpg") && !url3.includes(".jpeg")) err.url3 = "Image URL must end in .png, .jpg, or .jpeg."
        if (url4 !== "" && !url4.includes(".png") && !url4.includes(".jpg") && !url4.includes(".jpeg")) err.url4 = "Image URL must end in .png, .jpg, or .jpeg."
        if (url5 !== "" && !url5.includes(".png") && !url5.includes(".jpg") && !url5.includes(".jpeg")) err.url5 = "Image URL must end in .png, .jpg, or .jpeg."
        setErrors(err)
    }, [name1, address1, city1, country1, state1, lat1, lng1, description1, price1, url1, url2, url3, url4, url5])

    const errorClass = "errors" + (displayErrors ? '' : 'hide')

    async function onSubmit(e) {
        e.preventDefault()

        if (formType === "Create a new Spot") {
            if (Object.values(errors).length > 0) {
                setDisplayErrors(true)
            }
            else {
                if (url1.length > 0) SpotImages.push({ url: url1, preview: true })
                if (url2.length > 0) SpotImages.push({ url: url2, preview: false })
                if (url3.length > 0) SpotImages.push({ url: url3, preview: false })
                if (url4.length > 0) SpotImages.push({ url: url4, preview: false })
                if (url5.length > 0) SpotImages.push({ url: url5, preview: false })
    
                let newSpot = {
                    ...spot,
                    address: address1,
                    city: city1,
                    state: state1,
                    country: country1,
                    lat: 25,
                    lng: 25,
                    name: name1,
                    description: description1,
                    price: price1
                }
    
                const createdSpot = await dispatch(createSpotThunk({ newSpot, SpotImages }));
                history.push(`/spots/${createdSpot.id}`)
            }

        } else {
            if (Object.values(errors).length > 0) {
                setDisplayErrors(true)
            }
            else {
                let newSpot = {
                    ...spot,
                    address: address1,
                    city: city1,
                    state: state1,
                    country: country1,
                    lat: 25,
                    lng: 25,
                    name: name1,
                    description: description1,
                    price: price1
                }

                const editedSpot = await dispatch(editSpotThunk({ newSpot, SpotImages }));
                history.push(`/spots/${editedSpot.id}`)
            }
        }
    }


    if (!spot) return null;
    if (!formType) return null;

    

    return (
        <form
            className="spot-form"
            onSubmit={onSubmit}
        >
            <h2>{formType}</h2>
            <section className="form-section">
                <h3>Where's your place located?</h3>
                <p>Guests will only get your exact address once they booked a reservation.</p>
                <div className="enter-box">
                    <div className="enter-label">
                        <label>Country</label>
                        {displayErrors && errors.country1 && <p className={errorClass}>{errors.country1}</p>}
                    </div>
                    <input
                        className="enter-input"
                        type="text"
                        value={country1}
                        placeholder="Country"
                        onChange={(e) => setCountry(e.target.value)}
                        />
                </div>
                <div className="enter-box">
                    <div className="enter-label">
                        <label>Street Address</label>
                        {displayErrors && errors.address1 && <p className={errorClass}>{errors.address1}</p>}
                    </div>
                    <input
                        className="enter-input"
                        type="text"
                        value={address1}
                        placeholder="Address"
                        onChange={e => setAddress(e.target.value)}
                        />
                
                </div>
                <div className="big-enter-box">
                    <div className="enter-box" id="city-box">
                        <div className="enter-label">
                            <label>City</label>
                            {displayErrors && errors.city1 && <p className={errorClass}>{errors.city1}</p>}
                        </div>
                        <input
                            className="enter-input"
                            type="text"
                            value={city1}
                            placeholder="City"
                            onChange={e => setCity(e.target.value)}
                            />
                    </div>
                    <div className="comma">,</div>
                    <div className="enter-box" id="state-box">
                        <div className="enter-label">
                            <label>State</label>
                            {displayErrors && errors.state1 && <p className={errorClass}>{errors.state1}</p>}
                        </div>
                        <input
                            className="enter-input"
                            type="text"
                            value={state1}
                            placeholder="STATE"
                            onChange={e => setState(e.target.value)}
                            />
                    </div>
                </div>
                <div className="big-enter-box">
                    <div className="enter-box" id="lat-box">
                        <div className="enter-label">
                            <label>Latitude</label>
                            {displayErrors && errors.lat1 && <p className={errorClass}>{errors.lat1}</p>}
                        </div>
                        <input
                            className="enter-input"
                            type="text"
                            value={lat1}
                            placeholder="Latitude"
                            onChange={e => setLat(e.target.value)}
                            />
                    </div>
                    <div className="comma">,</div>
                    <div className="enter-box" id="lng-box">
                        <div className="enter-label">
                            <label>Longitude</label>
                            {displayErrors && errors.lng1 && <p className={errorClass}>{errors.lng1}</p>}
                        </div>
                        <input
                            className="enter-input"
                            type="text"
                            value={lng1}
                            placeholder="Longitude"
                            onChange={e => setLng(e.target.value)}
                            />
                    </div>
                    
                </div>
            </section>
            <section className="form-section">
                <h3>Describe your place to guests</h3>
                <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                <label>
                    <textarea
                        id="description-input" rows="20" cols="50"
                        type="text"
                        value={description1}
                        placeholder="Please write at least 30 characters"
                        onChange={e => setDescription(e.target.value)}
                        />
                </label>
                {displayErrors && errors.description1 && <p className={errorClass}>{errors.description1}</p>}
            </section>
            <section className="form-section">
                <h3>Create a title for your spot</h3>
                <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                <label>
                    <input
                        id="title-input"
                        type="text"
                        value={name1}
                        placeholder="Name of your spot"
                        onChange={e => setName(e.target.value)}
                    />
                </label>
                {displayErrors && errors.name1 && <p className={errorClass}>{errors.name1}</p>}
            </section>
            <section className="form-section">
                <h3>Set a base price for your spot</h3>
                <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                <label> $
                    <input
                        id="price-input-field"
                        type="text"
                        value={price1}
                        placeholder="Price per night (USD)"
                        onChange={e => setPrice(e.target.value)}
                    />
                </label>
                {displayErrors && errors.price1 && <p className={errorClass}>{errors.price1}</p>}
            </section>
            {formType === "Create a new Spot" && <section className="form-section" id="photo-section">
                <h3>Liven up your spot with photos</h3>
                <p>Submit a link to at least one photo to publish your spot.</p>
                <input
                    type="text"
                    value={url1}
                    placeholder="Preview Image URL"
                    onChange={e => setUrl1(e.target.value)}
                />
                {formType === "Create a new Spot" && displayErrors && errors.url1 && <p className={errorClass}>{errors.url1}</p>}
                <input
                    type="text"
                    value={url2}
                    placeholder="Image URL"
                    onChange={e => setUrl2(e.target.value)}
                />
                {formType === "Create a new Spot" && displayErrors && errors.url2 && <p className={errorClass}>{errors.url2}</p>}
                <input
                    type="text"
                    value={url3}
                    placeholder="Image URL"
                    onChange={e => setUrl3(e.target.value)}
                />
                {formType === "Create a new Spot" && displayErrors && errors.url3 && <p className={errorClass}>{errors.url3}</p>}
                <input
                    type="text"
                    value={url4}
                    placeholder="Image URL"
                    onChange={e => setUrl4(e.target.value)}
                />
                {formType === "Create a new Spot" && displayErrors && errors.url4 && <p className={errorClass}>{errors.url4}</p>}
                <input
                    type="text"
                    value={url5}
                    placeholder="Image URL"
                    onChange={e => setUrl5(e.target.value)}
                />
                {formType === "Create a new Spot" && displayErrors && errors.url5 && <p className={errorClass}>{errors.url5}</p>}
            </section>}
            <button
                type="submit"
            >
                Create Spot
            </button>
        </form>
    );
}

export default SpotForm;




// async function onSubmit(e) {
//     e.preventDefault()
//     // setErrors({})
//     // setSubmit(true);

//     if (Object.values(errors).length > 0) {
//         setDisplayErrors(true);
//         // return;
//     }

//     if (url1.length > 0) SpotImages.push({ url: url1, preview: true })
//     if (url2.length > 0) SpotImages.push({ url: url2, preview: false })
//     if (url3.length > 0) SpotImages.push({ url: url3, preview: false })
//     if (url4.length > 0) SpotImages.push({ url: url4, preview: false })
//     if (url5.length > 0) SpotImages.push({ url: url5, preview: false })

//     let newSpot = {
//         ...spot,
//         address: address1,
//         city: city1,
//         state: state1,
//         country: country1,
//         lat: lat1,
//         lng: lng1,
//         name: name1,
//         description: description1,
//         price: price1
//     }

//     if (formType === "Update your Spot") {
//         const editedSpot = await dispatch(editSpotThunk({ newSpot, SpotImages }));
//         newSpot = editedSpot;
//     } else if (formType === "Create a new Spot") {
//         const createdSpot = await dispatch(createSpotThunk({ newSpot, SpotImages }));
//         newSpot = createdSpot
//     }

//     console.log("edited spot =======", newSpot)

//     if (newSpot.errors) {
//         setErrors(newSpot.errors)
//     } else {
//         history.push(`/spots/${newSpot.id}`)
//         reset()
//     }
// }