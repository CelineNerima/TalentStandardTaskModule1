import React from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';

export default class Skill extends React.Component {
    constructor(props) {
        super(props);

        const skills = props.skills ? [...props.skills] : []

        this.state = {
            showEditSection: false,
            showUpdateSection: false,
            skillData: skills,
            newSkill: {
                name: "",
                level: ""
            },
            editingSkillId:null
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.editSkill = this.editSkill.bind(this)
        this.deleteSkill = this.deleteSkill.bind(this)
        this.saveSkill = this.saveSkill.bind(this)        
        this.renderUpdate = this.renderUpdate.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
    }

    openEdit(event) {
        event.preventDefault();
        const skills = Object.assign([], this.props.skills)
        this.setState({
            showEditSection: true,
            showUpdateSection: false,
            skillData:skills,
            editingSkillId: null  
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
            newSkill: Object.assign({}, prevState.newSkill, { [name]: value })
        }));
    }
       
    editSkill(skillId) {
        const { skillData } = this.state;
        const skillToEdit = skillData.find(skill => skill.id === skillId);

        if (!skillToEdit) {
            return;
        }

        this.setState({
            showEditSection: false,
            showUpdateSection: true,
            newSkill: {
                name: skillToEdit.name,
                level: skillToEdit.level
            },
            editingSkillId: skillId
        });
    }

    deleteSkill(skillId) {
        const { skillData } = this.state;

        const updatedSkills = skillData.filter(skill => skill.id !== skillId);

        this.props.saveProfileData({ skills: updatedSkills });

        this.setState({
            skillData: updatedSkills,
        });
    }
       
    saveSkill() {
        const { skillData, newSkill, editingSkillId } = this.state;

        if (!newSkill.name || !newSkill.level) {
            return;
        }

        if (editingSkillId !== null) {
            // If editing, update the existing skill
            const updatedSkills = skillData.map(skill => {
                if (skill.id === editingSkillId) {
                    return Object.assign({}, skill, newSkill);
                }
                return skill;
            });

            this.props.saveProfileData({ skills: updatedSkills });

            this.setState({
                skillData: updatedSkills,
                showEditSection: false,
                showUpdateSection: false, 
                newSkill: Object.assign({}, { name: "", level: "" }),
                editingSkillId: null
            });
        } else {
            // If adding a new skill
            const updatedSkills = [...skillData, Object.assign({}, newSkill)];

            this.props.saveProfileData({ skills: updatedSkills });

            this.setState({
                skillData: updatedSkills,
                showEditSection: false,
                showUpdateSection: false,
                newSkill: Object.assign({}, { name: "", level: "" }),
                editingSkillId: null
            });
        }
    }

    renderEdit() {
        const { newSkill } = this.state;
        const skillLevels = ['Skill Level', 'Beginner', 'Intermediate', 'Expert'];

        return (
            <div className="form-wrappper">
                <div className="fields">
                    <div className="five wide field">
                        <ChildSingleInput
                            inputType="text"
                            name="name"
                            value={newSkill.name}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Add Skill"
                            errorMessage="Please enter a valid skill name"
                        />
                    </div>
                    <div className="five wide field">
                        <select
                            style={{ marginBottom: "5px", marginTop: "5px" }}
                            className="ui dropdown"
                            name="level"
                            value={newSkill.level}
                            onChange={this.handleChange}
                        >
                            {skillLevels.map((level) => (
                                <option key={level} value={level}>
                                    {level}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="six wide field" style={{ marginBottom: "5px", marginTop: "5px" }}>
                        <button className="ui teal button" onClick={this.saveSkill}>
                            Add
                        </button>
                        <button className="ui button" onClick={this.closeEdit}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    renderUpdate() {
        const { newSkill } = this.state;
        const skillLevels = ['Skill Level', 'Beginner', 'Intermediate', 'Expert'];

        return (
            <div className="form-wrappper">
                <div className="fields">
                    <div className="five wide field">
                        <ChildSingleInput
                            inputType="text"
                            name="name"
                            value={newSkill.name}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Add Skill"
                            errorMessage="Please enter a valid skill name"
                        />
                    </div>
                    <div className="five wide field">
                        <select
                            style={{ marginBottom: "5px", marginTop: "5px" }}
                            className="ui dropdown"
                            name="level"
                            value={newSkill.level}
                            onChange={this.handleChange}
                        >
                            {skillLevels.map((level) => (
                                <option key={level} value={level}>
                                    {level}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="six wide field" style={{ marginBottom: "5px", marginTop: "5px" }}>
                        <button className="ui basic blue prompt button" onClick={this.saveSkill}>
                            Update
                        </button>
                        <button className="ui basic red prompt button" onClick={this.closeEdit}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    renderDisplay() {
        const { skills } = this.props;

        return (
            <div className="row">
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <table className="ui fixed table">
                            <thead className="ui basic">
                                <tr>
                                    <th>Skill</th>
                                    <th>Level</th>
                                    <th>
                                        <button className="ui teal button right floated" onClick={this.openEdit}>
                                            <i className="add icon"></i>Add New
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {skills.map((skill, id) =>
                                    <tr key={id}>
                                        <td>{skill.name}</td>
                                        <td>{skill.level}</td>
                                        <td className="right aligned">
                                            <span className="button" onClick={() => this.editSkill(skill.id)}>
                                                <i className="outline write icon"></i>
                                            </span>
                                            &nbsp;&nbsp;
                                            <span className="button" onClick={() => this.deleteSkill(skill.id)}>
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
