using Dapper;
using System.Collections;
using System.Data;

namespace Repositories.Interfaces
{
    public interface IDatabaseExecuteRepository<T>
    {
        IEnumerable<dynamic> ExcecuteProceduceQuery(string sql,
          Dictionary<string, string> paramArguments, params string[] allowFields);

        IEnumerable<dynamic> ExcecuteQuery(string sql);

        (IEnumerable<T> data, long paramOut, Exception exception, IDictionary stats) ExcecuteProceduceQuery<T>(string sql, Dictionary<string, string> paramArguments, string paramOutput);

        Exception ExcecuteAsTable(string sql, DataTable table, string asTable);
        (Exception exception, IEnumerable<VT> data) ExecuteAsTableTuple<VT>(string sql, DataTable table, string asTable);

        T ExcecuteTextQuery(string sql, Dictionary<string, string> paramArguments);

        T ExcecuteProceduceQuery(string sql, Dictionary<string, string> paramArguments);

        IEnumerable<T> ExcecuteSelectProceduceQuery(string sql, Dictionary<string, string> paramArguments);

        IEnumerable<T> ExcecuteSelectProceduceQuery(string sql);

        int ExcecuteNonQuery(string sql, Dictionary<string, string> paramArguments);

        int ExcecuteNonQuery(string sql, DynamicParameters parameters);

        V ExcecuteProceduceQuery<V>(string sql, Dictionary<string, string> paramArguments);

        IEnumerable<T> ExcecuteSelectProceduceQuery<T>(string sql, DynamicParameters parameter);


    }
}
