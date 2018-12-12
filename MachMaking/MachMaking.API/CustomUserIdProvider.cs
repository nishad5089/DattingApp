using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace DattingApp.API
{
    public class CustomUserIdProvider : IUserIdProvider
    {
   public string GetUserId(HubConnectionContext connection)
        {
            var conn = connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
             return conn; 
        }
    }
}