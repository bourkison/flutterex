import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CognitoData {
    username: string
    name: string
    surname: string
    dob: string
    email: string
}

interface UserState {
    loadingUser: boolean
    loggedIn: boolean
    docData: object | null
    cogData: CognitoData | null
}

const initialState: UserState = {
    loadingUser: true,
    loggedIn: false,
    docData: null,
    cogData: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<CognitoData>) => {
            state.loadingUser = false;
            state.loggedIn = true;
            state.cogData = action.payload;
            console.log("Set logged in!");
            // state.docData =
        },
        logoutUser: (state) => {
            state.loadingUser = false;
            state.loggedIn = false;
            state.cogData = null;
            state.docData = null;
        }
    }
});

export const { setUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;