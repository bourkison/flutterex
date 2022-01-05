import React from "react";
import { API } from "aws-amplify"
import { fetchJwtToken } from "../../../../scripts/amplify";
import dayjs from "dayjs";

import Container from "react-bootstrap/Container"
import Spinner from "react-bootstrap/Spinner"

interface NBAFeedProps {}
interface NBAFeedState {
    isLoading: boolean
}

class NBAFeed extends React.Component<NBAFeedProps, NBAFeedState> {
    constructor (props: NBAFeedProps) {
        super(props);
        this.state = {
            isLoading: true
        }
    }

    async componentDidMount() {
        try {
            const apiName: string = "flutterexapi";
            const path: string = "/games";
            const myInit: object = {
                headers: {
                    Authorization: await fetchJwtToken()
                },
                queryStringParameters: {
                    date: dayjs().format("YYYY-MM-DD")
                }
            }

            const response = await API.get(apiName, path, myInit);
            console.log("RESPONSE:", response);
        }
        catch (err) {
            console.error(err);
        }
        finally { 
            this.setState({ isLoading: false });
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <Container className="text-center mt-2">
                    <Spinner animation="border" />
                </Container>
            )
        }
        return (
            <div>NBA FEED HERE.</div>
        )
    }
}

export default NBAFeed