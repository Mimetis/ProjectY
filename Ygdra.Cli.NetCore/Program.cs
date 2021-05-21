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
using Ygdra.Core.Payloads;

namespace Ygdra.Cli.NetCore
{
    enum ExitCode : int
    {
        Success = 0,
        Fail = 1
    }
    class Program
    {
        //static string ClientId = "02991530-afbd-44b8-b9c9-8dd49dd5515f";

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
                    loginCommand.Description = "Iniatiates a login dialog or retrieves an ID and access token from the cache. This also let's you configure the URL to the API you want to connect to using the -a <APIURL> parameter";
                   
                    loginCommand.OnExecuteAsync(async x =>
                    {
                        string clientId = null;
                        string apiUrl = null;

                        var clientIdOpt = loginCommand.Option("-c|--clientId <CLIENTID>", "The client ID for the registrated APP in AAD that the API is configured with.", CommandOptionType.SingleValue);

                        if (clientIdOpt.HasValue())
                        {
                            clientId = clientIdOpt.Value();
                        }

                        if (clientId == null)
                        {
                            clientId = Environment.GetEnvironmentVariable("Ygdra-ClientId", EnvironmentVariableTarget.User);
                        }

                        if (clientId == null)
                        {
                            clientId = McMaster.Extensions.CommandLineUtils.Prompt.GetString("What is your tenant application Id (Client ID)?",
                   promptColor: ConsoleColor.White,
                   promptBgColor: ConsoleColor.DarkGreen);

                            Environment.SetEnvironmentVariable("Ygdra-ClientId", clientId, EnvironmentVariableTarget.User);
                        }

                        var apiUrlOpt = loginCommand.Option("-a|--apiurl <APIURL>", "The URL to the API the Cli should be calling.", CommandOptionType.SingleValue);

                        if (apiUrlOpt.HasValue())
                        {
                            apiUrl = apiUrlOpt.Values[0];

                            Environment.SetEnvironmentVariable("Ygdra-ApiUrl", apiUrl, EnvironmentVariableTarget.User);
                        }

                        if (apiUrl == null)
                        {
                            apiUrl = Environment.GetEnvironmentVariable("Ygdra-ApiUrl", EnvironmentVariableTarget.User);
                        }

                        if (apiUrl == null)
                        {
                            apiUrl = McMaster.Extensions.CommandLineUtils.Prompt.GetString("What is the URL of the API you want the Cli to call (example: https://myygdrahostapi.azurewebsites.net/api)?",
                   promptColor: ConsoleColor.White,
                   promptBgColor: ConsoleColor.DarkGreen);

                            Environment.SetEnvironmentVariable("Ygdra-ApiUrl", apiUrl, EnvironmentVariableTarget.User);
                        }

                        var user = await AuthorizationHelper.GetUserClaimsAsync(clientId);

                        Console.WriteLine(String.Format("Welcome {0}, your have been authenticated.\nYour role: {1}.\nThe Cli will connect to the API at {2}", user.Identity.Name, user.IsInRole("Admin") ? "Admin" : "User", apiUrl));
                    });

                });

            app.Command("create", createCommand =>
            {
                createCommand.Description = "Creates artifacts. The options are engine (representing an engine request), datasource & entity.";
                createCommand.OnExecute(() =>
                {
                    createCommand.ShowHelp();
                    return 1;
                });

                createCommand.Command("engine", createEngineCommand =>
                {
                    createEngineCommand.Description = "Creates a new engine request that can be deployed later as an admin using the 'deploy' command.";

                    var nameOpt = createEngineCommand.Option("-n|--name <NAME>", "Engine name. Only digits and lower case, no special characters. Length between 5 and 10 characters.", CommandOptionType.SingleValue).IsRequired();
                    var typeOpt = createEngineCommand.Option("-t|--type <TYPE>", "Engine type. The type of engine to send a request for. Currently 'databricks' & 'synapse' are supported.", CommandOptionType.SingleValue);

                    var ownersOpt = createEngineCommand.Option("-o", "List of owners for the engine entity. This is a comma seperated list of AAD user object IDs.", CommandOptionType.SingleValue);
                    var membersOpt = createEngineCommand.Option("-m", "List of members for the engine entity. This is a comma seperated list of AAD user object IDs.", CommandOptionType.SingleValue);
                    var commentOpt = createEngineCommand.Option("-c", "A comment that will be attached to the request to guide admin approval.", CommandOptionType.SingleValue);

                    createEngineCommand.OnExecuteAsync(async x =>
                    {

                        var engineToRequest = new YEngine()
                        {
                            Id = Guid.NewGuid(),
                            EngineName = nameOpt.Values[0]
                            
                        };

                        if(typeOpt.HasValue())
                        {
                            engineToRequest.EngineType = typeOpt.Values[0] == "databricks" ? YEngineType.Databricks : YEngineType.Synapse;
                        }

                        var owners = new List<YPerson>();
                        var members = new List<YPerson>();

                        if (ownersOpt.HasValue())
                        {
                            foreach (string ownerId in ownersOpt.Value().Split(','))
                            {
                                owners.Add(new YPerson() { Id = Guid.Parse(ownerId) });
                            }
                        }

                        if (membersOpt.HasValue())
                        {
                            foreach (string memberId in membersOpt.Value().Split(','))
                            {
                                members.Add(new YPerson() { Id = Guid.Parse(memberId) });
                            }
                        }

                        if(commentOpt.HasValue())
                        {
                            engineToRequest.Comments = commentOpt.Value();
                        }

                        engineToRequest.Owners = owners;
                        engineToRequest.Members = members;

                        var clientId = GetClientId();

                        var token = await AuthorizationHelper.GetAccessTokenAsync(clientId);
                        var engine = await ApiWrapper.SaveEngineAsync<YEngine>(token, engineToRequest.Id.ToString(), engineToRequest);

                        Console.WriteLine(string.Format("Engine with name {0} was requested. It's id is {1} and the request status is {2} ", engine.EngineName, engine.Id, engine.Status.ToString()));
                        Console.WriteLine(JsonConvert.SerializeObject(engine,Formatting.Indented));
                    });

                });
            });


            app.Command("deploy", deployCommand =>
            {
                deployCommand.Description = "Takes the id of an engine request and starts deploying it.";

                var engineIdOpt = deployCommand.Option("-e|--engineid <ENGINEID>", "Engine Id that identifies the engine to be deployed.", CommandOptionType.SingleValue).IsRequired();
                var deploymentLocationOpt = deployCommand.Option("-l|--location <LOCATION>", "The location where the engine should be deployed (eg. WestEurope, NorthEurope, EastUS, ...).", CommandOptionType.SingleValue);
                var resourceGroupOpt = deployCommand.Option("-r|--resourcegroup <RESOURCEGROUP>", "The resource group in whichthe engine should be deployed.", CommandOptionType.SingleValue);


                //location/rg name/ 

                string location = null;
                string resourceGroup = null;
                if(deploymentLocationOpt.HasValue())
                {
                    location = deploymentLocationOpt.Value();
                }

                if(resourceGroupOpt.HasValue())
                {
                    resourceGroup = resourceGroupOpt.Value();
                }

                deployCommand.OnExecuteAsync(async x =>
                {
                    var clientId = GetClientId();
                    var token = await AuthorizationHelper.GetAccessTokenAsync(clientId);
                    var deploymentState = await ApiWrapper.DeployEngineAsync<YDeploymentStatePayload>(token, engineIdOpt.Value(), location, resourceGroup);

                    Console.WriteLine(JsonConvert.SerializeObject(deploymentState,Formatting.Indented));
                });
            });

            app.Command("list", listCommand =>
        {
            listCommand.OnExecute(() =>
            {
                listCommand.ShowHelp();
                return 1;
            });

            listCommand.Command("engines", thisCmd =>
            {
                thisCmd.OnExecuteAsync(async x =>
                {
                    var clientId = GetClientId();

                    var token = await AuthorizationHelper.GetAccessTokenAsync(clientId);
                    var engines = await ApiWrapper.GetEnginesAsync<List<YEngine>>(token);


                    Console.WriteLine("{0,-20} {1,5}", "Name", "Status");

                    foreach (YEngine ye in engines)
                    {
                        Console.WriteLine("{0,-20} {1,5:N1}", ye.EngineName, ye.Status.ToString());
                    }
                });
            });

            listCommand.Command("enginesold", thisCmd =>
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

            listCommand.Command("sources", thatCmd =>
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


            app.OnExecute(() =>
            {
                app.ShowHelp();
                return 0;
            });

            return app.Execute(args);
        }

        private static string GetClientId()
        {
            var clientId = Environment.GetEnvironmentVariable("Ygdra-ClientId", EnvironmentVariableTarget.User);

            if (clientId == null)
            {
                throw new Exception("Use the login command to set the client Id and persist in your user profile as an environment variable.");
            }

            return clientId;
        }

    }
}
