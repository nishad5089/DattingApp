using System;
using Microsoft.AspNetCore.Http;

namespace DattingApp.API.Helper
{
    public static class Extention
    {
       // public this HttpResponse { get;set; }
        public static void AddApplicationError(this HttpResponse response, string message)
        {
            //this.HttpResponse = HttpResponse;
            response.Headers.Add("Application-Error", message);
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }
        public static int CalculateAge(this DateTime theDateTime)
        {
            var age = DateTime.Today.Year - theDateTime.Year;
            if (theDateTime.AddYears(age) > DateTime.Today)
                age--;

            return age;
        }
    }
}