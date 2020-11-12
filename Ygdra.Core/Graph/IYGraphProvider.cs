using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Ygdra.Core.Graph
{
    public interface IYGraphProvider
    {

        GraphServiceClient GraphClient { get; }

        /// <summary>
        /// Given a user principal name returns the azure directory user object
        /// </summary>
        /// <param name="name">email or id</param>
        /// <returns>user object</returns>           
        Task<User> GetUserAsync(string name);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="principal"></param>
        /// <returns></returns>
        object ReadUserByPrincipal(string principal);

        /// <summary>
        /// Given a user principal name returns the azure directory user object
        /// </summary>
        /// <param name="names">It is of alias@microsoft.com format</param>
        /// <returns>user object</returns>           
        IEnumerable<User> ReadUsers(IEnumerable<string> names);

        /// <summary>
        /// Given a user principal name returns the security group memberships.
        /// </summary>
        /// <param name="name">It is of alias@microsoft.com format</param>
        /// <returns>list of the names of the security groups</returns>   
        IList<string> ReadMemberships(string name);

        /// <summary>
        /// Given a user object id returns the security group memberships.
        /// </summary>
        /// <param name="objectId">It is a unique identifier for any entity in AAD</param>
        /// <returns>list of the names of the security groups</returns> 
        IList<string> ReadMembershipsByObjectId(string objectId);

        /// <summary>
        /// Given a group display name or group mail id returns the azure directory group object
        /// </summary>
        /// <param name="name">It is of groupid@microsoft.com format / only the display name of the group</param>
        /// <returns>group object</returns>
        Group ReadGroup(string name);

        /// <summary>
        /// Given a group display name or group mail id returns the azure directory group object
        /// </summary>
        /// <param name="names">It is of groupid@microsoft.com format / only the display name of the group</param>
        /// <returns>group object</returns>
        IEnumerable<Group> ReadGroups(IEnumerable<string> names);

        /// <summary>
        /// Given a group object id returns the members of the group
        /// </summary>
        /// <param name="objectId">It is a unique identifier for any entity in AAD</param>
        /// <returns>list of members of the groups</returns>  
        IEnumerable<User> ReadMembersByObjectId(string objectId);

        /// <summary>
        /// Given an AAD objectid this method returns the Service Principal object
        /// </summary>
        /// <param name="objectId"></param>
        /// <returns></returns>
        ServicePrincipal ReadPrincipal(string objectId);

        /// <summary>
        /// Given an AAD objectid this method returns the Service Principal object
        /// </summary>
        /// <param name="objectIds"></param>
        /// <returns></returns>
        IEnumerable<ServicePrincipal> ReadPrincipals(IEnumerable<string> objectIds);

        /// <summary>
        /// Given an AAD search query this method returns top 10 users matching the query
        /// </summary>
        /// <param name="query"></param>
        /// <returns>List of users</returns>
        IEnumerable<User> ReadUsersLike(string query);

        /// <summary>
        /// Given an AAD search query this method returns top 10 groups matching the query
        /// </summary>
        /// <param name="query"></param>
        /// <returns>List of groups</returns>
        IEnumerable<Group> ReadGroupsLike(string query);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="appId"></param>
        /// <returns></returns>
        string ReadObjectId(string appId);
    }
}
