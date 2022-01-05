import React from "react";

import { Auth } from "aws-amplify";
import dayjs from "dayjs";

import InputGroup from "react-bootstrap/InputGroup";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import { BsCheck, BsX } from "react-icons/bs";

interface SignUpFormProps {}
interface SignUpFormState {
    username: string
    email: string
    password: string
    passwordConf: string
    dob: string
    firstName: string
    surname: string
    isLoading: boolean
}

class SignUpForm extends React.Component<SignUpFormProps, SignUpFormState> {
    constructor(props: SignUpFormProps) {
        super(props);
        this.state = {
            username: "",
            email: "",
            password: "",
            passwordConf: "",
            firstName: "",
            surname: "",
            dob: "",
            isLoading: false
        }
        this.signUp = this.signUp.bind(this);
    }

    async signUp(e: any) {
        e.preventDefault();
        this.setState({ isLoading: true });

        try {
            const user = await Auth.signUp({
                username: this.state.username,
                password: this.state.password,
                attributes: {
                    email: this.state.email,
                    birthdate: dayjs(this.state.dob).format("YYYY-MM-DD"),
                    name: this.state.firstName,
                    family_name: this.state.surname
                }
            })

            console.log("USER CREATED:", user);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            this.setState({ isLoading: false });
        }
    }

    render() {
        const isLoading: boolean = this.state.isLoading;
        const passwordValid: boolean = this.state.password.length >= 8 && this.state.password === this.state.passwordConf;

        return (
            <div className="signUpCont">
                <Form onSubmit={this.signUp}>
                    <Form.Group controlId="signUpUsernameInput">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" onChange={ e => { this.setState({ username: e.target.value }) } } />
                    </Form.Group>

                    <Form.Group className="mt-2" controlId="signUpEmailInput">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={ e => { this.setState({ email: e.target.value }) } } />
                    </Form.Group>

                    <Form.Group className="mt-2" controlId="signUpPasswordInput">
                        <Form.Label>Password</Form.Label>
                        <InputGroup>
                            <Form.Control type="password" placeholder="Enter password" onChange={ e => { this.setState({ password: e.target.value }) } } />
                            <Form.Control type="password" placeholder="Confirm password" onChange={ e => { this.setState({ passwordConf: e.target.value }) } } />
                            <Button variant={ passwordValid ? "success" : "danger" } disabled={true}>{ passwordValid ? <BsCheck /> : <BsX /> }</Button>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mt-2" controlId="signUpNameInput">
                        <Form.Label>Name</Form.Label>
                        <InputGroup>
                            <Form.Control type="text" placeholder="First Name" onChange={ e => { this.setState({ firstName: e.target.value }) } } />
                            <Form.Control type="text" placeholder="Surname" onChange={ e => { this.setState({ surname: e.target.value }) } } />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mt-2" controlId="signUpDateInput">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control type="date" onChange={ e => { this.setState({ dob: e.target.value }) } } />
                    </Form.Group>

                    <Button className="mt-2" variant="primary" size="sm" type="submit" disabled={isLoading} >{
                        isLoading ? <span><Spinner animation="border" size="sm" /></span> : <span>Sign Up</span>
                    }</Button>
                </Form>
            </div>
        )
    }
}

export default SignUpForm;