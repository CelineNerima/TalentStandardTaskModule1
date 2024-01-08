/* Certificate section */
import React from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';

export default class Certificate extends React.Component {

    constructor(props) {
        super(props)
        
        const certifications = props.certifications ? JSON.parse(JSON.stringify(props.certifications)) : [];

        this.state = {
            showEditSection: false,
            showUpdateSection: false,
            certificateData: certifications,
            newCertificate: {
                certificationName: "",
                certificationFrom: "",
                certificationYear: 0  
            },
            editingCertificateId: null
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.editCertificate = this.editCertificate.bind(this)
        this.deleteCertificate = this.deleteCertificate.bind(this)
        this.saveCertificate = this.saveCertificate.bind(this)
        this.renderUpdate = this.renderUpdate.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
    }

    openEdit(event) {
        event.preventDefault();
        const certifications = Object.assign([], this.props.certifications)
        this.setState({
            showEditSection: true,
            showUpdateSection: false,
            certificateData: certifications,
            editingCertificateId: null
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
            newCertificate: Object.assign({}, prevState.newCertificate, { [name]: value })
        }));
    }
                
    editCertificate(certificateId) {
        const { certificateData } = this.state;
        const certificateToEdit = certificateData.find(certificate => certificate.id === certificateId);

        if (!certificateToEdit) {
            return;
        }

        this.setState({
            showEditSection: false,
            showUpdateSection: true,
            newCertificate: {
                certificationName: certificateToEdit.certificationName,
                certificationFrom: certificateToEdit.certificationFrom,
                certificationYear: certificateToEdit.certificationYear
            },
            editingCertificateId: certificateId
        });

    }

    deleteCertificate(certificateId) {
        const { certificateData } = this.state;

        const updatedCertificate = certificateData.filter(certificate => certificate.id !== certificateId);

        this.props.saveProfileData({ certifications: updatedCertificate });

        this.setState({
            certificateData: updatedCertificate,
        });
    }

    saveCertificate() {
        const { certificateData, newCertificate, editingCertificateId } = this.state;

        if (editingCertificateId !== null) {
            // If editing
            const updatedCertificate = certificateData.map(certificate => {
                if (certificate.id === editingCertificateId) {
                    return Object.assign({}, certificate, newCertificate);
                }
                return certificate;
            });
 
            this.props.saveProfileData({ certifications: updatedCertificate });

            this.setState({
                showEditSection: false,
                showUpdateSection: true,
                certificateData: updatedCertificate,
                newCertificate: {
                    certificationName: "",
                    certificationFrom: "",
                    certificationYear: 0
                },
                editingCertificateId: null
            });
        } else {
            // If adding 
            const updatedCertificate = [...certificateData, Object.assign({}, newCertificate)];

            this.props.saveProfileData({ certifications: updatedCertificate });

            this.setState({
                showEditSection: false,
                showUpdateSection: false,
                certificateData: updatedCertificate,
                newCertificate: {
                    certificationName: "",
                    certificationFrom: "",
                    certificationYear: 0
                },
                editingCertificateId: null
            });
        }
    }   

    renderEdit() {
        const { newCertificate } = this.state;
        const currentYear = new Date().getFullYear();
        const yearOptions = Array.from({ length: currentYear - 1949 }, (_, index) => currentYear - index);

        return (
            <div className="form-wrappper">
                <div className="fields">
                    <div className="eight wide field">
                        <ChildSingleInput
                            inputType="text"
                            name="certificationName"
                            value={newCertificate.certificationName}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Certificate or Award"
                            errorMessage="Please enter a valid text"
                        />
                    </div>
                    <div className="eight wide field">
                        <ChildSingleInput
                            inputType="text"
                            name="certificationFrom"
                            value={newCertificate.certificationFrom}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Certified From(e.g. Adobe)"
                            errorMessage="Please enter valid text"
                        />
                    </div>
                </div>
                <div className="fields">
                    <div className="eight wide field">
                        <select
                            style={{ marginBottom: "5px", marginTop: "5px" }}
                            className="ui dropdown yearpicker form-control"
                            name="certificationYear"
                            value={newCertificate.certificationYear}
                            onChange={this.handleChange}
                        >
                            <option value="">Year</option>
                            {yearOptions.map(year => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="six wide field" style={{ marginBottom: "5px", marginTop: "5px" }}>
                    <button className="ui teal button" onClick={this.saveCertificate}>
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
        const { newCertificate } = this.state;
        const currentYear = new Date().getFullYear();
        const yearOptions = Array.from({ length: currentYear - 1949 }, (_, index) => currentYear - index);

        return (
            <div className="form-wrappper">
                <div className="fields">
                    <div className="eight wide field">
                        <ChildSingleInput
                            inputType="text"
                            name="certificationName"
                            value={newCertificate.certificationName}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Certificate or Award"
                            errorMessage="Please enter a valid text"
                        />
                    </div>
                    <div className="eight wide field">
                        <ChildSingleInput
                            inputType="text"
                            name="certificationFrom"
                            value={newCertificate.certificationFrom}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Certified From(e.g. Adobe)"
                            errorMessage="Please enter valid text"
                        />
                    </div>
                </div>
                <div className="fields">
                    <div className="eight wide field">
                        <select
                            style={{ marginBottom: "5px", marginTop: "5px" }}
                            className="ui dropdown yearpicker form-control"
                            name="certificationYear"
                            value={newCertificate.certificationYear}
                            onChange={this.handleChange}
                        >
                            <option value="">Year</option>
                            {yearOptions.map(year => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="six wide field" style={{ marginBottom: "5px", marginTop: "5px" }}>
                    <button className="ui teal button" onClick={this.saveCertificate}>
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
        const { certifications } = this.props;

        return (
            <div className="row">
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <table className="ui fixed table">
                            <thead className="ui basic">
                                <tr>
                                    <th>Certificate</th>
                                    <th>From</th>
                                    <th>Year</th>
                                    <th>
                                        <button className="ui teal button right floated" onClick={this.openEdit}>
                                            <i className="add icon"></i>Add New
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {certifications.map((certificate, id) =>
                                    <tr key={id}>
                                        <td>{certificate.certificationName}</td>
                                        <td>{certificate.certificationFrom}</td>
                                        <td>{certificate.certificationYear}</td>
                                        <td className="right aligned">
                                            <span className="button" onClick={() => this.editCertificate(certificate.id)}>
                                                <i className="outline write icon"></i>
                                            </span>
                                            &nbsp;&nbsp;
                                            <span className="button" onClick={() => this.deleteCertificate(certificate.id)}>
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