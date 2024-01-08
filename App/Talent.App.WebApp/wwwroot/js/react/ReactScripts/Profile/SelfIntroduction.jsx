/* Self introduction section */
import React, { Component } from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import Cookies from 'js-cookie';

export default class SelfIntroduction extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showEditSection: false,
            summary: "",
            description: ""
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveIntroduction = this.saveIntroduction.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
    }

    openEdit() {
        const { summary, description } = this.props;
        this.setState({
            showEditSection: true,
            summary: summary || "",
            description: description || ""
        });
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    handleChange(event) {         
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    saveIntroduction() {  
        const { summary, description } = this.state;
        console.log(summary)
        console.log(description)
        this.props.saveProfileData({ summary, description });
        this.closeEdit();
    }

    renderEdit() {
        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    name="summary"
                    value={this.state.summary}
                    controlFunc={this.handleChange}
                    maxLength={150}
                    placeholder="Please provide a short summary about yourself"
                    errorMessage="Summary must be no more tham 150 characters"
                />
               
                <div className="field">
                    <textarea
                        name="description"
                        value={this.state.description}
                        onChange={this.handleChange}
                        minLength={150}
                        maxLength={600}
                        placeholder="Please tell us about any hobies, additional expertise, or anything else you'd like to add."
                        //errorMessage="Description must be between 150-600 characters"
                    >
                    </textarea>
                </div>

                <button type="button" className="ui teal button" onClick={this.saveIntroduction}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        )
    }

    renderDisplay() {
        const { summary, description } = this.props;

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Summary: <br/> {summary}</p>
                        <p>Description: <br/> {description}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>
        )
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }
}


