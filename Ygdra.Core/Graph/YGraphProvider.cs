using Microsoft.Graph;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;


namespace Ygdra.Core.Graph
{
    public class YGraphProvider : IYGraphProvider
    {
        public YGraphProvider(GraphServiceClient graphClient)
        {
            this.GraphClient = graphClient;
        }

        public GraphServiceClient GraphClient { get;}

        public Task<User> GetUserAsync(string name)
        {
            return GraphClient.Users[name].Request().GetAsync();
        }

        public Group ReadGroup(string name)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Group> ReadGroups(IEnumerable<string> names)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Group> ReadGroupsLike(string query)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<User> ReadMembersByObjectId(string objectId)
        {
            throw new NotImplementedException();
        }

        public IList<string> ReadMemberships(string name)
        {
            throw new NotImplementedException();
        }

        public IList<string> ReadMembershipsByObjectId(string objectId)
        {
            throw new NotImplementedException();
        }

        public string ReadObjectId(string appId)
        {
            throw new NotImplementedException();
        }

        public ServicePrincipal ReadPrincipal(string objectId)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ServicePrincipal> ReadPrincipals(IEnumerable<string> objectIds)
        {
            throw new NotImplementedException();
        }

      

        public object ReadUserByPrincipal(string principal)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<User> ReadUsers(IEnumerable<string> names)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<User> ReadUsersLike(string query)
        {
            throw new NotImplementedException();
        }

        public bool ValidateUser(string name)
        {
            throw new NotImplementedException();
        }
    }
}
