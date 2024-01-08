/* Experience section */
import React from 'react';
import Cookies from 'js-cookie';
import DatePicker from 'react-datepicker';
import { ChildSingleInput } from '../Form/SingleInput.jsx';

export default class Experience extends React.Component {
    constructor(props) {
        super(props);

        // Convert to a JSON string and then parse it back into a new experience object
        const experience = props.experience ? JSON.parse(JSON.stringify(props.experience)) : [];
        
        this.state = {
            showEditSection: false,
            showUpdateSection: false,
            experienceData: experience,
            newExperience: {
                company: "",
                responsibilities: "",
                position: "",
                start: new Date(),
                end: new Date(),
            },
            editingExperienceId: null
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleTextChange = this.handleTextChange.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.formatDate = this.formatDate.bind(this)
        this.editExperience = this.editExperience.bind(this)
        this.deleteExperience = this.deleteExperience.bind(this)
        this.saveExperience = this.saveExperience.bind(this)
        this.renderUpdate = this.renderUpdate.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
    }

    openEdit(event) {
        event.preventDefault();
        const experience = Object.assign([], this.props.experience)
        this.setState({
            showEditSection: true,
            showUpdateSection: false,
            experienceData: experience,
            editingExperienceId: null
        });
    }

    closeEdit() {
        this.setState({
            showEditSection: false,
            showUpdateSection: false
        })
    }

    handleTextChange(event) {
        const { name, value } = event.target;
        this.setState((prevState) => ({
            newExperience: Object.assign({}, prevState.newExperience, { [name]: value })
        }));
    }

    handleDateChange(range) {
        const [startDate, endDate] = range;
        this.setState((prevState) => ({
            newExperience: Object.assign({}, prevState.newExperience, {
                start: startDate,
                end: endDate
            })
        }));
    }

    // Utility function to format a date as "27th Aug, 2018"
    formatDate(date) {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

        const day = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(date);
        const daySuffix = (day) => {
            if (day >= 11 && day <= 13) {
                return 'th';
            }
            switch (day % 10) {
                case 1:
                    return 'st';
                case 2:
                    return 'nd';
                case 3:
                    return 'rd';
                default:
                    return 'th';
            }
        };

        return `${day}${daySuffix(day)} ${formattedDate}`;
    };

    editExperience(experienceId) {
        const { experienceData } = this.state;
        const experienceToEdit = experienceData.find(experience => experience.id === experienceId);

        if (!experienceToEdit) {
            return;
        }

        this.setState({
            showEditSection: false,
            showUpdateSection: true,
            newExperience: {
                company: experienceToEdit.company,
                responsibilities: experienceToEdit.responsibilities,
                position: experienceToEdit.position,
                start: experienceToEdit.start,
                end: experienceToEdit.end
            },
            editingExperienceId: experienceId
        });
    }

    deleteExperience(experienceId) {
        const { experienceData } = this.state;

        const updatedExperience = experienceData.filter(experience => experience.id !== experienceId);

        this.props.saveProfileData({ experience: updatedExperience });

        this.setState({
            experienceData: updatedExperience,
        });
    }

    saveExperience() {
        const { experienceData, newExperience, editingExperienceId } = this.state;

        if (editingExperienceId !== null) {
            // If editing
            const updatedExperience = experienceData.map(experience => {
                if (experience.id === editingExperienceId) {
                    return Object.assign({}, experience, newExperience);
                }
                return experience;
            });
 
            this.props.saveProfileData({ experience: updatedExperience });

            this.setState({
                showEditSection: false,
                showUpdateSection: false,
                newExperience: {
                    company: "",
                    responsibilities: "",
                    position: "",
                    start: new Date(), 
                    end: new Date(),   
                },
                editingExperienceId: null
            });
        } else {
            // If adding 
            const updatedExperience = [...experienceData, Object.assign({}, newExperience)];

            this.props.saveProfileData({ experience: updatedExperience });

            this.setState({
                showEditSection: false,
                showUpdateSection: false,
                newExperience: {
                    company: "",
                    responsibilities: "",
                    position: "",
                    start: new Date(), 
                    end: new Date(),   
                },
                editingExperienceId: null
            });
        }
    }

    renderEdit() {
        const { newExperience } = this.state;

        return (
            <div className="form-wrappper">
                <div className="fields">
                    <div className="eight wide field">
                        <ChildSingleInput
                            inputType="text"
                            label="Company:"
                            name="company"
                            value={newExperience.company}
                            controlFunc={this.handleTextChange}
                            maxLength={80}
                            placeholder="Company"
                            errorMessage="Please enter a valid text"
                        />
                    </div>
                    <div className="eight wide field">
                        <ChildSingleInput
                            inputType="text"
                            label="Position:"
                            name="position"
                            value={newExperience.position}
                            controlFunc={this.handleTextChange}
                            maxLength={80}
                            placeholder="Position"
                            errorMessage="Please enter valid text"
                        />
                    </div>
                </div>
                <div className="fields">
                    <div className="eight wide field">
                        <DatePicker
                            selected={newExperience.start}
                            onChange={(date) => this.handleDateChange([date, newExperience.end])}
                        />
                    </div>
                    <div className="eight wide field">
                        <DatePicker
                            selected={newExperience.end}
                            onChange={(date) => this.handleDateChange([newExperience.start, date])}
                        />
                    </div>
                </div>
                <div className="sixteen wide field">
                    <ChildSingleInput
                        inputType="text"
                        label="Responsibilities:"
                        name="responsibilities"
                        value={newExperience.responsibilities}
                        controlFunc={this.handleTextChange}
                        maxLength={120}
                        placeholder="Responsibilities"
                        errorMessage="Please enter valid text"
                    />
                </div>
                <div className="six wide field" style={{ marginBottom: "5px", marginTop: "5px" }}>
                    <button className="ui teal button" onClick={this.saveExperience}>
                        Add
                    </button>
                    <button className="ui button" onClick={this.closeEdit}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    renderUpdate() {
        const { newExperience } = this.state;

        return (
            <div className="form-wrappper">
                <div className="fields">
                    <div className="eight wide field">
                        <ChildSingleInput
                            inputType="text"
                            name="company"
                            value={newExperience.company}
                            controlFunc={this.handleTextChange}
                            maxLength={80}
                            placeholder="Company"
                            errorMessage="Please enter a valid text"
                        />
                    </div>
                    <div className="eight wide field">
                        <ChildSingleInput
                            inputType="text"
                            name="position"
                            value={newExperience.position}
                            controlFunc={this.handleTextChange}
                            maxLength={80}
                            placeholder="Position"
                            errorMessage="Please enter valid text"
                        />
                    </div>
                </div>
                <div className="fields">
                    <div className="eight wide field">
                        <DatePicker
                            selected={newExperience.start}
                            onChange={(date) => this.handleDateChange([date, newExperience.end])}
                        />
                    </div>
                    <div className="eight wide field">
                        <DatePicker
                            selected={newExperience.end}
                            onChange={(date) => this.handleDateChange([newExperience.start, date])}
                        />
                    </div>
                </div>
                <div className="sixteen wide field">
                    <ChildSingleInput
                        inputType="text"
                        name="responsibilities"
                        value={newExperience.responsibilities}
                        controlFunc={this.handleTextChange}
                        maxLength={120}
                        placeholder="Responsibilities"
                        errorMessage="Please enter valid text"
                    />
                </div>
                <div className="six wide field" style={{ marginBottom: "5px", marginTop: "5px" }}>
                    <button className="ui teal button" onClick={this.saveExperience}>
                        Update
                    </button>
                    <button className="ui button" onClick={this.closeEdit}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    renderDisplay() {
        const { experience } = this.props;

        return (
            <div className="row">
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <table className="ui fixed table">
                            <thead className="ui basic">
                                <tr>
                                    <th>Company</th>
                                    <th>Position</th>
                                    <th>Responsibilites</th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>
                                        <button className="ui teal button right floated" onClick={this.openEdit}>
                                            <i className="add icon"></i>Add New
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {experience.map((experience, id) =>
                                    <tr key={id}>
                                        <td>{experience.company}</td>
                                        <td>{experience.position}</td>
                                        <td>{experience.responsibilities}</td>
                                        <td>{this.formatDate(new Date(experience.start))}</td>
                                        <td>{this.formatDate(new Date(experience.end))}</td>
                                        <td className="right aligned">
                                            <span className="button" onClick={() => this.editExperience(experience.id)}>
                                                <i className="outline write icon"></i>
                                            </span>
                                            &nbsp;&nbsp;
                                            <span className="button" onClick={() => this.deleteExperience(experience.id)}>
                                                <i className="remove icon"></i>
                                            </span>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </React.Fragment>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="row">
                <div className="ui sixteen wide column">
                    {this.state.showEditSection && this.renderEdit()}
                    {this.renderDisplay()}
                    {this.state.showUpdateSection && this.renderUpdate()}
                </div>
            </div>
        );
    }
}
