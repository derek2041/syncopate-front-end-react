import React, { useState, useEffect } from "react";
import { Loader, Message } from "semantic-ui-react";
import mainLogo from "./images/1x/Asset 22.png";

const ConfirmAccount = () => {
    const [isConfirmed, setIsConfirmed] = useState(undefined);

    useEffect(() => {
        async function confirmAccountToken() {
            const token = window.location.href.substring(window.location.href.lastIndexOf());

            const response = await fetch(
                `http://18.219.112.140:8000/regConfirmed/?token=${token}`,
                { method: "GET" }
            );

            const result = await response.json();
            
            if (result.status !== "success") {
                setIsConfirmed(null);
            } else {
                setIsConfirmed(true);
            }
        }

        confirmAccountToken();
    }, []);

    if (isConfirmed === undefined) {
        return (
            <div>
                <div style={{ paddingTop: "40vh", height: "calc(100vh - 65px)" }}>
                    <Loader size="huge" active inline="centered"></Loader>
                </div>
            </div>
        );
    }

    if (isConfirmed === null) {
        return (
            <div>
                <Message 
                    error
                    header="There was an issue confirming registration of your Syncopate account. This could be because of multiple reasons."
                    list={[
                        "This account has already been successfully confirmed and can already login.",
                        "Check to make sure that you clicked the correct confirmation link sent to you during registration.",
                        "The provided confirmation link has expired and you need to request a new confirmation link to be sent to your Purdue email address."
                    ]}
                />
            </div>
        )
    }

    if (isConfirmed === true) {
        return (
            <div>
                <Message 
                    positive
                    header="Thank you for confirming your Syncopate account!"
                    list={[
                        "You may now login to the platform and begin connecting with other students!",
                        "To start, we recommend customizing your profile and getting things setup as soon as possible.",
                        "Remember, if you ever lose access to your Syncopate account, you can use the password reset page to regain access."
                    ]}
                />
            </div>
        );
    }
};

export default ConfirmAccount;
