import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createSpotThunk } from "../../store/spots";
import { editSpotThunk } from "../../store/spots";


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
    const [errors, setErrors] = useState({})

    const history = useHistory();
    const dispatch = useDispatch();

    // useEffect(() => {
    //     const err = {};
    //     if (country.length < 1) err.country = "Name must be 3 or more characters."
    //     if (name.length > 20) err.name = "Name must be 20 characters or less."
    //     if (fruits.find(f => (name === f.name))) err.name = "Name already exists."
    //     if (sweetness < 1 || sweetness > 10) err.sweetness = "Sweetness must be between 1 and 10."
    //     setErrors(err)
    // }, [name, sweetness])

    async function onSubmit(e) {
        e.preventDefault()
        setErrors({})

        if (url1.length > 0) SpotImages.push({url: url1, preview: true})
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
            lat: lat1,
            lng: lng1,
            name: name1,
            description: description1,
            price: price1
        }

        if (formType === "Update your Spot") {
            const editedSpot = await dispatch(editSpotThunk({ newSpot, SpotImages }));
            newSpot = editedSpot;
        } else if (formType === "Create a new Spot") {
            const createdSpot = await dispatch(createSpotThunk({ newSpot, SpotImages }));
            newSpot = createdSpot
        }
        console.log("newSPOT============", newSpot)

        if (newSpot.errors) {
            setErrors(newSpot.errors)
        } else {
            history.push(`/spots/${newSpot.id}`)
            reset()
        }
    }

    const reset = () => {
        setName("");
        setAddress("");
        setCity("");
        setState("");
        setCountry("");
        setLat("");
        setLng("");
        setDescription("");
        setPrice("");
        setUrl1("");
        setUrl2("");
        setUrl3("");
        setUrl4("");
        setUrl5("");
        setSpotImg([]);
        setErrors({})
    }

    return (
        <form
            className="spot-form"
            onSubmit={onSubmit}
        >
            <h2>{formType}</h2>
            <section>
                <h3>Where's your place located?</h3>
                <p>Guests will only get your exact address once they booked a reservation.</p>
                <label>Country
                    <input
                        type="text"
                        value={country1}
                        placeholder="Country"
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </label>
                {errors.country && <p className="errors">{errors.country}</p>}
                <label>
                    Street Address
                    <input
                        type="text"
                        value={address1}
                        placeholder="Address"
                        onChange={e => setAddress(e.target.value)}
                    />
                </label>
                {errors.address && <p className="errors">{errors.address}</p>}
                <label>
                    City
                    <input
                        type="text"
                        value={city1}
                        placeholder="City"
                        onChange={e => setCity(e.target.value)}
                    />
                </label>,
                <label>
                    State
                    <input
                        type="text"
                        value={state1}
                        placeholder="STATE"
                        onChange={e => setState(e.target.value)}
                    />
                </label>
                <label>
                    Latitude
                    <input
                        type="text"
                        value={lat1}
                        placeholder="Latitude"
                        onChange={e => setLat(e.target.value)}
                    />
                </label>,
                <label>
                    Longitude
                    <input
                        type="text"
                        value={lng1}
                        placeholder="Longitude"
                        onChange={e => setLng(e.target.value)}
                    />
                </label>
            </section>
            <section>
                <h3>Describe your place to guests</h3>
                <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                <label>
                    <input
                        type="text"
                        value={description1}
                        placeholder="Please write at least 30 characters"
                        onChange={e => setDescription(e.target.value)}
                        />
                </label>
            </section>
            <section>
                <h3>Create a title for your spot</h3>
                <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                <label>
                    <input
                        type="text"
                        value={name1}
                        placeholder="Name of your spot"
                        onChange={e => setName(e.target.value)}
                    />
                </label>
            </section>
            <section>
                <h3>Set a base price for you spot</h3>
                <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                <label> $
                    <input
                        type="text"
                        value={price1}
                        placeholder="Price per night (USD)"
                        onChange={e => setPrice(e.target.value)}
                    />
                </label>
            </section>
            {formType === "Create a new Spot" && <section>
                <h3>Liven up your spot with photos</h3>
                <p>Submit a link to at least one photo to publish your spot.</p>
                <input
                    type="text"
                    value={url1}
                    placeholder="Preview Image URL"
                    onChange={e => setUrl1(e.target.value)}
                />
                <input
                    type="text"
                    value={url2}
                    placeholder="Image URL"
                    onChange={e => setUrl2(e.target.value)}
                />
                <input
                    type="text"
                    value={url3}
                    placeholder="Image URL"
                    onChange={e => setUrl3(e.target.value)}
                />
                <input
                    type="text"
                    value={url4}
                    placeholder="Image URL"
                    onChange={e => setUrl4(e.target.value)}
                />
                <input
                    type="text"
                    value={url5}
                    placeholder="Image URL"
                    onChange={e => setUrl5(e.target.value)}
                />
            </section>}
            <button
                type="submit"
                // disabled={Object.values(errors).length ? true : false}
            >
                CreateSpot
            </button>
        </form>
    );
}

export default SpotForm;