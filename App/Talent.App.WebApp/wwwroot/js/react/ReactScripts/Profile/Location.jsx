import React from 'react'
import Cookies from 'js-cookie'
import { default as Countries } from '../../../../util/jsonFiles/countries.json';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { countryOptions } from '../Employer/common';

export class Address extends React.Component {
    constructor(props) {
        super(props);

        const address = props.address ?
            Object.assign({}, props.address)
            : {
                number: "",
                street: "",
                suburb: "",
                postCode: 0,
                city: "",
                country: ""
            }
        this.state = {
            showEditSection: false,
            addressData: address
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleTextChange = this.handleTextChange.bind(this)
        this.handleCountryChange = this.handleCountryChange.bind(this)
        this.handleCityChange = this.handleCityChange.bind(this)
        this.saveAddress = this.saveAddress.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
    }

    openEdit() {
        const address = Object.assign({}, this.props.address)
        this.setState({
            showEditSection: true,
            addressData: address
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    handleTextChange(event) {
        const data = Object.assign({}, this.state.addressData)
        data[event.target.name] = event.target.value
        this.setState({
            addressData: data
        })
    }

    handleCountryChange(event) {
        const data = Object.assign({}, this.state.addressData)
        data[event.target.name] = event.target.value
        // Clear the city when the country changes
        data.city = ''
        this.setState({
            addressData: data
        })
    }

    handleCityChange(event) {
        const data = Object.assign({}, this.state.addressData)
        data[event.target.name] = event.target.value
        this.setState({
            addressData: data
        })
    }

    saveAddress() {
        const data = Object.assign({}, this.state.addressData);
        //console.log('Before save:', data)
        this.props.saveProfileData({ address: data });        
        this.setState({
            showEditSection: false,
            addressData: data,
        });
        //console.log('After save:', data)
    }

    renderEdit() {
        let countriesOptions = [];
        let citiesOptions = [];
        const selectedCountry = this.state.addressData.country;
        const selectedCity = this.state.addressData.city;

        countriesOptions = Object.keys(Countries).map((x) => (
            <option key={x} value={x}>
                {x}
            </option>
        ));

        if (selectedCountry !== '' && selectedCountry != null) {
            var popCities = Countries[selectedCountry].map((x) => (
                <option key={`${selectedCountry}-${x}`} value={x}>
                    {x}
                </option>
            ));

            citiesOptions = (
                <select className="five wide field"
                    className="ui dropdown"
                    placeholder="City"
                    value={selectedCity}
                    onChange={this.handleCityChange}
                    name="city"
                >
                    <option value="0">Select a town or city</option>
                    {popCities}
                </select>

            );
        }

        return (
            <div className="ui sixteen wide column">
                <div className="form-wrappper">
                    <div className="fields">
                        <div className="four wide field">
                            <ChildSingleInput
                                inputType="text"
                                label="Number"
                                name="number"
                                value={this.state.addressData.number}
                                maxLength={80}
                                controlFunc={this.handleTextChange}
                                placeholder="Enter your number"
                                errorMessage="Please enter a valid number"
                            />
                        </div>
                        <div className="eight wide field">
                            <ChildSingleInput
                                inputType="text"
                                label="Street"
                                name="street"
                                value={this.state.addressData.street}
                                maxLength={80}
                                controlFunc={this.handleTextChange}
                                placeholder="Enter your street"
                                errorMessage="Please enter a valid street"
                            />
                        </div>
                        <div className="four wide field">
                            <ChildSingleInput
                                inputType="text"
                                label="Suburb"
                                name="suburb"
                                value={this.state.addressData.suburb}
                                maxLength={80}
                                controlFunc={this.handleTextChange}
                                placeholder="Enter your suburb"
                                errorMessage="Please enter a valid suburb"
                            />
                        </div>
                    </div>
                    <div className="fields">
                        <div className="seven wide field">
                            <label style={{ fontSize: "13px", fontWeight: "bold", color: "black" }}>Country</label>
                            <select
                                className="ui right labeled dropdown"
                                placeholder="Country"
                                value={selectedCountry}
                                onChange={this.handleCountryChange}
                                name="country"
                            >
                                <option value="">Select a country</option>
                                {countriesOptions}
                            </select>
                        </div>
                        <div className="five wide field">
                            <label style={{ fontSize: "13px", fontWeight: "bold", color: "black" }}>City</label>
                            <div>{citiesOptions}</div>
                        </div>
                        <div className="four wide field">
                            <ChildSingleInput
                                inputType="number"
                                label="Post Code"
                                name="postCode"
                                value={this.state.addressData.postCode}
                                maxLength={80}
                                controlFunc={this.handleTextChange}
                                placeholder="Enter your post code"
                                errorMessage="Please enter a valid post code"
                            />
                        </div>
                    </div>
                </div>
                <br />
                <button type="button" className="ui teal button" onClick={this.saveAddress}>
                    Save
                </button>
                <button type="button" className="ui button" onClick={this.closeEdit}>
                    Cancel
                </button>
            </div>
        )
        console.log("city", this.state.addressData.city);
    }

    renderDisplay() {
        let number = this.props.address ? this.props.address.number : ""
        let street = this.props.address ? this.props.address.street : ""
        let suburb = this.props.address ? this.props.address.suburb : ""
        let country = this.props.address ? this.props.address.country : ""
        let city = this.props.address ? this.props.address.city : ""
        let postCode = this.props.address ? this.props.address.postCode : 0

        return (
            <div className="row">
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>
                            Address: {number}, {street}, {suburb}, {postCode}
                        </p>
                        <p>City: {city}</p>
                        <p>Country: {country}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>
                        Edit
                    </button>
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

export class Nationality extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showEditSection: false,
            nationality: ""
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveNationality = this.saveNationality.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
    }

    openEdit() {
        const { nationality } = this.props;
        this.setState({
            showEditSection: true,
            nationality: nationality || ""
        });
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    handleChange(event) {
        this.setState({
            nationality: event.target.value
        });
    }

    saveNationality() {
        const { nationality } = this.state;
        this.props.saveProfileData({ nationality });
        this.closeEdit();
    }

    renderEdit() {
        let countriesOptions = [];
        const { nationality } = this.state;

        countriesOptions = Object.keys(Countries).map((x) => (
            <option key={x} value={x}>
                {x}
            </option>
        ));

        return (          
            <div className="ui sixteen wide column">
                <div className="ui eight wide field">
                    <select
                        className="ui right labeled dropdown"
                        placeholder="Select nationality"
                        value={nationality}
                        onChange={this.handleChange}
                    >
                        <option value="">Select your nationality</option>
                        {countriesOptions}
                    </select>
                    <br />
                    <button type="button" className="ui teal button" onClick={this.saveNationality}>
                        Save
                    </button>
                    <button type="button" className="ui button" onClick={this.closeEdit}>
                        Cancel
                    </button>
                </div>
            </div>
        )
    }

    renderDisplay() {
        return (
            <div className="row">
                <div className="ui sixteen wide column">
                    <p>Nationality: {this.props.nationality}</p>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>
                        Edit
                    </button>
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