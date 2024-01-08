using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Talent.Common.Aws;
using Talent.Common.Contracts;

namespace Talent.Common.Services
{
    public class FileService : IFileService
    {
        private readonly IHostingEnvironment _environment;
        private readonly string _tempFolder;
        private IAwsService _awsService;
        private AwsOptions _options;

        public FileService(IHostingEnvironment environment, 
            IAwsService awsService)
        {
            _environment = environment;
            _tempFolder = "images\\";
            _awsService = awsService;
        }

        //public async Task<string> GetFileURL(string id, FileType type)
        //{
        //    //Your code here;
        //    var relativePath = _tempFolder + id;
        //    var absolutePath = Path.Combine(_environment.WebRootPath, relativePath);
        //    return absolutePath;
        //}

        //public async Task<string> SaveFile(IFormFile file, FileType type)
        //{
        //    //var myUniqueFileName = "";
        //    //string pathWeb = "";
        //    //pathWeb = _environment.WebRootPath;

        //    //// Set your desired folder
        //    //string _tempFolder = "images\\";

        //    //if (file != null && type == FileType.ProfilePhoto && pathWeb != "")
        //    //{
        //    //    string pathValue = Path.Combine(pathWeb, _tempFolder);
        //    //    myUniqueFileName = $@"{DateTime.Now.Ticks}_" + file.FileName;
        //    //    var path = Path.Combine(pathValue, myUniqueFileName);

        //    //    // Before saving the file, create the directory if it doesn't exist
        //    //    Directory.CreateDirectory(pathValue);

        //    //    using (var fileStream = new FileStream(path, FileMode.Create))
        //    //    {
        //    //        await file.CopyToAsync(fileStream);
        //    //    }

        //    //    Console.WriteLine(path);
        //    //}

        //    //return myUniqueFileName;
        //    //

        //    var myUniqueFileName = "";
        //    string pathWeb = "";
        //    pathWeb = _environment.WebRootPath;

        //    if (file != null && type == FileType.ProfilePhoto && pathWeb != "")
        //    {
        //        string pathValue = pathWeb + _tempFolder;
        //        myUniqueFileName = $@"{DateTime.Now.Ticks}_" + file.FileName;
        //        var path = pathValue + myUniqueFileName;
        //        using (var fileStream = new FileStream(path, FileMode.Create))
        //        {
        //            await file.CopyToAsync(fileStream);
        //        }
        //        Console.WriteLine(path);
        //    }
        //    return myUniqueFileName;
        //}

        public async Task<string> GetFileURL(string id, FileType type)
        {
            try
            {
                var relativePath = _tempFolder + id;
                var absolutePath = Path.Combine(_environment.WebRootPath, relativePath);

                // Check if the file exists before returning the path
                if (File.Exists(absolutePath))
                {
                    return relativePath;
                }

                // Handle the case when the file doesn't exist
                Console.WriteLine($"File not found: {absolutePath}");
                return string.Empty;
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error during file URL retrieval: {e.Message}");
                throw;
            }
        }

        public async Task<string> SaveFile(IFormFile file, FileType type)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    throw new ArgumentException("File is null or empty.");
                }

                var fileExtension = Path.GetExtension(file.FileName);
                List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

                if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
                {
                    throw new ArgumentException("Invalid file extension.");
                }

                var relativePath = _tempFolder + $@"{DateTime.Now.Ticks}_{file.FileName}";
                var absolutePath = Path.Combine(_environment.WebRootPath, relativePath);

                using (var fileStream = new FileStream(absolutePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                Console.WriteLine(absolutePath);
                return relativePath;
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error during file save: {e.Message}");
                throw;
            }
        }

        public async Task<bool> DeleteFile(string fileName, FileType type)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(fileName))
                {
                    // Handle the case where the file name is empty or null
                    Console.WriteLine("File name is empty or null.");
                    return false;
                }

                var filePath = Path.Combine(_environment.WebRootPath, _tempFolder, fileName);

                if (File.Exists(filePath))
                {
                    // Delete the file if it exists
                    File.Delete(filePath);
                    Console.WriteLine($"File deleted successfully: {filePath}");
                    return true;
                }

                // Handle the case where the file doesn't exist
                Console.WriteLine($"File not found for deletion: {filePath}");
                return false;
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error during file deletion: {e.Message}");
                return false;
            }
        }

        #region Document Save Methods

        private async Task<string> SaveFileGeneral(IFormFile file, string bucket, string folder, bool isPublic)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        
        private async Task<bool> DeleteFileGeneral(string id, string bucket)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        #endregion
    }
}
