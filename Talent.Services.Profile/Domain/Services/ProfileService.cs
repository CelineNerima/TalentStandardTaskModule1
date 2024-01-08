using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Models.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;
using Talent.Services.Profile.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using Talent.Common.Security;
using System.Xml.Linq;
using System.Reflection.Emit;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;

namespace Talent.Services.Profile.Domain.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserAppContext _userAppContext;
        IRepository<UserLanguage> _userLanguageRepository;
        IRepository<UserSkill> _userSkillRepository;
        IRepository<UserExperience> _userExperienceRepository;
        IRepository<UserCertification> _userCertificationRepository;
        IRepository<UserEducation> _userEducationRepository;
        IRepository<User> _userRepository;
        IRepository<Employer> _employerRepository;
        IRepository<Job> _jobRepository;
        IRepository<Recruiter> _recruiterRepository;
        IFileService _fileService;
        IFileService _documentService;


        public ProfileService(IUserAppContext userAppContext,
                              IRepository<UserLanguage> userLanguageRepository,
                              IRepository<UserSkill> userSkillRepository,
                              IRepository<UserExperience> userExperienceRepository,
                              IRepository<UserCertification> userCertificationRepository,
                              IRepository<UserEducation> userEducationRepository,
                              IRepository<User> userRepository,
                              IRepository<Employer> employerRepository,
                              IRepository<Job> jobRepository,
                              IRepository<Recruiter> recruiterRepository,
                              IFileService fileService,
                              IFileService documentService)
        {
            _userAppContext = userAppContext;
            _userLanguageRepository = userLanguageRepository;
            _userSkillRepository = userSkillRepository;
            _userExperienceRepository = userExperienceRepository;
            _userCertificationRepository = userCertificationRepository;
            _userRepository = userRepository;
            _employerRepository = employerRepository;
            _jobRepository = jobRepository;
            _recruiterRepository = recruiterRepository;
            _fileService = fileService;
            _documentService = documentService;
        }

        #region Languages
        public bool AddNewLanguage(AddLanguageViewModel language)
        {
            //Your code here;
            //throw new NotImplementedException();       
            try
            {
                if (language != null)
                {
                    var userLanguage = new UserLanguage
                    {
                        Id = language.Id,
                        Language = language.Name,
                        LanguageLevel = language.Level,
                    };

                    _userLanguageRepository.Add(userLanguage);

                    return true;
                }
            }
            catch (MongoException e)
            {
                // Log the exception or handle it appropriately
                return false;
            }

            return false;
        }

        public async Task<bool> UpdateLanguage(AddLanguageViewModel language)
        {
            try
            {
                if (language != null)
                {
                    var existingLanguage = await _userLanguageRepository.GetByIdAsync(language.Id);

                    if (existingLanguage != null)
                    {
                        // Update the existing skill
                        existingLanguage.Language = language.Name;
                        existingLanguage.Language = language.Level;

                        // Save changes
                        await _userLanguageRepository.Update(existingLanguage);

                        return true;
                    }
                }
            }
            catch (MongoException e)
            {
                // Log the exception or handle it appropriately
                return false;
            }

            return false;
        }

        public async Task<bool> DeleteLanguage(AddLanguageViewModel language)
        {
            try
            {
                if (language != null)
                {
                    var existingLanguage = await _userLanguageRepository.GetByIdAsync(language.Id);

                    if (existingLanguage != null)
                    {
                        // Delete and Save changes
                        await _userLanguageRepository.Delete(existingLanguage);

                        return true;
                    }
                }
            }
            catch (MongoException e)
            {
                // Log the exception or handle it appropriately
                return false;
            }

            return false;
        }

        public async Task<IEnumerable<AddLanguageViewModel>> GetLanguages(string updaterId)
        {
            var profile = await _userRepository.GetByIdAsync(updaterId);

            if (profile != null)
            {
                var languagesViewModel = profile.Languages.Select(language => ViewModelFromLanguage(language)).ToList();
                return languagesViewModel;
            }

            return Enumerable.Empty<AddLanguageViewModel>();
        }
        #endregion

        #region Skills
        public bool AddNewSkill(AddSkillViewModel skill)
        {
            try
            {
                if (skill != null)
                {
                    var userSkill = new UserSkill
                    {
                        Id = skill.Id,
                        Skill = skill.Name,
                        ExperienceLevel = skill.Level,
                    };

                    // Add UserSkill to repository
                    _userSkillRepository.Add(userSkill);

                    return true;
                }
            }
            catch (MongoException e)
            {
                // Log the exception or handle it appropriately
                return false;
            }

            return false;

        }

        public async Task<bool> UpdateSkill(AddSkillViewModel skill)
        {
            try
            {
                if (skill != null)
                {
                    var existingSkill = await _userSkillRepository.GetByIdAsync(skill.Id);

                    if (existingSkill != null)
                    {
                        // Update the existing skill
                        existingSkill.Skill = skill.Name;
                        existingSkill.ExperienceLevel = skill.Level;

                        // Save changes
                        await _userSkillRepository.Update(existingSkill);

                        return true;
                    }
                }
            }
            catch (MongoException e)
            {
                // Log the exception or handle it appropriately
                return false;
            }

            return false;
        }

        public async Task<bool> DeleteSkill(AddSkillViewModel skill)
        {
            try
            {
                if (skill != null)
                {
                    var existingSkill = await _userSkillRepository.GetByIdAsync(skill.Id);

                    if (existingSkill != null)
                    {
                        // Remove the existing skill
                        // Save changes
                        await _userSkillRepository.Delete(existingSkill);

                        return true;
                    }
                }
            }
            catch (MongoException e)
            {
                // Log the exception or handle it appropriately
                return false;
            }

            return false;
        }

        public async Task<IEnumerable<AddSkillViewModel>> GetSkills(string updaterId)
        {
            var profile = await _userRepository.GetByIdAsync(updaterId);

            if (profile != null)
            {
                // Skills property is a list of UserSkill in your User model
                var skillsViewModel = profile.Skills.Select(skill => ViewModelFromSkill(skill)).ToList();
                return skillsViewModel;
            }

            return Enumerable.Empty<AddSkillViewModel>();
        }
        #endregion

        #region Experience
        public bool AddNewExperience(ExperienceViewModel experience)
        {
            try
            {
                if (experience != null)
                {
                    var userExperience = new UserExperience
                    {
                        Id = experience.Id,
                        Company = experience.Company,
                        Responsibilities = experience.Responsibilities,
                        Position = experience.Position,
                        Start = experience.Start,
                        End = experience.End,
                    };

                    _userExperienceRepository.Add(userExperience);

                    return true;
                }
            }
            catch (MongoException e)
            {
                return false;
            }

            return false;

        }

        public async Task<bool> UpdateExperience(ExperienceViewModel experience)
        {
            try
            {
                if (experience != null)
                {
                    var existingExperience = await _userExperienceRepository.GetByIdAsync(experience.Id);

                    if (existingExperience != null)
                    {
                        existingExperience.Company = experience.Company;
                        existingExperience.Responsibilities = experience.Responsibilities;
                        existingExperience.Position = experience.Position;
                        existingExperience.Start = experience.Start;
                        existingExperience.End = experience.End;

                        // Save changes
                        await _userExperienceRepository.Update(existingExperience);

                        return true;
                    }
                }
            }
            catch (MongoException e)
            {
                // Log the exception or handle it appropriately
                return false;
            }

            return false;
        }

        public async Task<bool> DeleteExperience(ExperienceViewModel experience)
        {
            try
            {
                if (experience != null)
                {
                    var existingExperience = await _userExperienceRepository.GetByIdAsync(experience.Id);

                    if (existingExperience != null)
                    {
                        // Save changes
                        await _userExperienceRepository.Delete(existingExperience);

                        return true;
                    }
                }
            }
            catch (MongoException e)
            {
                // Log the exception or handle it appropriately
                return false;
            }

            return false;
        }

        public async Task<IEnumerable<ExperienceViewModel>> GetExperience(string updaterId)
        {
            var profile = await _userRepository.GetByIdAsync(updaterId);

            if (profile != null)
            {
                var experienceViewModel = profile.Experience.Select(experience => ViewModelFromExperience(experience)).ToList();
                return experienceViewModel;
            }

            return Enumerable.Empty<ExperienceViewModel>();
        }
        #endregion

        #region Certifications
        public bool AddNewCertification(AddCertificationViewModel certificate)
        {
            try
            {
                if (certificate != null)
                {
                    var userCertificate = new UserCertification
                    {
                        Id = certificate.Id,
                        CertificationName = certificate.CertificationName,
                        CertificationFrom = certificate.CertificationFrom,
                        CertificationYear = certificate.CertificationYear,
                    };

                    _userCertificationRepository.Add(userCertificate);

                    return true;
                }
            }
            catch (MongoException e)
            {
                // Log the exception or handle it appropriately
                return false;
            }

            return false;
        }

        public async Task<bool> UpdateCertification(AddCertificationViewModel certificate)
        {
            try
            {
                if (certificate != null)
                {
                    var existingCertificate = await _userCertificationRepository.GetByIdAsync(certificate.Id);

                    if (existingCertificate != null)
                    {
                        // Update the existing certificate
                        existingCertificate.CertificationName = certificate.CertificationName;
                        existingCertificate.CertificationFrom = certificate.CertificationFrom;
                        existingCertificate.CertificationYear = certificate.CertificationYear;

                        // Save changes
                        await _userCertificationRepository.Update(existingCertificate);

                        return true;
                    }
                }
            }
            catch (MongoException e)
            {
                // Log the exception or handle it appropriately
                return false;
            }

            return false;
        }

        public async Task<bool> DeleteCertification(AddCertificationViewModel certificate)
        {
            try
            {
                if (certificate != null)
                {
                    var existingCertificate = await _userCertificationRepository.GetByIdAsync(certificate.Id);

                    if (existingCertificate != null)
                    {
                        //Delete and Save changes
                        await _userCertificationRepository.Delete(existingCertificate);

                        return true;
                    }
                }
            }
            catch (MongoException e)
            {
                // Log the exception or handle it appropriately
                return false;
            }

            return false;
        }

        public async Task<IEnumerable<AddCertificationViewModel>> GetCertification(string updaterId)
        {
            var profile = await _userRepository.GetByIdAsync(updaterId);

            if (profile != null)
            {
                // Certifications property is a list of UserCertification in your User model
                var certificationsViewModel = profile.Certifications.Select(certificate => ViewModelFromCertification(certificate)).ToList();
                return certificationsViewModel;
            }

            return Enumerable.Empty<AddCertificationViewModel>();
        }

        #endregion

        #region Education
        public bool AddNewEducation(AddEducationViewModel education)
        {
            try
            {
                if (education != null)
                {
                    var userEducation = new UserEducation
                    {
                        Id = education.Id,
                        Country = education.Country,
                        InstituteName = education.InstituteName,
                        Title = education.Title,
                        Degree = education.Degree,
                        YearOfGraduation = education.YearOfGraduation,
                    };

                    _userEducationRepository.Add(userEducation);

                    return true;
                }
            }
            catch (MongoException e)
            {
                // Log the exception or handle it appropriately
                return false;
            }

            return false;
        }

        public async Task<bool> UpdateEducation(AddEducationViewModel education)
        {
            try
            {
                if (education != null)
                {
                    var existingEducation = await _userEducationRepository.GetByIdAsync(education.Id);

                    if (existingEducation != null)
                    {
                        // Update the existing 
                        existingEducation.Country = education.Country;
                        existingEducation.InstituteName = education.InstituteName;
                        existingEducation.Title = education.Title;
                        existingEducation.Degree = education.Degree;
                        existingEducation.YearOfGraduation = education.YearOfGraduation;

                        // Save changes
                        await _userEducationRepository.Update(existingEducation);

                        return true;
                    }
                }
            }
            catch (MongoException e)
            {
                // Log the exception or handle it appropriately
                return false;
            }

            return false;
        }

        public async Task<bool> DeleteEducation(AddEducationViewModel education)
        {
            try
            {
                if (education != null)
                {
                    var existingEducation = await _userEducationRepository.GetByIdAsync(education.Id);

                    if (existingEducation != null)
                    {                        
                        // Save changes
                        await _userEducationRepository.Update(existingEducation);

                        return true;
                    }
                }
            }
            catch (MongoException e)
            {
                // Log the exception or handle it appropriately
                return false;
            }

            return false;
        }

        public async Task<IEnumerable<AddEducationViewModel>> GetEducation(string updaterId)
        {
            var profile = await _userRepository.GetByIdAsync(updaterId);

            if (profile != null)
            {
                var educationViewModel = profile.Education.Select(education => ViewModelFromEducation(education)).ToList();
                return educationViewModel;
            }

            return Enumerable.Empty<AddEducationViewModel>();
        }

        #endregion

        public async Task<TalentProfileViewModel> GetTalentProfile(string Id)
        {
            //Your code here;            
            User profile = (await _userRepository.GetByIdAsync(Id));
                        
            var videoUrl = "";
            var cvUrl = "";

            if (profile != null)
            {                
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);
                cvUrl = string.IsNullOrWhiteSpace(profile.CvName)
                    ? ""
                    : await _fileService.GetFileURL(profile.CvName, FileType.UserCV);
                var languages = profile.Languages.Select(x => ViewModelFromLanguage(x)).ToList();
                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();
                var certifications = profile.Certifications.Select(x => ViewModelFromCertification(x)).ToList();
                var experience = profile.Experience.Select(x => ViewModelFromExperience(x)).ToList();
                var education = profile.Education.Select(x => ViewModelFromEducation(x)).ToList();
               
                var result = new TalentProfileViewModel
                {
                    Id = profile.Id,
                    FirstName = profile.FirstName,
                    MiddleName = profile.MiddleName,
                    LastName = profile.LastName,
                    Gender = profile.Gender,
                    Email = profile.Email,
                    Phone = profile.Phone,
                    IsMobilePhoneVerified = profile.IsMobilePhoneVerified,
                    Address = profile.Address,
                    Nationality = profile.Nationality,
                    VisaStatus = profile.VisaStatus,
                    VisaExpiryDate = profile.VisaExpiryDate,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    CvName = profile.CvName,
                    CvUrl = cvUrl,
                    Summary = profile.Summary,
                    Description = profile.Description,
                    LinkedAccounts = profile.LinkedAccounts,
                    JobSeekingStatus = profile.JobSeekingStatus,
                    Languages = languages,
                    Skills = skills,
                    Certifications = certifications,
                    Experience = experience,
                    Education = education,
                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateTalentProfile(TalentProfileViewModel model, string updaterId)
        {
            //Your code here;
            try
            {
                if (model.Id != null)
                {
                    User existingTalent = (await _userRepository.GetByIdAsync(model.Id));

                    existingTalent.FirstName = model.FirstName;
                    existingTalent.MiddleName = model.MiddleName;
                    existingTalent.LastName = model.LastName;
                    existingTalent.Gender = model.Gender;
                    existingTalent.Email = model.Email;
                    existingTalent.Phone = model.Phone;
                    existingTalent.MobilePhone = model.MobilePhone;
                    existingTalent.IsMobilePhoneVerified = model.IsMobilePhoneVerified;
                    existingTalent.Address = model.Address;
                    existingTalent.Nationality = model.Nationality;
                    existingTalent.VisaStatus = model.VisaStatus;
                    existingTalent.VisaExpiryDate = model.VisaExpiryDate;
                    existingTalent.ProfilePhoto = model.ProfilePhoto;
                    existingTalent.ProfilePhotoUrl = model.ProfilePhotoUrl;
                    existingTalent.VideoName = model.VideoName;
                    existingTalent.CvName = model.CvName;
                    existingTalent.Summary = model.Summary;
                    existingTalent.Description = model.Description;
                    existingTalent.LinkedAccounts = model.LinkedAccounts;
                    existingTalent.JobSeekingStatus = model.JobSeekingStatus;
                    existingTalent.UpdatedBy = updaterId;
                    existingTalent.UpdatedOn = DateTime.Now;

                    //Update skills
                    var newSkills = new List<UserSkill>();
                    foreach (var item in model.Skills)
                    {
                        var skill = existingTalent.Skills.SingleOrDefault(x => x.Id == item.Id) ?? new UserSkill
                        {
                            Id = ObjectId.GenerateNewId().ToString(),
                            IsDeleted = false
                        };
                        UpdateSkillFromView(item, skill);
                        newSkills.Add(skill);
                    }
                    existingTalent.Skills = newSkills;

                    //Update languages
                    var newLanguages = new List<UserLanguage>();
                    foreach (var item in model.Languages)
                    {
                        var language = existingTalent.Languages.SingleOrDefault(x => x.Id == item.Id) ?? new UserLanguage
                        {
                            Id = ObjectId.GenerateNewId().ToString(),
                            IsDeleted = false
                        };
                        UpdateLanguageFromView(item, language);
                        newLanguages.Add(language);
                    }
                    existingTalent.Languages = newLanguages;

                    //Update Certifications
                    var newCertifications = new List<UserCertification>();
                    foreach (var item in model.Certifications)
                    {
                        var certification = existingTalent.Certifications.SingleOrDefault(x => x.Id == item.Id) ?? new UserCertification
                        {
                            Id = ObjectId.GenerateNewId().ToString(),
                            IsDeleted = false
                        };
                        UpdateCertificationFromView(item, certification);
                        newCertifications.Add(certification);
                    }
                    existingTalent.Certifications = newCertifications;

                    //Update Experience
                    var newExperience = new List<UserExperience>();
                    foreach (var item in model.Experience)
                    {
                        var experience = existingTalent.Experience.SingleOrDefault(x => x.Id == item.Id) ?? new UserExperience
                        {
                            Id = ObjectId.GenerateNewId().ToString(),
                            IsDeleted = false
                        };
                        UpdateExperienceFromView(item, experience);
                        newExperience.Add(experience);
                    }
                    existingTalent.Experience = newExperience;

                    // Update Education
                    var newEducation = new List<UserEducation>();
                    foreach (var item in model.Education)
                    {
                        var education = existingTalent.Education.SingleOrDefault(x => x.Id == item.Id) ?? new UserEducation
                        {
                            Id = ObjectId.GenerateNewId().ToString(),
                            IsDeleted = false
                        };
                        UpdateEducationfromView(item, education);
                        newEducation.Add(education);
                    }
                    existingTalent.Education = newEducation;

                    // Save changes
                    await _userRepository.Update(existingTalent);

                    return true;
                }
                return false; // Model ID is null
            }
            catch (MongoException e)
            {
                // Handle the exception
                return false;
            }

        }

        public async Task<EmployerProfileViewModel> GetEmployerProfile(string Id, string role)
        {

            Employer profile = null;
            switch (role)
            {
                case "employer":
                    profile = (await _employerRepository.GetByIdAsync(Id));
                    break;
                case "recruiter":
                    profile = (await _recruiterRepository.GetByIdAsync(Id));
                    break;
            }

            var videoUrl = "";

            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                var result = new EmployerProfileViewModel
                {
                    Id = profile.Id,
                    CompanyContact = profile.CompanyContact,
                    PrimaryContact = profile.PrimaryContact,
                    Skills = skills,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    DisplayProfile = profile.DisplayProfile,
                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateEmployerProfile(EmployerProfileViewModel employer, string updaterId, string role)
        {
            try
            {
                if (employer.Id != null)
                {
                    switch (role)
                    {
                        case "employer":
                            Employer existingEmployer = (await _employerRepository.GetByIdAsync(employer.Id));
                            existingEmployer.CompanyContact = employer.CompanyContact;
                            existingEmployer.PrimaryContact = employer.PrimaryContact;
                            existingEmployer.ProfilePhoto = employer.ProfilePhoto;
                            existingEmployer.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingEmployer.DisplayProfile = employer.DisplayProfile;
                            existingEmployer.UpdatedBy = updaterId;
                            existingEmployer.UpdatedOn = DateTime.Now;

                            var newSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingEmployer.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newSkills.Add(skill);
                            }
                            existingEmployer.Skills = newSkills;

                            await _employerRepository.Update(existingEmployer);
                            break;

                        case "recruiter":
                            Recruiter existingRecruiter = (await _recruiterRepository.GetByIdAsync(employer.Id));
                            existingRecruiter.CompanyContact = employer.CompanyContact;
                            existingRecruiter.PrimaryContact = employer.PrimaryContact;
                            existingRecruiter.ProfilePhoto = employer.ProfilePhoto;
                            existingRecruiter.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingRecruiter.DisplayProfile = employer.DisplayProfile;
                            existingRecruiter.UpdatedBy = updaterId;
                            existingRecruiter.UpdatedOn = DateTime.Now;

                            var newRSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingRecruiter.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newRSkills.Add(skill);
                            }
                            existingRecruiter.Skills = newRSkills;
                            await _recruiterRepository.Update(existingRecruiter);

                            break;
                    }
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _employerRepository.Get(x => x.Id == employerId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _employerRepository.Update(profile);
                return true;
            }

            return false;

        }

        public async Task<bool> AddEmployerVideo(string employerId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }
                
        public async Task<bool> UpdateTalentPhoto(string talentId, IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return false;
                }

                var profile = (await _userRepository.Get(x => x.Id == talentId)).SingleOrDefault();

                if (profile == null)
                {
                    return false;
                }

                var newFilePath = await _fileService.SaveFile(file, FileType.ProfilePhoto);

                if (!string.IsNullOrWhiteSpace(newFilePath))
                {
                    var oldFilePath = profile.ProfilePhoto;

                    if (!string.IsNullOrWhiteSpace(oldFilePath))
                    {
                        await _fileService.DeleteFile(oldFilePath, FileType.ProfilePhoto);
                    }

                    profile.ProfilePhoto = newFilePath;
                    profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFilePath, FileType.ProfilePhoto);

                    await _userRepository.Update(profile);
                    Console.WriteLine($"Profile photo uploaded successfully: {newFilePath}");
                    return true;
                }

                return false;
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error during profile photo upload: {e.Message}");
                return false;
            }
        }

        public async Task<string> GetProfileImageUrl(string updaterId)
        {
            var profileUrl = await _documentService.GetFileURL(updaterId, FileType.ProfilePhoto);

            if (string.IsNullOrWhiteSpace(profileUrl))
            {
                // No image available, return a placeholder URL or handle it as needed
                profileUrl = "/path/to/placeholder-image.jpg";
            }

            return profileUrl;
        }

        public async Task<bool> AddTalentVideo(string talentId, IFormFile file)
        {
            //Your code here;
            try
            {
                if (file == null || file.Length == 0)
                {
                    return false;
                }

                var profile = (await _userRepository.Get(x => x.Id == talentId)).SingleOrDefault();

                if (profile == null)
                {
                    return false;
                }

                var newFilePath = await _fileService.SaveFile(file, FileType.UserVideo);

                if (!string.IsNullOrWhiteSpace(newFilePath))
                {
                    var oldFilePath = profile.VideoName;

                    if (!string.IsNullOrWhiteSpace(oldFilePath))
                    {
                        await _fileService.DeleteFile(oldFilePath, FileType.UserVideo);
                    }

                    profile.VideoName = newFilePath;
                    //profile.VideoUrl = await _fileService.GetFileURL(newFilePath, FileType.UserVideo);

                    await _userRepository.Update(profile);
                    Console.WriteLine($"Profile photo uploaded successfully: {newFilePath}");
                    return true;
                }

                return false;
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error during profile video upload: {e.Message}");
                return false;
            }

        }

        public async Task<bool> RemoveTalentVideo(string talentId, string videoName)
        {
            //Your code here;
            var profile = (await _userRepository.Get(x => x.Id == talentId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            if (!string.IsNullOrWhiteSpace(videoName))
            {
                videoName = profile.VideoName;

                if (!string.IsNullOrWhiteSpace(videoName))
                {
                    await _fileService.DeleteFile(videoName, FileType.UserVideo);
                }

                await _userRepository.Update(profile);
                Console.WriteLine($"Profile photo removed successfully: {videoName}");
                return true;
            }
            return false;
        }

        public async Task<bool> UpdateTalentCV(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #region TalentMatching

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetFullTalentList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public IEnumerable<TalentMatchingEmployerViewModel> GetEmployerList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #endregion

        #region Conversion Methods

        #region Update from View

        protected void UpdateSkillFromView(AddSkillViewModel model, UserSkill original)
        {
            original.ExperienceLevel = model.Level;
            original.Skill = model.Name;
        }

        protected void UpdateLanguageFromView(AddLanguageViewModel model, UserLanguage original)
        {
            original.LanguageLevel = model.Level;
            original.Language = model.Name;
        }

        protected void UpdateCertificationFromView(AddCertificationViewModel model, UserCertification original)
        {
            original.CertificationName = model.CertificationName;
            original.CertificationFrom = model.CertificationFrom;
            original.CertificationYear = model.CertificationYear;
        }

        protected void UpdateExperienceFromView(ExperienceViewModel model, UserExperience original)
        {
            original.Company = model.Company;
            original.Position = model.Position;
            original.Responsibilities = model.Responsibilities;
            original.Start = model.Start;
            original.End = model.End;
        }

        protected void UpdateEducationfromView(AddEducationViewModel model, UserEducation original)
        {
            original.Country = model.Country;
            original.Title = model.Title;
            original.InstituteName = model.InstituteName;
            original.Degree = model.Degree;
            original.YearOfGraduation = model.YearOfGraduation;
        }

        #endregion

        #region Build Views from Model

        protected AddSkillViewModel ViewModelFromSkill(UserSkill skill)
        {
            return new AddSkillViewModel
            {
                Id = skill.Id,
                Level = skill.ExperienceLevel,
                Name = skill.Skill
            };
        }

        protected AddLanguageViewModel ViewModelFromLanguage(UserLanguage language)
        {
            return new AddLanguageViewModel
            {
                Id = language.Id,
                Level = language.LanguageLevel,
                Name = language.Language
            };
        }

        protected ExperienceViewModel ViewModelFromExperience(UserExperience experience)
        {
            return new ExperienceViewModel
            {
                Id = experience.Id,
                Company = experience.Company,
                Responsibilities = experience.Responsibilities,
                Position = experience.Position,
                Start = experience.Start,
                End = experience.End,
            };
        }

        protected AddCertificationViewModel ViewModelFromCertification(UserCertification certificate)
        {
            return new AddCertificationViewModel
            {
                Id = certificate.Id,
                CertificationName = certificate.CertificationName,
                CertificationYear = certificate.CertificationYear,
                CertificationFrom = certificate.CertificationFrom
            };
        }

        protected AddEducationViewModel ViewModelFromEducation(UserEducation education) 
        {
            return new AddEducationViewModel
            {
                Id = education.Id,
                Country = education.Country,
                InstituteName = education.InstituteName,
                Title = education.Title,
                Degree = education.Degree,
                YearOfGraduation = education.YearOfGraduation,
            };        
        }

        #endregion

        #endregion

        #region ManageClients

        public async Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<ClientViewModel> ConvertToClientsViewAsync(Client client, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<int> GetTotalTalentsForClient(string clientId, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<Employer> GetEmployer(string employerId)
        {
            return await _employerRepository.GetByIdAsync(employerId);
        }
        #endregion

    }
}
