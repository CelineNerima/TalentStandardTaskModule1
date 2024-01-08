/* Photo upload section */
import React, { Component } from 'react';
import Cookies from 'js-cookie';

export default class PhotoUpload extends Component {

    constructor(props) {
        super(props);

        this.state = {
            newPhoto: {
                profilePhoto: props.imageId,
                profilePhotoUrl: ""
            },
            isLoading: false
        }

        this.handleUploadClick = this.handleUploadClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.imageId !== this.props.imageId) {
            this.setState({
                newPhoto: {
                    profilePhoto: nextProps.imageId,
                }
            });
        }
    }

    handleChange(event) {
        let files = event.target.files;
        console.log(files);
        let reader = new FileReader();
        reader.readAsDataURL(files[0]);

        reader.onload = event => {
            console.log(event.target.result);
            this.setState({
                newPhoto: {
                    profilePhoto: event.target.result,
                }
            });
        }
    }

    handleUploadClick() {
        this.props.saveProfileData(this.state.newPhoto)
    }

    render() {
        const { isLoading } = this.state;
        const placeHolder = "https://www.kindpng.com/picc/m/128-1282088_i-g-profile-icon-vector-png-transparent-png.png";
        return (
            <React.Fragment>
                <div className="ui row">
                    <div className="ui sixteen wide column">
                        <label htmlFor="fileInput">
                            <input
                                id="fileInput"
                                type="file"
                                name="file"
                                onChange={event => this.handleChange(event)}
                                accept="image/*"
                                src={this.state.newPhoto.profilePhoto}
                                style={{ display: "none" }}
                            />
                            <img src={this.state.newPhoto.profilePhoto ? this.state.newPhoto.profilePhoto : placeHolder}
                                alt="ProfilePicture" className="ui small circular image" />
                        </label>
                        <div className="ui sixteen wide column" style={{marginTop:"5px"} }>
                            <button type="button" className="ui right floated teal button" onClick={() => this.handleUploadClick()} disabled={isLoading}>
                                {isLoading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}