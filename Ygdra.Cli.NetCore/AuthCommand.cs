using McMaster.Extensions.CommandLineUtils;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Ygdra.Cli.NetCore.Helpers;
using Ygdra.Core.Auth;
using Ygdra.Core.Http;
using Ygdra.Core.Options;

namespace Ygdra.Cli.NetCore
{
    [Command("login", Description = "log in using your Azure AD identifier")]
    public class AuthCommand
    {
        public AuthCommand(IYAuthProvider authProvider,
            IYHttpRequestHandler client,
            IOptions<YMicrosoftIdentityOptions> azureAdOptions)
        {
            AzureAdOptions = azureAdOptions.Value;
            AuthProvider = authProvider;
            Client = client;
        }

        [Option(Description = "Client Id")]
        public string ClientId { get; set; }

        [Option(Description = "Domain")]
        public string Domain { get; set; }

        public YMicrosoftIdentityOptions AzureAdOptions { get; }

        public IYAuthProvider AuthProvider { get; }
        public IYHttpRequestHandler Client { get; }

        private bool EnsureClientId()
        {
            if (string.IsNullOrEmpty(ClientId))
                ClientId = AzureAdOptions.ClientId;

            if (string.IsNullOrEmpty(ClientId))
                ClientId = Prompt.GetString("What is your tenant application Id (Client Id)?",
                        promptColor: ConsoleColor.White,
                        promptBgColor: ConsoleColor.DarkGreen);

            if (string.IsNullOrEmpty(ClientId))
            {
                Console.WriteLine("Can't login without a Client Id value.");
                return false;
            }

            return true;
        }

        private bool EnsureDomain()
        {
            if (string.IsNullOrEmpty(Domain))
                Domain = AzureAdOptions.Domain;

            if (string.IsNullOrEmpty(Domain))
                Domain = Prompt.GetString("What is your domain name?",
                        promptColor: ConsoleColor.White,
                        promptBgColor: ConsoleColor.DarkGreen);

            if (string.IsNullOrEmpty(Domain))
            {
                Console.WriteLine("Can't login without an Domain value.");
                return false;
            }

            return true;
        }

        public async Task<bool> LoginAsync()
        {
            if (!EnsureClientId() || !EnsureDomain())
                return false;

            await this.AuthProvider.GetAccessTokenForUserApiAsync();


            var rootPath = Path.Join(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".ygdra");
            var filePath = Path.Join(rootPath, "ygdra.json");

            if (!Directory.Exists(rootPath))
                Directory.CreateDirectory(rootPath);



            return true;

        }

        public virtual async Task<int> OnExecuteAsync(CommandLineApplication app)
        {
            await LoginAsync();
            return 0;
        }

    }
}
