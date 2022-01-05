import React from "react";
import "./style.css";

import LoginForm from "../../components/User/LoginForm";
import SignUpForm from "../../components/User/SignUpForm";

import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";

import store from "../../store";
import { connect } from "react-redux";
import { setUser, logoutUser } from "../../store/slices/user/userSlice";

import Modal from "react-bootstrap/Modal";

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

            console.log(store.getState());
        }, 3000);
    }

    async logout() {
        try {
            await Auth.signOut();
            store.dispatch(logoutUser());
        }
        catch(err) {
            console.error(err);
        }
    }

    render() {
        console.log("PROPS:", this.props);

        if (this.state.isLoading) {
            return <div className="loadingHomeCont">Loading...</div>
        } else if (this.props.loggedIn) {
            const name = store.getState().user.cogData.name || "";

            return (
                <div className="loadedLoggedInHomeCont">
                    <div>Hello { name }. Enjoy your punt. Click <Link to="#" onClick={this.logout}>here</Link> to log out.</div>
                </div>
            )
        } else {
            return (
                <div className="loadedLoggedOutHomeCont">
                    <div>
                        You are not logged in. <Link to="#" onClick={ () => { this.setState({ loginModal: true })} }>Login</Link> or <Link to="#" onClick={ () => { this.setState({ signUpModal: true }) } }>Sign Up</Link> to get started.
                    </div>
                    <Modal show={this.state.loginModal} onHide={ () => { this.setState({ loginModal: false }) } }>
                        <Modal.Header closeButton>
                            <Modal.Title>Login</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <LoginForm />
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
                </div>
            );
        }
    }
}

function mapStateToProps(state: any, ownProps: any) {
    console.log("Map state to props:", state, ownProps);
    return {
        loggedIn: state.user.loggedIn
    }
}

export default connect(mapStateToProps)(Home);