import React, { useState } from "react";
import AppRouter from "./router";
import "./App.css";

import { connect, useDispatch } from "react-redux";
import { logoutUser } from "./store/slices/user/userSlice";

import { Auth } from "aws-amplify";

import { NavLink } from "react-router-dom";
import { BsPersonCircle } from "react-icons/bs";
import Spinner from "react-bootstrap/Spinner";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";
import Modal from "react-bootstrap/Modal";

import LoginForm from "./components/User/LoginForm"
import SignUpForm from "./components/User/SignUpForm"

interface AppProps {
    loadingUser: boolean
    loggedIn: boolean
}

function App(props: AppProps) {
    const [loginModal, setLoginModal] = useState(false);
    const [signUpModal, setSignUpModal] = useState(false);
    const dispatch = useDispatch();

    const username = "bourkison";

    async function logout() {
        try {
            await Auth.signOut();
            dispatch(logoutUser());
            setLoginModal(false);
            setSignUpModal(false);
        }
        catch(err) {
            console.error(err);
        }
    }


    if (props.loadingUser) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
            </Container>
        )
    }

    let header: JSX.Element = (
        <Navbar sticky="top" className="mainNav" expand="sm" variant="light" bg="light">
            <Container>
                <Navbar.Brand as={NavLink} to="/">FlutterEx</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Nav className="ms-auto">
                        <Nav.Link onClick={ () => { setLoginModal(true) } }>Login</Nav.Link>
                        <Nav.Link onClick={ () => { setSignUpModal(true) } }>Sign Up</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );

    if (props.loggedIn) {
        header = (
            <Navbar sticky="top" className="mainNav" expand="sm" variant="light" bg="light">
                <Container>
                    <Navbar.Brand as={NavLink} to="/">FlutterEx</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse>
                        <Nav>
                            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                            <Nav.Link as={NavLink} to="/contracts">Contracts</Nav.Link>
                        </Nav>
                        <Nav className="ms-auto">
                            <NavDropdown title={<BsPersonCircle size="24" />}>
                                <NavDropdown.Item as={NavLink} to={"/" + username}>Profile</NavDropdown.Item>
                                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    }

    return (
        <div className="App">
            {header}
            <div className="mt-2">
                <AppRouter />
            </div>
            <Modal show={loginModal} onHide={ () => { setLoginModal(false) } }>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LoginForm closeModal={ () => { setLoginModal(false) } } />
                </Modal.Body>
            </Modal>

            <Modal show={signUpModal} onHide={ () => { setSignUpModal(false) } }>
                <Modal.Header closeButton>
                    <Modal.Title>Sign Up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SignUpForm />
                </Modal.Body>
            </Modal>
        </div>
    );
}

function mapStateToProps(state: any) {
    return {
        loadingUser: state.user.loadingUser,
        loggedIn: state.user.loggedIn
    }
}

export default connect(mapStateToProps)(App);
