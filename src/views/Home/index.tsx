import React from "react";
import "./style.css";

import LoginForm from "../../components/User/LoginForm";
import SignUpForm from "../../components/User/SignUpForm";
import NBAFeed from "../../components/Games/NBA/NBAFeed";

import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";

import store from "../../store";
import { connect } from "react-redux";
import { logoutUser } from "../../store/slices/user/userSlice";

import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

interface HomeProps {
    loggedIn: boolean
}

interface HomeState {
    isLoading: boolean
    signUpModal: boolean
    loginModal: boolean
}

class Home extends React.Component<HomeProps, HomeState> {
    constructor (props: HomeProps) {
        super(props);
        this.state = {
            isLoading: true,
            signUpModal: false,
            loginModal: false
        }
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        window.setTimeout(() => {
            this.setState({
                isLoading: false
            });
        }, 300);
    }

    async logout() {
        try {
            await Auth.signOut();
            store.dispatch(logoutUser());
            this.setState({ loginModal: false, signUpModal: false });
        }
        catch(err) {
            console.error(err);
        }
    }

    render() {
        if (this.state.isLoading) {
            return <div className="loadingHomeCont">Loading...</div>
        } else if (this.props.loggedIn) {
            const name = store.getState().user.cogData.name || "";

            return (
                <div className="loadedLoggedInHomeCont">
                    <Container>
                        <Row>
                            <Col></Col>
                            <Col xs={8} md={6}>
                                <div>Hello { name }. Enjoy your punt. Click <Link to="#" onClick={this.logout}>here</Link> to log out.</div>
                                <div className="mt-2">
                                    <NBAFeed />
                                </div>
                            </Col>
                            <Col></Col>
                        </Row>
                    </Container>
                </div>
            )
        } else {
            return (
                <div className="loadedLoggedOutHomeCont">
                    <Container>
                        <Row>
                            <Col>
                            </Col>
                            <Col xs={8} sm={6} md={4}>
                                <div>
                                    You are not logged in. <Link to="#" onClick={ () => { this.setState({ loginModal: true })} }>Login</Link> or <Link to="#" onClick={ () => { this.setState({ signUpModal: true }) } }>Sign Up</Link> to get started.
                                </div>
                                <Modal show={this.state.loginModal} onHide={ () => { this.setState({ loginModal: false }) } }>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Login</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <LoginForm closeModal={ () => { this.setState({ loginModal: false }) } } />
                                    </Modal.Body>
                                </Modal>

                                <Modal show={this.state.signUpModal} onHide={ () => { this.setState({ signUpModal: false }) } }>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Sign Up</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <SignUpForm />
                                    </Modal.Body>
                                </Modal>
                            </Col>
                            <Col></Col>
                        </Row>
                    </Container>
                </div>
            );
        }
    }
}

function mapStateToProps(state: any, ownProps: any) {
    return {
        loggedIn: state.user.loggedIn
    }
}

export default connect(mapStateToProps)(Home);