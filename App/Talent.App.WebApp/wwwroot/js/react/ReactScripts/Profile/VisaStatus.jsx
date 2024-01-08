import React from 'react';
import Cookies from 'js-cookie';
import { SingleInput } from '../Form/SingleInput.jsx';
import DatePicker from 'react-datepicker';

export default class VisaStatus extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showEditSection: false,
            visaStatus: '',
            visaExpiryDate: null
        };

        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.saveVisaStatus = this.saveVisaStatus.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.renderEdit = this.renderEdit.bind(this);
        this.renderDisplay = this.renderDisplay.bind(this);
    }

    openEdit() {
        const { visaStatus, visaExpiryDate } = this.props;
        // Check if visaExpiryDate is a valid Date object
        const isValidDate = visaExpiryDate instanceof Date && !isNaN(visaExpiryDate.getTime());

        this.setState({
            showEditSection: true,
            visaStatus: visaStatus || '',
            visaExpiryDate: isValidDate ? visaExpiryDate : null
        });
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        });
    }

    handleChange(event) {
        this.setState({
            visaStatus: event.target.value
        });
    }

    handleDateChange(date) {
        //Chcek if date is valid
        this.setState({
            visaExpiryDate: isNaN(date.getTime()) ? null : date
        });
    }


    // Utility function to format a date as "27th Aug, 2018"
    formatDate(date) {
        if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
            return 'N/A';
        }

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
    }

    saveVisaStatus() {
        const { visaStatus, visaExpiryDate } = this.state;
        this.props.saveProfileData({ visaStatus, visaExpiryDate });
        this.closeEdit();
    }

    renderEdit() {
        const visaOptions = ['Citizen', 'Permanent Resident', 'Resident', 'Work Visa', 'Student Visa'];
        const { visaStatus, visaExpiryDate } = this.state;

        // Check if selected visa type is Citizen or Permanent Resident
        const hideVisaExpiryDate = ['Citizen', 'Permanent Resident'].includes(visaStatus);

        return (
            <div className="ui sixteen wide column">
                <div className="ui fields">
                    <div className="six wide field">
                        <select
                            className="ui right labeled dropdown"
                            value={visaStatus}
                            onChange={this.handleChange}
                        >
                            <option value="">Visa Type</option>
                            {visaOptions.map((x) => (
                                <option key={x} value={x}>
                                    {x}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Conditional rendering of Visa expiry date input */}
                    {!hideVisaExpiryDate && (
                        <div className="eight wide field">
                            <DatePicker selected={visaExpiryDate} onChange={(date) => this.handleDateChange(date)} />
                        </div>
                    )}
                    <button type="button" className="ui teal button" onClick={this.saveVisaStatus}>
                        Save
                    </button>
                    <button type="button" className="ui button" onClick={this.closeEdit}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    renderDisplay() {
        const { visaStatus, visaExpiryDate } = this.props;

        return (
            <div className="row">
                <div className="ui sixteen wide column">
                    <p>Visa Type: {visaStatus}</p>
                    <p>Visa Expiry Date: {visaExpiryDate ? this.formatDate(new Date(visaExpiryDate)) : 'N/A'}</p>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>
                        Edit
                    </button>
                </div>
            </div>
        );
    }

    render() {
        return this.state.showEditSection ? this.renderEdit() : this.renderDisplay();
    }
}