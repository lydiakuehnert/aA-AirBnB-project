import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
    };

    const handleDemoUser = (e) => {
        e.preventDefault();
        return dispatch(sessionActions.login({
            credential: "Demo-lition",
            password: "password"
        })).then(closeModal)
    }

    return (
        <div className="login-modal">
            <h2>Log In</h2>
            <form onSubmit={handleSubmit} className="login-form">
                {errors.credential && (
                    <p className="errors">{errors.credential}</p>
                )}
                <input
                    type="text"
                    placeholder="Username or Email"
                    value={credential}
                    onChange={(e) => setCredential(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button disabled={credential.length < 4 || password.length < 6} type="submit">Log In</button>
            </form>
            <h4 onClick={handleDemoUser}>Demo User</h4>
        </div>
    );
}

export default LoginFormModal;