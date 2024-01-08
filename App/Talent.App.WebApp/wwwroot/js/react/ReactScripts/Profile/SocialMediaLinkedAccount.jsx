/* Social media JSX */
import React from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { Popup } from 'semantic-ui-react';

export default class SocialMediaLinkedAccount extends React.Component {
    constructor(props) {
        super(props);

        const linkedAccounts = props.linkedAccounts ?
            Object.assign({}, props.linkedAccounts)
            : {
                linkedIn: "",
                github: ""
            }

        this.state = {
            showEditSection: false,
            links: linkedAccounts
        }
        
        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveLinkedAccounts = this.saveLinkedAccounts.bind(this)
        this.handleButtonClick = this.handleButtonClick.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
    }

    componentDidMount() {
        $('.ui.button.social-media')
            .popup();
    }
    
    openEdit() {
        const linkedAccounts = Object.assign({}, this.props.linkedAccounts)
        this.setState({
            showEditSection: true,
            links: linkedAccounts
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.links)
        data[event.target.name] = event.target.value
        this.setState({
            links: data
        })
    }

    saveLinkedAccounts() {
        const data = Object.assign({}, this.state.links);
        // console.log('Before save:', this.state.links);
        this.props.saveProfileData({ linkedAccounts: data });
        this.setState({
            showEditSection: false,
            links: data,
        });
        // console.log('After save:', this.state.links);
    }
    
    //Get link and Go to webpage
    handleButtonClick(link) {
        window.open(link, '_blank');
    }

    renderEdit() { 
        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    label="LinkedIn"
                    name="linkedIn"
                    value={this.state.links.linkedIn}
                    maxLength={120}
                    controlFunc={this.handleChange}
                    placeholder="Enter your LinkedIn Url"
                    errorMessage="Please enter a valid link"
                />
                <ChildSingleInput
                    inputType="text"
                    label="GitHub"
                    name="github"
                    value={this.state.links.github}
                    maxLength={120}
                    controlFunc={this.handleChange}
                    placeholder="Enter your GitHub Url"
                    errorMessage="Please enter a valid link"
                />
                
                <button type="button" className="ui teal button" onClick={this.saveLinkedAccounts}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        )
    }

    renderDisplay() {
        let linkedIn = this.props.linkedAccounts ? this.props.linkedAccounts.linkedIn : ""
        let github = this.props.linkedAccounts ? this.props.linkedAccounts.github : ""

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <button type="button" className="ui blue button social-media"
                            style={{ marginRight: "24px" }}
                            onClick={() => this.handleButtonClick(linkedIn)}><FaLinkedinIn /> LinkedIn </button>
                        <button type="button" className="ui teal button social-media"
                            onClick={() => this.handleButtonClick(github)}><FaGithub /> Github </button>
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