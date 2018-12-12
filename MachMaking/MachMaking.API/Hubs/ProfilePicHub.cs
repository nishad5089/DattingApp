using System.Security.Claims;
using System.Threading.Tasks;
using DattingApp.API.Dtos;
using DattingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace DattingApp.API.Hubs
{
// [Authorize(Policy = "MainPolicy")]
 [Authorize]
    public class ProfilePicHub: Hub
    {
           public  Task Send(Photo photo)
        {
            string userId =  Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
         // return  Clients.User(user).SendAsync("Send", photo);
            return Clients.User(userId).SendAsync("Send", photo);
        }
        //     public override Task OnConnectedAsync()
        // {
        //     base.OnConnectedAsync();
        //     var user = Context.User.Identity.Name;
        //     //Groups.AddAsync(Context.ConnectionId, user);

        //     return Task.CompletedTask;
        // }
    }
}