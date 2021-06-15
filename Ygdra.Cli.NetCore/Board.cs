using McMaster.Extensions.CommandLineUtils;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Cli.NetCore
{
    [Subcommand(typeof(EnginesCommand))]
    [Subcommand(typeof(AuthCommand))]
    public class Board
    {
        public Board()
        {
        }

        protected int OnExecute(CommandLineApplication app)
        {
            // this shows help even if the --help option isn't specified
            //app.ShowHelp();
            Console.WriteLine("Show Board");
            return 1;
        }

    }
}
