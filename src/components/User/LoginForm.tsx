import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/user/userSlice";

import { Auth } from "aws-amplify";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

interface LoginFormProps {
    closeModal: Function
}

export default function LoginForm({ closeModal }: LoginFormProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    async function login(e: any) {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const user = await Auth.signIn({
                username: username,
                password: password
            });

            console.log("USER LOGGED IN:", user);

            setIsLoading(false);
            dispatch(setUser({
                username: user.username,
                name: user.attributes.name,
                surname: user.attributes.family_name,
                email: user.attributes.email,
                dob: user.attributes.birthdate
            }));

            closeModal();
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="loginCont">
            <Form onSubmit={login}>
                <Form.Group controlId="loginUsernameInput">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="username" placeholder="Enter username" onChange={ e => { setUsername(e.target.value) } } />
                </Form.Group>

                <Form.Group className="mt-2" controlId="loginPasswordInput">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" onChange={ e => { setPassword(e.target.value) } } />
                </Form.Group>

                <Button className="mt-2" variant="primary" size="sm" type="submit" disabled={isLoading}>{
                    isLoading ? <span><Spinner animation="border" size="sm" /></span> : <span>Login</span>
                }</Button>
            </Form>
        </div>
    );
}