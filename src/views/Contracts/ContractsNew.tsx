import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom"
import { API } from "aws-amplify";
import { fetchJwtToken } from "../../scripts/amplify";
import dayjs from "dayjs"

import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

export default function ContractsNew() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [gameDate, setGameDate] = useState(dayjs().format("YYYY-MM-DD"))
    const [selectedGame, setSelectedGame] = useState<any>(undefined);
    const [selectedTeam, setSelectedTeam] = useState("");
    const [contractAmount, setContractAmount] = useState("0");
    const [contractOdds, setContractOdds] = useState("1");
    const [loadingGames, setLoadingGames] = useState(false);
    const [loadedGames, setLoadedGames] = useState([]);
 
    function setNum(amount: string, setFunction: Function) {
        console.log("Setting amount", amount);
        if (/^-?[0-9]+(?:\.[0-9]+)?$/.test(amount+'') || amount.charAt(amount.length - 1) === "." || amount === "") {
            setFunction(amount);
        }
    }

    function selectGame(e: React.ChangeEvent<HTMLSelectElement>) {
        setSelectedGame(loadedGames.find(game => { return game.id === e.target.value }));
        if (!selectedGame) {
            setSelectedTeam("");
        }
    }

    async function createContract(e: React.FormEvent) {
        e.preventDefault();
        console.log("Create")
    }

    async function loadGames(date: string) {
        setLoadingGames(true);
        setLoadedGames([]);
        console.log("LOADING GAMES");

        try {
            const apiName: string = "flutterexapi";
            const path: string = "/games";
            const myInit: object = {
                headers: {
                    Authorization: await fetchJwtToken()
                },
                queryStringParameters: {
                    date: date
                }
            }

            const response = await API.get(apiName, path, myInit);

            setLoadedGames(response.data);
            console.log("GAMES LOADED:", response);
        }
        catch (err) {
            console.error(err)
        }
        finally {
            setLoadingGames(false);
        }
    }

    useMemo(() => {
        loadGames(gameDate);
        setSelectedGame(undefined);
        setSelectedTeam("");
    }, [gameDate])

    return (
        <div className="contractsNewCont text-start">
            <Container>
                <Row>
                    <Col></Col>
                    <Col xs={8} sm={6} md={4}>
                        <div className="text-center"><h3>New Contract</h3></div>
                        <div>
                            <Form onSubmit={createContract}>
                                <Form.Group controlId="gameInput">
                                        <Form.Label>Game</Form.Label>
                                    <InputGroup>
                                        <Form.Control type="date" value={gameDate} onChange={e => { setGameDate(e.target.value) }} />
                                        <Form.Select onChange={selectGame}>
                                            <option value="">{ loadingGames ? "Loading..." : "Select a game"}</option>
                                            { loadedGames.map(game => <option value={game.id} key={game.id}>{ game.shortName }</option>) }
                                        </Form.Select> 
                                    </InputGroup>
                                </Form.Group>

                                {
                                    selectedGame ? 
                                        <Form.Group className="mt-2">
                                            <Form.Label>Select team</Form.Label>
                                            <div className="text-center">
                                                <Form.Check type="radio" name="teamSelector" inline value={selectedGame.competitions[0].competitors[0].team.abbreviation} label={selectedGame.competitions[0].competitors[0].team.name} onClick={(e: any) => { setSelectedTeam(e.target.value) } } />
                                                <Form.Check type="radio" name="teamSelector" inline value={selectedGame.competitions[0].competitors[1].team.abbreviation} label={selectedGame.competitions[0].competitors[1].team.name} onClick={(e: any) => { setSelectedTeam(e.target.value) }} />
                                            </div>
                                        </Form.Group> : <div></div>
                                }

                                <Row className="mt-2">
                                    <Col>
                                        <Form.Group controlId="betInput">
                                            <Form.Label>Amount</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>$</InputGroup.Text>
                                                <Form.Control type="text" value={contractAmount} onChange={e => { setNum(e.target.value, setContractAmount) }} />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="oddsInput">
                                            <Form.Label>Odds</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>$</InputGroup.Text>
                                                <Form.Control type="text" value={contractOdds} onChange={(e => { setNum(e.target.value, setContractOdds) })} />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mt-2">
                                    <Form.Label>Total Value (inclusive)</Form.Label>
                                    <div className="text-center">${ new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format((parseFloat(contractAmount) || 0) * (parseFloat(contractOdds) || 0)) }</div>
                                </Form.Group>

                                <div className="mt-3 text-center">
                                    <Button type="submit">Create</Button>
                                </div>
                            </Form>
                        </div>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        </div>
    )
}