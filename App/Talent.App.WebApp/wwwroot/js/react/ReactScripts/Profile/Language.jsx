/* Language section */
import React from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';

export default class Language extends React.Component {
    constructor(props) {
        super(props);

        const languages = props.languages ? [...props.languages] : [];

        this.state = {
            showEditSection: false,
            showUpdateSection: false,
            languageData: languages,
            newLanguage: {
                name: "",
                level: ""
            },
            editingLanguageId: null
        };

        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.editLanguage = this.editLanguage.bind(this);
        this.deleteLanguage = this.deleteLanguage.bind(this);
        this.saveLanguage = this.saveLanguage.bind(this);
        this.renderUpdate = this.renderUpdate.bind(this);
        this.renderEdit = this.renderEdit.bind(this);
        this.renderDisplay = this.renderDisplay.bind(this);
    }

    openEdit(event) {
        event.preventDefault();
        const languages = Object.assign([], this.props.languages);
        this.setState({
            showEditSection: true,
            showUpdateSection: false,
            languageData: languages,
            editingLanguageId: null
        });
    }

    closeEdit() {
        this.setState({
            showEditSection: false,
            showUpdateSection: false
        });
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState((prevState) => ({
            newLanguage: Object.assign({}, prevState.newLanguage, { [name]: value })
        }));
    }

    editLanguage(languageId) {
        const { languageData } = this.state;
        const languageToEdit = languageData.find(language => language.id === languageId);

        if (!languageToEdit) {
            return;
        }

        this.setState({
            showEditSection: false,
            showUpdateSection: true,
            newLanguage: {
                name: languageToEdit.name,
                level: languageToEdit.level
            },
            editingLanguageId: languageId
        });
    }

    deleteLanguage(languageId) {
        this.setState(prevState => {
            const updatedLanguages = prevState.languageData.filter(language => language.id !== languageId);
            this.props.saveProfileData({ languages: updatedLanguages });
            return { languageData: updatedLanguages };
        });
    }

    saveLanguage() {
        const { languageData, newLanguage, editingLanguageId } = this.state;

        if (!newLanguage.name || !newLanguage.level) {
            return;
        }

        if (editingLanguageId !== null) {
            // If editing, update the existing language
            const updatedLanguages = languageData.map(language => {
                if (language.id === editingLanguageId) {
                    return Object.assign({}, language, newLanguage);
                }
                return language;
            });

            this.props.saveProfileData({ languages: updatedLanguages });

            this.setState({
                languageData: updatedLanguages,
                showEditSection: false,
                showUpdateSection: false, 
                newLanguage: Object.assign({}, { name: "", level: "" }),
                editingLanguageId: null
            });
        } else {
            // If adding a new language
            const updatedLanguages = [...languageData, Object.assign({}, newLanguage)];

            this.props.saveProfileData({ languages: updatedLanguages });

            this.setState({
                languageData: updatedLanguages,
                showEditSection: false,
                showUpdateSection: false,
                newLanguage: Object.assign({}, { name: "", level: "" }),
                editingLanguageId: null
            });
        }
    }

    renderUpdate() {
        const { newLanguage } = this.state;
        const languageLevels = ['Language Level', 'Basic', 'Conversational', 'Fluent', 'Native/Bilingual'];

        return (
            <div className="form-wrapper">
                <div className="fields">
                    <div className="five wide field">
                        <ChildSingleInput
                            inputType="text"
                            name="name"
                            value={newLanguage.name}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Add Language"
                            errorMessage="Please enter a valid name"
                        />
                    </div>
                    <div className="five wide field">
                        <select style={{ marginBottom: "5px", marginTop: "5px" }}
                            className="ui dropdown"
                            name="level"
                            value={newLanguage.level}
                            onChange={this.handleChange}
                        >
                            {languageLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>
                    <div className="six wide field" style={{ marginBottom: "5px", marginTop: "5px" }}>
                        <button className="ui basic blue prompt button" onClick={this.saveLanguage}>Update</button>
                        <button className="ui basic red prompt button" onClick={this.closeEdit}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }

    renderEdit() {
        const { newLanguage } = this.state;
        const languageLevels = ['Language Level', 'Basic', 'Conversational', 'Fluent', 'Native/Bilingual'];

        return (
            <div className="form-wrapper">
                <div className="fields">
                    <div className="five wide field">
                        <ChildSingleInput
                            inputType="text"
                            name="name"
                            value={newLanguage.name}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Add Language"
                            errorMessage="Please enter a valid name"
                        />
                    </div>
                    <div className="five wide field">
                        <select style={{ marginBottom: "5px", marginTop: "5px" }}
                            className="ui dropdown"
                            name="level"
                            value={newLanguage.level}
                            onChange={this.handleChange}
                        >
                            {languageLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>
                    <div className="six wide field" style={{ marginBottom: "5px", marginTop: "5px" }}>
                        <button className="ui teal button" onClick={this.saveLanguage}>Add</button>
                        <button className="ui button" onClick={this.closeEdit}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }

    renderDisplay() {
        const { languages } = this.props;

        return (
            <div className="row">
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <table className="ui fixed table">
                            <thead className="ui basic">
                                <tr>
                                    <th>Language</th>
                                    <th>Level</th>
                                    <th>
                                        <button className="ui teal button right floated" onClick={this.openEdit}>
                                            <i className="add icon"></i>Add New
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {languages.map((language, id) =>
                                    <tr key={id}>
                                        <td>{language.name}</td>
                                        <td>{language.level}</td>
                                        <td className="right aligned">
                                            <span className="button" onClick={() => this.editLanguage(language.id)}>
                                                <i className="outline write icon"></i>
                                            </span>
                                            &nbsp;&nbsp;
                                            <span className="button" onClick={() => this.deleteLanguage(language.id)}>
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