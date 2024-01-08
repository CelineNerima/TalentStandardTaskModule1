import React from 'react';
import Cookies from 'js-cookie';
import { Form, Radio } from 'semantic-ui-react';

export default class TalentStatus extends React.Component {
    constructor(props) {
        super(props);

        const jobSeekingStatus = props.jobSeekingStatus || {
            status: "",
            availableDate: null
        };

        this.state = {
            statusData: jobSeekingStatus
        };

        this.handleChange = this.handleChange.bind(this);
        this.saveStatus = this.saveStatus.bind(this);
        this.renderRadio = this.renderRadio.bind(this);
        this.getStatusByLabel = this.getStatusByLabel.bind(this);
        this.renderDisplay = this.renderDisplay.bind(this);
    }

    componentDidUpdate(prevProps) {        
        // Check if the jobSeekingStatus prop has changed
        if (prevProps.jobSeekingStatus !== this.props.jobSeekingStatus) {
            //console.log('jobSeekingStatus has changed. Performing additional action...');

            // Update the state based on the new jobSeekingStatus
            this.setState({
                statusData: this.props.jobSeekingStatus || {
                    status: "",
                    availableDate: null
                }
            });
        }
    }

    handleChange(event, { value }) {
        this.setState(prevState => ({
            statusData: Object.assign({}, prevState.statusData, { status: value || "" })
        }));
    }

    saveStatus(event) {
        event.preventDefault();
        this.props.saveProfileData({ jobSeekingStatus: this.state.statusData });
    }

    getStatusByLabel(label) {
        switch (label) {
            case 'Actively looking for a job':
                return 'activelyLooking';
            case 'Not looking for a job at the moment':
                return 'notLooking';
            case 'Currently employed but open to offers':
                return 'currentlyEmployed';
            case 'Will be available on a later date':
                return 'willBeAvailable';
            default:
                return label;
        }
    }

    renderRadio(label, value) {
        const { statusData } = this.state;
        return (
            <Form.Field key={value}>
                <Radio
                    label={label}
                    name="status"
                    value={value}
                    checked={statusData.status === value}
                    onChange={this.handleChange}
                />
            </Form.Field>
        );
    }

    renderDisplay() {
        const radioOptions = ['Actively looking for a job', 'Not looking for a job at the moment', 'Currently employed but open to offers', 'Will be available on a later date'];

        return (
            <div className="row">
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <label style={{ fontSize: "13px", fontWeight: "bold", color: "black", marginBottom: "5px" }}>Current Status</label>
                        {radioOptions.map((label) => (
                            this.renderRadio(label, this.getStatusByLabel(label))
                        ))}
                        <button className="ui teal right floated button" onClick={this.saveStatus}>Save</button>
                    </React.Fragment>
                </div>
            </div>
        );
    }

    render() {
        return this.renderDisplay();  
    }
}