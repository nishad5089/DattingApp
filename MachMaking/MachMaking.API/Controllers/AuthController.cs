using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DattingApp.API.Data;
using DattingApp.API.Dtos;
using DattingApp.API.Hubs;
using DattingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DattingApp.API.Controllers {
    [Route ("api/[controller]")]
    public class AuthController : Controller {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
   private readonly IHubContext<ProfilePicHub> _profilePicHub;
        public AuthController (IAuthRepository repo, IConfiguration config, IMapper mapper,IHubContext<ProfilePicHub> profilePicHub) {
           
            _config = config;
            _repo = repo;
            _mapper = mapper;
            _profilePicHub = profilePicHub;
        }

        [HttpPost ("register")]
        public async Task<IActionResult> Register ([FromBody] UserForRegisterDto userForRegisterDto) {
            if (!string.IsNullOrEmpty (userForRegisterDto.Username))
                userForRegisterDto.Username = userForRegisterDto.Username.ToLower ();

            if (await _repo.UserExists (userForRegisterDto.Username))
                ModelState.AddModelError ("Username", "Username already exists");

            // validate request
            if (!ModelState.IsValid)
                return BadRequest (ModelState);

            var userToCreate = new User {
                UserName = userForRegisterDto.Username
            };

            var createUser = await _repo.Register (userToCreate, userForRegisterDto.Password);

            return StatusCode (201);
        }

        [HttpPost ("login")]
        public async Task<IActionResult> Login ([FromBody] UserForLoginDto userForLoginDto) {

            var userFromRepo = await _repo.Login (userForLoginDto.Username.ToLower (), userForLoginDto.Password);

            if (userFromRepo == null)
                return Unauthorized ();

            // generate token
            var tokenHandler = new JwtSecurityTokenHandler ();
            var key = Encoding.ASCII.GetBytes (_config.GetSection ("AppSettings:Token").Value);

            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity (new Claim[] {
                new Claim (ClaimTypes.NameIdentifier, userFromRepo.Id.ToString ()),
                new Claim (ClaimTypes.Name, userFromRepo.UserName)
                }),
                Expires = DateTime.Now.AddDays (1),
                SigningCredentials = new SigningCredentials (new SymmetricSecurityKey (key),
                SecurityAlgorithms.HmacSha512Signature)
            };
            var token = tokenHandler.CreateToken (tokenDescriptor);
            var tokenString = tokenHandler.WriteToken (token);
            var user = _mapper.Map<UserForListDto>(userFromRepo);
            
            //   await _profilePicHub.Clients.All.SendAsync ("send", user);
            return Ok (new { tokenString, user });
        }

    }
}