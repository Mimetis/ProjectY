using McMaster.Extensions.CommandLineUtils;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Ygdra.Core.Auth;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Http;
using Ygdra.Core.Options;

namespace Ygdra.Cli.NetCore
{
    [Command("engines")]
    [Subcommand(typeof(EnginesListCommand))]
    public class EnginesCommand : AuthCommand
    {
        public EnginesCommand(IYAuthProvider authProvider,
                              IYHttpRequestHandler httpRequestHandler,
                              IOptions<YMicrosoftIdentityOptions> identityOptions) : base(authProvider, httpRequestHandler, identityOptions)
        {
        }

        public IServiceProvider ServiceProvider { get; }

        public override async Task<int> OnExecuteAsync(CommandLineApplication app)
        {
            app.ShowHelp();
            return 0;
        }
    }

    [Command("list")]
    public class EnginesListCommand : AuthCommand
    {
        public EnginesListCommand(IYAuthProvider authProvider,
                              IYHttpRequestHandler httpRequestHandler,
                              IOptions<YMicrosoftIdentityOptions> identityOptions) : base(authProvider, httpRequestHandler, identityOptions)
        {
        }

        [Option]
        public string Output { get; set; }

        public override async Task<int> OnExecuteAsync(CommandLineApplication app)
        {
            var response = await this.Client.ProcessRequestApiAsync<List<YEngine>>($"api/Engines", null).ConfigureAwait(false);

            if (response == null || response.Value == null)
                return 0;

            if (Output == "table")
            {
                Console.WriteLine($"Id\t\t\t\t\tName\t");
                Console.WriteLine($"------------------------------------\t--------------\t");

                foreach(var engine in response.Value)
                    Console.WriteLine($"{engine.Id}\t{engine.EngineName}");
                
            }
            else
            {
                var enginesString = JsonConvert.SerializeObject(response.Value, Formatting.Indented);
                Console.WriteLine(enginesString);

            }



            return 0;
        }
    }


    [Command("show")]
    public class EngineShowCommand : AuthCommand
    {
        public EngineShowCommand(IYAuthProvider authProvider,
                              IYHttpRequestHandler httpRequestHandler,
                              IOptions<YMicrosoftIdentityOptions> identityOptions) : base(authProvider, httpRequestHandler, identityOptions)
        {
        }

        [Argument(1, Description = "Engine Id. Should be a GUID", ShowInHelpText = true)]
        public string Id { get; set; }

        public IServiceProvider ServiceProvider { get; }

        public override async Task<int> OnExecuteAsync(CommandLineApplication app)
        {
            var response = await this.Client.ProcessRequestApiAsync<YEngine>($"api/Engines/{Id}", null).ConfigureAwait(false);
            var engine = response.Value;

            Console.WriteLine("called list");
            return 0;
        }
    }


}
