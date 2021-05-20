using System;
using Microsoft.Extensions.Configuration;
using McMaster.Extensions.CommandLineUtils;
using System.Threading.Tasks;
using Azure.Identity;
using Microsoft.Identity.Client;
using Azure.Core;
using System.Security.Claims;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Linq;
using System.IO;
using Newtonsoft.Json;
using Ygdra.Cli.NetCore.Helpers;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using Ygdra.Core.Engine.Entities;
using System.Collections.Generic;

namespace Ygdra.Cli.NetCore
{
    enum ExitCode : int
    {
        Success = 0,
        Fail = 1
    }
    class Program
    {
        static string ClientId = "02991530-afbd-44b8-b9c9-8dd49dd5515f";


        // ygdra api to get engines
        static string enginesApi = "https://vjtygdraapivjtocw.azurewebsites.net/api/Engines";

        static async Task<int> Main(string[] args)
        {
            var credential = new DeviceCodeCredential();
            AuthenticationRecord auth = null;

            var app = new CommandLineApplication
            {
                Name = "y",
                Description = @"
__   __        _           
\ \ / /       | |          
 \ V /__ _  __| |_ __ __ _ 
  \ // _` |/ _` | '__/ _` |
  | | (_| | (_| | | | (_| |
  \_/\__, |\__,_|_|  \__,_|
      __/ |                
     |___/                 
This Cli let's you manage the ProjectY features exposes through it's API.",
            };

            app.HelpOption();

            app.Command("login", loginCommand =>
                {
                    loginCommand.Description = "Iniatiates a loging dialog or retrieves an ID and access token from the cache.";
                    var clientIdArg = loginCommand.Argument("Client ID", "The client ID for the registrated APP in AAD that the API is configured with.");
                    loginCommand.OnExecuteAsync(async x =>
                    {
                        if (clientIdArg.Value != null)
                        {
                            ClientId = clientIdArg.Value;
                        }
                        var user = await AuthorizationHelper.GetUserClaimsAsync(ClientId);



                        Console.WriteLine(String.Format("Welcome {0}, your have been authenticated. Your role: {1}", user.Identity.Name, user.IsInRole("Admin") ? "Admin" : "User"));
                    });

                });

            app.Command("create", createCommand =>
            {
                createCommand.OnExecute(() =>
                {
                    createCommand.ShowHelp();
                    return 1;
                });

                createCommand.Command("engine", createEngineCommand =>
                {
                    createEngineCommand.Description = "Creates a new engine request that can be deployed later using the 'deploy' command.";
                    var nameArg = createEngineCommand.Argument("name", "Name of the engine (used for generating other resource names).").IsRequired();
                    var typeArg = createEngineCommand.Argument("type", "The type of engine to send a request for. Currently 'databricks' & 'synapse' are supported.").IsRequired();
                    var ownersArg = createEngineCommand.Argument("owners", "List of owner email addresses.");
                    var membersArg = createEngineCommand.Argument("members", "List of member email addresses.");
                    var commentArg = createEngineCommand.Argument("comment", "Optional comment to accompany the request.");


                    createEngineCommand.OnExecuteAsync(async x =>
                    {

                        var engineToRequest = new YEngine()
                        {
                            Id = Guid.NewGuid(),
                            EngineName = nameArg.Value,
                            EngineType = typeArg.Value == "databricks" ? YEngineType.Databricks : YEngineType.Synapse,
                        };

                        var token = await AuthorizationHelper.GetAccessTokenAsync(ClientId);
                        var engine = await ApiWrapper.SaveEngineAsync<YEngine>(token, enginesApi + "/" + engineToRequest.Id.ToString(), engineToRequest);

                        Console.WriteLine(string.Format("Engine with name {0} was requested. It's id is {1} and the request status is {2} ", engine.EngineName, engine.Id, engine.Status.ToString()));
                        Console.WriteLine(JsonConvert.SerializeObject(engine));
                    });

                });
            });


            app.Command("list", doCommand =>
            {
                doCommand.OnExecute(() =>
                {
                    doCommand.ShowHelp();
                    return 1;
                });

                doCommand.Command("engines", thisCmd =>
                {
                    thisCmd.OnExecuteAsync(async x =>
                    {

                        var token = await AuthorizationHelper.GetAccessTokenAsync(ClientId);
                        var engines = await ApiWrapper.GetEnginesAsync<List<YEngine>>(token, enginesApi);


                        Console.WriteLine("{0,-20} {1,5}", "Name", "Status");

                        foreach (YEngine ye in engines)
                        {
                            Console.WriteLine("{0,-20} {1,5:N1}", ye.EngineName, ye.Status.ToString());
                        }
                    });
                });

                doCommand.Command("enginesold", thisCmd =>
            {
                thisCmd.Description = "Retrieves all engines available in a specific environment.";
                var arg1 = thisCmd.Argument("env", "The environment to retrieve from.").IsRequired();
                var arg2 = thisCmd.Argument("tenant", "The tenant hosting the environment").IsRequired();

                thisCmd.OnExecuteAsync(async x =>
                {
                    Console.WriteLine($"Getting engines for environment:  {arg1.Value} in tenant {arg2.Value}");

                    if (McMaster.Extensions.CommandLineUtils.Prompt.GetYesNo("Do you want to proceed?", false))
                    {
                        await Task.Run(() =>
                        {
                            Console.WriteLine("Engine 1");
                            Console.WriteLine("Engine 2");
                            Console.WriteLine("Engine 3");
                            Console.WriteLine("Engine 4");
                        });
                        return 0;
                    }
                    else
                    {
                        Console.WriteLine("Command cancelled.");
                        return 1;
                    }
                });
            });

                doCommand.Command("sources", thatCmd =>
                {
                    var json = thatCmd.Option("--json", "Json output format", CommandOptionType.NoValue);

                    thatCmd.OnExecuteAsync(async x =>
                    {
                        Console.WriteLine("Retrieving sources");
                        if (json.HasValue())
                        {
                            Console.WriteLine("{['sourcename':'source 1'],['sourcename':'source 2'],['sourcename':'source 2']}");
                        }
                        else
                        {
                            Console.WriteLine("Source 1");
                            Console.WriteLine("Source 2");
                            Console.WriteLine("Source 3");
                            Console.WriteLine("Source 4");
                        }
                        return 0;
                    });
                });
            });

            app.Command("commands", testCmd =>
            {
                testCmd.OnExecute(() =>
                {
                    Console.WriteLine();
                    Console.WriteLine("These are the available commands:");
                    Console.WriteLine("get engines");
                    Console.WriteLine("get sources");
                    Console.WriteLine();

                    return 0;
                });
            });

            app.OnExecute(() =>
            {
                app.ShowHelp();
                return 0;
            });

            return app.Execute(args);
        }

    }
}
