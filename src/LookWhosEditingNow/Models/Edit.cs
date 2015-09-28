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

        [PrimaryKeyColumn(AutoIncrement = false)]
        [DataMember(Name = "userId")]
        public int UserId { get; set; }
    }
}