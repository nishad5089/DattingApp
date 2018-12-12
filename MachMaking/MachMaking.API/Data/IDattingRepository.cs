using System.Collections.Generic;
using System.Threading.Tasks;
using DattingApp.API.Models;

namespace DattingApp.API.Data
{
    public interface IDattingRepository
    {
         void Add<T>(T entity) where T: class;
         void Delete<T>(T entity) where T: class;
         Task<bool> SaveAll();
         Task<IEnumerable<User>> GetUsers();
         Task<User> GetUser(int id);
         Task<Photo> GetPhoto(int id);
          Task<Photo> GetMainPhotoForUser(int userId);
    }
}