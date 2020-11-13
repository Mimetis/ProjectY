using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ygdra.Host.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class TestController : ControllerBase
    {
        [HttpGet()]
        public async Task<ActionResult<Person>> GetPersonAsync()
        {

            return new Male { Name = "Seb" };

        }
    }

    public abstract class Person
    {
        public string Name { get; set; }

        public abstract int Gender { get; }
    }

    public class Male : Person
    {

        public override int Gender { get => 1; }
    }
}
