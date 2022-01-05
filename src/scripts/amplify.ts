// AMPLIFY:
import Amplify from "aws-amplify";
import awsExports from "../aws-exports";

import store from "../store";
import { setUser } from "../store/slices/user/userSlice";

async function configureAmplify() {
    Amplify.configure(awsExports);
    console.log("AMPLIFY CONFIGURED");

    try {
        const user = await Amplify.Auth.currentSession();
        store.dispatch(setUser({
            username: user.idToken.payload['cognito:username'],
            name: user.idToken.payload.name,
            surname: user.idToken.payload.family_name,
            email: user.idToken.payload.email,
            dob: user.idToken.payload.birthdate
        }));
        
    }
    catch {
        console.log("No logged in user");
    }
}

export default configureAmplify 