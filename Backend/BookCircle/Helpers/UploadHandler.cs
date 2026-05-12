namespace BookCircle.Helpers
{
    public class UploadHandler
    {
        public class UploadResult
        {
            public string ErrorMessage { get; set; }
            public string FileName { get; set; }
        }

        public static UploadResult Upload(IFormFile file, string folder)
        {
            
            if (file == null || file.Length == 0)
            {
                return new UploadResult
                {
                    ErrorMessage = "No file uploaded",
                    FileName = null
                };
            }

    
            List<string> validExtentions = new List<string>()
            {
                ".jpg", ".png", ".jpeg"
            };

            string extention = Path.GetExtension(file.FileName).ToLower();

            if (!validExtentions.Contains(extention))
            {
                return new UploadResult
                {
                    ErrorMessage = $"Extension is not valid ({string.Join(", ", validExtentions)})",
                    FileName = null
                };
            }

      
            long size = file.Length;

            if (size > (10 * 1024 * 1024))
            {
                return new UploadResult
                {
                    ErrorMessage = "Maximum size is 10MB",
                    FileName = null
                };
            }

            try
            {
                string fileName = Guid.NewGuid().ToString() + extention;

                string folderName = Path.Combine("Resources", folder);

                string path = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    folderName
                );

             
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                string fullPath = Path.Combine(path, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }

                return new UploadResult
                {
                    ErrorMessage = null,
                    FileName = Path.Combine(folderName, fileName)
                };
            }
            catch (Exception ex)
            {
                return new UploadResult
                {
                    ErrorMessage = ex.Message,
                    FileName = null
                };
            }
        }
    }
}