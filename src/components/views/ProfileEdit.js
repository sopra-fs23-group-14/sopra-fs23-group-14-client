import { useEffect, useState } from 'react';
import { api } from 'helpers/api';
import { Spinner } from 'components/ui/Spinner';
import { Button } from 'components/ui/Button';
import { useHistory, useParams } from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";

const FormField = props => {
    return (
        <div className="login field">
            <label className="login label">
                {props.label}
            </label>
            <input
                type={props.type}
                className="login input"
                placeholder="enter here.."
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

const ProfileEdit = () => {
    // use react-router-dom's hook to access the history
    const history = useHistory();
    const { id } = useParams();

    const [user, setUser] = useState(null);

    const doSave = async () => {
        try {
            user.token = localStorage.getItem("token");
            const requestBody = JSON.stringify(user);
            console.log(requestBody);
            const response = await api.put('/users/' + user.id, requestBody);

            console.log(response);

            history.push(`/profile/`+id);
        } catch (error) {
            console.log(error);
            let status = error.response?.status;
            if (status === 400) {
                alert('Something is not valid, please try again');
            }
            if (status === 404) {
                alert('User is not found');
            }
            if (status === 500) {
                alert('Internal server error');
            }
            if (status === 401) {
                alert('Unauthorized');
            }
        }
    };


    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get('/users/' + id);

                setUser(response.data);

                console.log('request to:', response.request.responseURL);
                console.log('status code:', response.status);
                console.log('status text:', response.statusText);
                console.log('requested data:', response.data);

                console.log(response.data);
                if (localStorage.getItem("token") !== response.data.token) {
                    history.push("/overview");
                }

                // See here to get more data.
                console.log(response);
            } catch (error) {
                console.log(error);
                let status = error.response.status;
                if (status === 404) {
                    alert('User is not found');
                }
                if (status === 500) {
                    alert('Internal server error');
                }
                history.push("/overview")
            }
        }

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let content = <Spinner />;


    if (user) {
        content = (
            <div>
                <div className="login container">
                    <div className="login form" style={{height: "400px"}}>
                        <FormField
                            label="Username"
                            value={user.username}
                            onChange={un => setUser(user => ({
                                ...user,
                                username: un
                            }))}
                        />
                        <FormField
                            label="Name"
                            value={user.name}
                            onChange={un => setUser(user => ({
                                ...user,
                                name: un
                            }))}
                        />
                        <FormField
                            label="Birthday"
                            value={user.birthday}
                            onChange={b => setUser(user => ({
                                ...user,
                                birthday: b
                            }))}
                        />
                        <div className="login button-container">
                            <Button
                                width="100%"
                                onClick={() => doSave()}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="game">
                <BaseContainer>
                    {content}
                </BaseContainer>
            </div>
        </div>
    );
}

export default ProfileEdit;