using System.Dynamic;
using System.Runtime.Serialization;
using Umbraco.Core.Persistence;
using Umbraco.Core.Persistence.DatabaseAnnotations;

namespace LookWhosEditingToo.Models
{
    
    [TableName("LookWhosEditingNow")]
    [DataContract(Name = "edit")]
    public class Edit 
    {
        public Edit(){}   
        public Edit(int nodeId, int userId)
        {
            NodeId = nodeId;
            UserId = userId;
        }

        [PrimaryKeyColumn(AutoIncrement = true)]
        [DataMember(Name = "id")]
        public int Id { get; set; }

        [DataMember(Name = "nodeId")]
        public int NodeId { get; set; }

        [DataMember(Name = "userId")]
        public int UserId { get; set; }

        [Ignore]
        [DataMember(Name = "userName")]
        public string UserName { get; set; }

        [Ignore]
        [DataMember(Name = "userGravatar")]
        public string UserGravatar { get; set; }
    }
}