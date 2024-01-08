using Talent.Services.Profile.Models.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Talent.Services.Profile.Models;
using Talent.Common.Models;
using Microsoft.AspNetCore.Http;
using Talent.Common.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace Talent.Services.Profile.Domain.Contracts
{
    public interface IProfileService
    {
        bool AddNewLanguage(AddLanguageViewModel language);
        Task<bool> UpdateLanguage(AddLanguageViewModel language);
        Task<bool> DeleteLanguage(AddLanguageViewModel language);
        Task<IEnumerable<AddLanguageViewModel>> GetLanguages(string updaterId);

        bool AddNewSkill(AddSkillViewModel skill);
        Task<bool> UpdateSkill(AddSkillViewModel skill);
        Task<bool> DeleteSkill(AddSkillViewModel skill);
        Task<IEnumerable<AddSkillViewModel>> GetSkills(string updaterId);

        bool AddNewExperience(ExperienceViewModel experience);
        Task<bool> UpdateExperience(ExperienceViewModel experience);
        Task<bool> DeleteExperience(ExperienceViewModel experience);
        Task<IEnumerable<ExperienceViewModel>> GetExperience(string updaterId);

        bool AddNewCertification(AddCertificationViewModel certificate);
        Task<bool> UpdateCertification(AddCertificationViewModel certificate);
        Task<bool> DeleteCertification(AddCertificationViewModel certificate);
        Task<IEnumerable<AddCertificationViewModel>> GetCertification(string updaterId);

        bool AddNewEducation(AddEducationViewModel education);
        Task<bool> UpdateEducation(AddEducationViewModel education);
        Task<bool> DeleteEducation(AddEducationViewModel education);
        Task<IEnumerable<AddEducationViewModel>> GetEducation(string updaterId);

        Task<TalentProfileViewModel> GetTalentProfile(String Id);
        Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment);
        Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment);
        Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids);

        Task<bool> UpdateTalentProfile(TalentProfileViewModel profile, String updaterId);
        Task<bool> UpdateTalentPhoto(string talentId, IFormFile file);

        Task<string> GetProfileImageUrl(string updaterId);

        Task<bool> AddTalentVideo(string talentId, IFormFile file);
        Task<bool> RemoveTalentVideo(string talentId, string videoName);

        Task<EmployerProfileViewModel> GetEmployerProfile(String id, string role);

        Task<bool> UpdateEmployerProfile(EmployerProfileViewModel profile, String updaterId, string role);
        Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file);

        Task<bool> AddEmployerVideo(string employerId, IFormFile file);
        Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents);

        Task<bool> UpdateTalentCV(string talentId, IFormFile file);

        Task<IEnumerable<TalentSuggestionViewModel>> GetFullTalentList();
        IEnumerable<TalentMatchingEmployerViewModel> GetEmployerList();
        Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model);
        Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId);
        Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model);

        Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId);
        Task<Employer> GetEmployer(string employerId);
    }
}
