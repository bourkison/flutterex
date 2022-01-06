import React from "react";
import { API } from "aws-amplify"
import { fetchJwtToken } from "../../../../scripts/amplify";
import dayjs from "dayjs";

import NBAGameComponent from "../NBAGameComponent";

import Container from "react-bootstrap/Container"
import Spinner from "react-bootstrap/Spinner"
import Form from "react-bootstrap/Form";

interface NBAFeedProps {}
interface NBAFeedState {
    isLoading: boolean
    games: Array<object>
    selectedDate: string
}

class NBAFeed extends React.Component<NBAFeedProps, NBAFeedState> {
    constructor (props: NBAFeedProps) {
        super(props);
        this.state = {
            isLoading: true,
            games: [],
            selectedDate: dayjs().format("YYYY-MM-DD")
        }
        this.pullData = this.pullData.bind(this);
        this.updateDate = this.updateDate.bind(this);
    }

    componentDidMount() {
        this.pullData();
    }

    async pullData() {
        this.setState({ games: [], isLoading: true });

        try {
            const apiName: string = "flutterexapi";
            const path: string = "/games";
            const myInit: object = {
                headers: {
                    Authorization: await fetchJwtToken()
                },
                queryStringParameters: {
                    date: this.state.selectedDate
                }
            }

            const response = await API.get(apiName, path, myInit);
            this.setState({ games: response.data });
            console.log("RESPONSE:", response);
        }
        catch (err) {
            console.error(err);
        }
        finally { 
            this.setState({ isLoading: false });
        }
    }

    updateDate(e: any) {
        this.setState({ selectedDate: dayjs(e.target.value).format("YYYY-MM-DD") });
        this.pullData();
    }

    render() {
        let formContent: JSX.Element;
        if (this.state.isLoading) {
            formContent = (
                <Container className="text-center mt-2">
                    <Spinner animation="border" />
                </Container>
            )
        } else if (this.state.games.length) {
            formContent = (
                <div className="mb-4">
                    { this.state.games.map(game => <div className="mt-4"><NBAGameComponent game={game} /></div> ) }
                </div>
            );
        } else {
            formContent = (
                <div className="mt-4">No games.</div>
            )
        }

        return (
            <div className="nbaFeedCont">
                <Container>
                    <div>
                        <Form.Group controlId="selectedDateInput">
                            <Form.Label className="text-left">Date</Form.Label>
                            <Form.Control value={ this.state.selectedDate } type="date" onChange={this.updateDate} size="sm" />
                        </Form.Group>
                    </div>
                    { formContent }
                </Container>
            </div>
        )
    }
}

export default NBAFeed