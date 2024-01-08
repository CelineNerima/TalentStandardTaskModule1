/* Education section */
import React from 'react';
import Cookies from 'js-cookie';
import { default as Countries } from '../../../../../wwwroot/util/jsonFiles/countries.json'
import { ChildSingleInput } from '../Form/SingleInput.jsx';

export default class Education extends React.Component {
    constructor(props) {
        super(props)

        const education = props.education ? JSON.parse(JSON.stringify(props.education)) : [];

        this.state = {
            showEditSection: false,
            showUpdateSection: false,
            educationData: education,
            newEducation: {
                country: "",
                instituteName: "",
                title: "",
                degree: "",
                yearOfGraduation: 0
            },
            editingEducationId: null
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.editEducation = this.editEducation.bind(this)
        this.deleteEducation = this.deleteEducation.bind(this)
        this.saveEducation = this.saveEducation.bind(this)
        this.renderUpdate = this.renderUpdate.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
    }

    openEdit(event) {
        event.preventDefault();
        const education = Object.assign([], this.props.education)
        this.setState({
            showEditSection: true,
            showUpdateSection: false,
            educationData: education,
            editingEducationId: null
        });
    }

    closeEdit() {
        this.setState({
            showEditSection: false,
            showUpdateSection: false
        })
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState((prevState) => ({
            newEducation: Object.assign({}, prevState.newEducation, { [name]: value })
        }));
    }

    editEducation(educationId) {
        const { educationData } = this.state;
        const educationToEdit = educationData.find(education => education.id === educationId);

        if (!educationToEdit) {
            return;
        }

        this.setState({
            showEditSection: false,
            showUpdateSection: true,
            newEducation: {
                country: educationToEdit.country,
                instituteName: educationToEdit.instituteName,
                title: educationToEdit.title,
                degree: educationToEdit.degree,
                yearOfGraduation: educationToEdit.yearOfGraduation
            },
            editingEducationId: educationId
        });

    }

    deleteEducation(educationId) {
        const { educationData } = this.state;

        const updatedEducation = educationData.filter(education => education.id !== educationId);

        this.props.saveProfileData({ education: updatedEducation });

        this.setState({
            educationData: updatedEducation,
        });
    }

    saveEducation() {
        const { educationData, newEducation, editingEducationId } = this.state;

        if (editingEducationId !== null) {
            // If editing
            const updatedEducation = educationData.map(education => {
                if (education.id === editingEducationId) {
                    return Object.assign({}, education, newEducation);
                }
                return education;
            });

            this.props.saveProfileData({ education: updatedEducation });

            this.setState({
                showEditSection: false,
                showUpdateSection: true,
                educationData: updatedEducation,
                newEducation: {
                    country: "",
                    instituteName: "",
                    title: "",
                    degree: "",
                    yearOfGraduation: 0
                },
                editingEducationId: null
            });
        } else {
            // If adding 
            const updatedEducation = [...educationData, Object.assign({}, newEducation)];

            this.props.saveProfileData({ education: updatedEducation });

            this.setState({
                showEditSection: false,
                showUpdateSection: false,
                educationData: updatedEducation,
                newEducation: {
                    country: "",
                    instituteName: "",
                    title: "",
                    degree: "",
                    yearOfGraduation: 0
                },
                editingEducationId: null
            });
        }
    }

    renderEdit() {
        const { newEducation } = this.state;

        const currentYear = new Date().getFullYear();
        const yearOptions = Array.from({ length: currentYear - 1949 }, (_, index) => currentYear - index);

        let titleOptions = ['CH', 'A.A./A.S.', ' B.A./B.S', 'M.A./M.S', 'Ph.D.', 'MBA',
            'M.Sc.', 'B.E.', 'B.Sc.', 'CISSP', ' CPM', 'CEng', 'IEEE Fellow', 'PC'];

        let countriesOptions = [];
        countriesOptions = Object.keys(Countries).map((x) => (
            <option key={x} value={x}>
                {x}
            </option>
        ));

        return (
            <div className="form-wrappper">
                <div className="fields">
                    <div className="ten wide field">
                        <ChildSingleInput
                            inputType="text"
                            name="instituteName"
                            value={newEducation.instituteName}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="College/University/Name"
                            errorMessage="Please enter a valid text"
                        />
                    </div>
                    <div className="six wide field">
                        <select
                            style={{ marginBottom: "5px", marginTop: "5px" }}
                            className="ui dropdown"
                            name="country"
                            value={newEducation.country}
                            onChange={this.handleChange}
                        >
                            <option value="">Country of Institute</option>
                            {countriesOptions}
                        </select>
                    </div>
                </div>
                <div className="fields">
                    <div className="six wide field">
                        <select
                            style={{ marginBottom: "5px", marginTop: "5px" }}
                            className="ui dropdown yearpicker form-control"
                            name="title"
                            value={newEducation.title}
                            onChange={this.handleChange}
                        >
                            <option value="">Title</option>
                            {titleOptions.map(title => (
                                <option key={title} value={title}>
                                    {title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="six wide field">
                        <ChildSingleInput
                            inputType="text"
                            name="degree"
                            value={newEducation.degree}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Degree"
                            errorMessage="Please enter a valid text"
                        />
                    </div>
                    <div className="four wide field">
                        <select
                            style={{ marginBottom: "5px", marginTop: "5px" }}
                            className="ui dropdown"
                            name="yearOfGraduation"
                            value={newEducation.yearOfGraduation}
                            onChange={this.handleChange}
                        >
                            <option value="">Year of Graduation</option>
                            {yearOptions.map(year => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="six wide field" style={{ marginBottom: "5px", marginTop: "5px" }}>
                    <button className="ui teal button" onClick={this.saveEducation}>
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
        const { newEducation } = this.state;

        const currentYear = new Date().getFullYear();
        const yearOptions = Array.from({ length: currentYear - 1949 }, (_, index) => currentYear - index);

        let titleOptions = ['CH', 'A.A./A.S.', ' B.A./B.S', 'M.A./M.S', 'Ph.D.', 'MBA',
            'M.Sc.', 'B.E.', 'B.Sc.', 'CISSP', ' CPM', 'CEng', 'IEEE Fellow', 'PC'];

        let countriesOptions = [];
        countriesOptions = Object.keys(Countries).map((x) => (
            <option key={x} value={x}>
                {x}
            </option>
        ));

        return (
            <div className="form-wrappper">
                <div className="fields">
                    <div className="ten wide field">
                        <ChildSingleInput
                            inputType="text"
                            name="instituteName"
                            value={newEducation.instituteName}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="College/University/Name"
                            errorMessage="Please enter a valid text"
                        />
                    </div>
                    <div className="six wide field">
                        <select
                            style={{ marginBottom: "5px", marginTop: "5px" }}
                            className="ui dropdown"
                            name="country"
                            value={newEducation.country}
                            onChange={this.handleChange}
                        >
                            <option value="">Country of Institute</option>
                            {countriesOptions}
                        </select>
                    </div>
                </div>
                <div className="fields">
                    <div className="six wide field">
                        <select
                            style={{ marginBottom: "5px", marginTop: "5px" }}
                            className="ui dropdown"
                            name="title"
                            value={newEducation.title}
                            onChange={this.handleChange}
                        >
                            <option value="">Title</option>
                            {titleOptions.map(title => (
                                <option key={title} value={title}>
                                    {title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="six wide field">
                        <ChildSingleInput
                            inputType="text"
                            name="degree"
                            value={newEducation.degree}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Degree"
                            errorMessage="Please enter a valid text"
                        />
                    </div>
                    <div className="four wide field">
                        <select
                            style={{ marginBottom: "5px", marginTop: "5px" }}
                            className="ui dropdown"
                            name="yearOfGraduation"
                            value={newEducation.yearOfGraduation}
                            onChange={this.handleChange}
                        >
                            <option value="">Year of Graduation</option>
                            {yearOptions.map(year => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="six wide field" style={{ marginBottom: "5px", marginTop: "5px" }}>
                    <button className="ui teal button" onClick={this.saveEducation}>
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
        const { education } = this.props;

        return (
            <div className="row">
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <table className="ui fixed table">
                            <thead className="ui basic">
                                <tr>
                                    <th>Country</th>
                                    <th>University</th>
                                    <th>Title</th>
                                    <th>Degree</th>
                                    <th>Graduation Year</th>
                                    <th>
                                        <button className="ui teal button right floated" onClick={this.openEdit}>
                                            <i className="add icon"></i>Add New
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {education.map((item, id) =>
                                    <tr key={id}>
                                        <td>{item.country}</td>
                                        <td>{item.instituteName}</td>
                                        <td>{item.title}</td>
                                        <td>{item.degree}</td>
                                        <td>{item.yearOfGraduation}</td>
                                        <td className="right aligned">
                                            <span className="button" onClick={() => this.editEducation(item.id)}>
                                                <i className="outline write icon"></i>
                                            </span>
                                            &nbsp;&nbsp;
                                            <span className="button" onClick={() => this.deleteEducation(item.id)}>
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