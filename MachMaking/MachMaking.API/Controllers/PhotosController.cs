using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DattingApp.API.Data;
using DattingApp.API.Dtos;
using DattingApp.API.Helper;
using DattingApp.API.Hubs;
using DattingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;

namespace DattingApp.API.Controllers {
    [Authorize]
    [Route ("api/users/{userId}/photos")]
    public class PhotosController : Controller {
        private readonly IDattingRepository _repo;
        private readonly IMapper _mapper;
        //IOptions<CloudinarySettings> used for retriving data from appsetting.json file CloudinarySettings data
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;

        private Cloudinary _cloudinary;
        private readonly IHubContext<ProfilePicHub> _profilePicHub;

        public PhotosController (IDattingRepository repo,
            IMapper mapper,
            IOptions<CloudinarySettings> cloudinaryConfig, IHubContext<ProfilePicHub> profilePicHub) {
            _profilePicHub = profilePicHub;
            _mapper = mapper;
            _repo = repo;
            _cloudinaryConfig = cloudinaryConfig;
       

// _cloudinaryConfig.Value.CloudName comes form configuration file
            Account acc = new Account (
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );

            _cloudinary = new Cloudinary (acc);
        }

        [HttpGet ("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto (int id) {
            var photoFromRepo = await _repo.GetPhoto (id);

            var photo = _mapper.Map<PhotoForReturnDto> (photoFromRepo);

            return Ok (photo);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser (int userId, PhotoForCreationDto photoDto) {
            var user = await _repo.GetUser (userId);

            if (user == null)
                return BadRequest ("Could not find user");

            var currentUserId = int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value);

            if (currentUserId != user.Id)
                return Unauthorized ();

            var file = photoDto.File;

            var uploadResult = new ImageUploadResult ();

            if (file.Length > 0) {
                using (var stream = file.OpenReadStream ()) {
                    var uploadParams = new ImageUploadParams () {
                    File = new FileDescription (file.Name, stream),
                    Transformation = new Transformation ().Width (500).Height (500).Crop ("fill").Gravity ("face")
                    };

                    uploadResult = _cloudinary.Upload (uploadParams);
                }
            }

            photoDto.Url = uploadResult.Uri.ToString ();
            photoDto.PublicId = uploadResult.PublicId;

            var photo = _mapper.Map<Photo> (photoDto);

            photo.User = user;

            if (!user.Photos.Any (m => m.IsMain))
                photo.IsMain = true;

            user.Photos.Add (photo);

            if (await _repo.SaveAll ()) {
                var photoToReturn = _mapper.Map<PhotoForReturnDto> (photo);
                return CreatedAtRoute ("GetPhoto", new { id = photo.Id }, photoToReturn);
            }

            return BadRequest ("Could not add the photo");
        }

        [HttpPost ("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto (int userId, int id) {
            if (userId != int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value))
                return Unauthorized ();
           
               
            
            var photoFromRepo = await _repo.GetPhoto (id);
            if (photoFromRepo == null)
                return NotFound ();

            if (photoFromRepo.IsMain)
                return BadRequest ("This is already the main photo");
          
            var currentMainPhoto = await _repo.GetMainPhotoForUser (userId);
            if (currentMainPhoto != null)
                currentMainPhoto.IsMain = false;
         // var currentUser = ClaimTypes.Name;
            photoFromRepo.IsMain = true;
     //  await _profilePicHub.Clients.User(userId.ToString()).SendAsync("Send", "Context.User");
          //  var currentUser = User.Identity.Name; 
        //  await _profilePicHub.Clients.All.SendAsync("send", currentUser);
         //  await _profilePicHub.Clients.Client(_context.ConnectionId).SendAsync("send",photoFromRepo);
         // await _profilePicHub.Clients.Client(_profilePicHub.co)
 // await _profilePicHub.Clients.All.SendAsync("Send", currentUser);
 // await _profilePicHub.Clients.All.SendAsync("Send", currentUser);
            if(await _repo.SaveAll ())
                return NoContent ();
     
            return BadRequest ("Could not set photo to main");
        }

        [HttpDelete ("{id}")]
        public async Task<IActionResult> DeletePhoto (int userId, int id) {
            if (userId != int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value))
                return Unauthorized ();

            var photoFromRepo = await _repo.GetPhoto (id);
            if (photoFromRepo == null)
                return NotFound ();

            if (photoFromRepo.IsMain)
                return BadRequest ("You cannot delete the main photo");

            if (photoFromRepo.PublicId != null) {
                var deleteParams = new DeletionParams (photoFromRepo.PublicId);

                var result = _cloudinary.Destroy (deleteParams);

                if (result.Result == "ok")
                    _repo.Delete (photoFromRepo);
            }

            if (photoFromRepo.PublicId == null) // for seeding data
            {
                _repo.Delete (photoFromRepo);
            }

            if (await _repo.SaveAll ())
                return Ok ();

            return BadRequest ("Failed to delete the photo");
        }

    }
}