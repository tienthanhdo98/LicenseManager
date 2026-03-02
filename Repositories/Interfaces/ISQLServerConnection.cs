using System.Data;
using System.Data.SqlClient;

namespace Repositories.Interfaces
{
    public interface ISQLServerConnection
    {
        IDbConnection CreateConnection();

        SqlConnection CreateConnectionWithStats();
    }
}
