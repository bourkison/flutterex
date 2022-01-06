import React, { useState } from "react";

import Card from "react-bootstrap/Card";
import dayjs from "dayjs"

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Modal } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import { Link } from "react-router-dom";

interface NBAGameComponentProps {
    game: any
}

export default function NBAGameComponent(props: NBAGameComponentProps) {
    const [betModal, setBetModal] = useState(false);

    const date = dayjs(props.game.date).format("dddd, MMMM D h:mma");
    let cardContent: JSX.Element;

    if (props.game.status.type.completed || props.game.status.clock) {
        cardContent = (
            <Container>
                <Row>
                    <Col xs={6}>
                        <div>
                            <div>
                                <img src={ props.game.competitions[0].competitors[0].team.logo } alt="Home team logo" className="w-100" />
                            </div>
                            <div><h4>{ props.game.competitions[0].competitors[0].score }</h4></div>
                            <div>{ props.game.competitions[0].competitors[0].homeAway.replace(/./, (c: string) => c.toUpperCase()) }</div>
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div>
                            <div>
                                <img src={ props.game.competitions[0].competitors[1].team.logo } alt="Away team logo" className="w-100" />
                            </div>
                            <div><h4>{ props.game.competitions[0].competitors[1].score }</h4></div>
                            <div>{ props.game.competitions[0].competitors[1].homeAway.replace(/./, (c: string) => c.toUpperCase()) }</div>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    } else {
        cardContent = (
            <Container>
                <Row>
                    <Col xs={6}>
                        <div>
                            <div>
                                <img src={ props.game.competitions[0].competitors[0].team.logo } alt="Home team logo" className="w-100" />
                            </div>
                            <div>{ props.game.competitions[0].competitors[0].homeAway.replace(/./, (c: string) => c.toUpperCase()) }</div>
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div>
                            <div>
                                <img src={ props.game.competitions[0].competitors[1].team.logo } alt="Away team logo" className="w-100" />
                            </div>
                            <div>{ props.game.competitions[0].competitors[1].homeAway.replace(/./, (c: string) => c.toUpperCase()) }</div>
                        </div>
                    </Col>
                </Row>
                <div><Button variant="success" size="sm" onClick={ () => { setBetModal(true) } }>Bet</Button></div>

                <Modal show={betModal} onHide={ () => { setBetModal(false) } } centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{ props.game.shortName }</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col>
                                <div className="text-start">
                                    <div><strong>Contracts for { props.game.competitions[0].competitors[0].team.shortDisplayName }</strong></div>
                                    <div className="mt-1">
                                        <em>No contracts</em>
                                    </div>
                                    <div className="mt-2 text-center">
                                    <Link className="btn btn-outline-success btn-sm" role="button" to="/contracts/new"><BsPlus /> New</Link>
                                    </div>
                                </div>
                            </Col>
                            <Col>
                                <div className="text-end">
                                    <div><strong>Contracts for { props.game.competitions[0].competitors[1].team.shortDisplayName }</strong></div>
                                    <div className="mt-1">
                                        <em>No contracts</em>
                                    </div>
                                    <div className="mt-2 text-center">
                                        <Link className="btn btn-outline-success btn-sm" role="button" to="/contracts/new"><BsPlus /> New</Link>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            </Container>
        );
    }

    return (
        <div>
            <Card>
                <Card.Body>
                    <Card.Title>{ props.game.shortName } | { date }</Card.Title>
                    <Card.Text>
                        { cardContent }
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}