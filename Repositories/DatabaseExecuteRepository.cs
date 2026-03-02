using Dapper;
using Newtonsoft.Json;
using Repositories.Interfaces;
using Serilog;
using System.Collections;
using System.Data;


namespace Repositories
{
    public class DatabaseExecuteRepository<T> : IDatabaseExecuteRepository<T>
    {
        private readonly ISQLServerConnection _database;
        public DatabaseExecuteRepository(ISQLServerConnection database)
        {
            _database = database;
        }


        public T ExcecuteProceduceQuery(string sql, Dictionary<string, string> paramArguments)
        {
            using (var _conn = _database.CreateConnection())
            {
                //add dynamic argument parameters
                DynamicParameters parameter = new DynamicParameters();
                foreach (KeyValuePair<string, string> argItem in paramArguments)
                {
                    parameter.Add($"@{argItem.Key}", argItem.Value);
                }
                var result = _conn.QueryFirstOrDefault<T>(sql, parameter, commandType: CommandType.StoredProcedure);
                return result;
            }
        }

        public V ExcecuteProceduceQuery<V>(string sql, Dictionary<string, string> paramArguments)
        {
            using (var _conn = _database.CreateConnection())
            {
                //add dynamic argument parameters
                DynamicParameters parameter = new DynamicParameters();
                foreach (KeyValuePair<string, string> argItem in paramArguments)
                {
                    parameter.Add($"@{argItem.Key}", argItem.Value);
                }
                var result = _conn.QueryFirstOrDefault<V>(sql, parameter, commandType: CommandType.StoredProcedure);
                return result;
            }
        }


        public IEnumerable<T> ExcecuteSelectProceduceQuery<T>(string sql, DynamicParameters parameter)
        {
            //create connection string to database
            using (var _conn = _database.CreateConnection())
            {
                var result = _conn.Query<T>(sql, parameter, commandType: CommandType.StoredProcedure);

                return result;
            }
        }




        public IEnumerable<T> ExcecuteSelectProceduceQuery(string sql, Dictionary<string, string> paramArguments)
        {
            //create connection string to database
            using (var _conn = _database.CreateConnection())
            {
                //add dynamic argument parameters
                DynamicParameters parameter = new DynamicParameters();
                foreach (KeyValuePair<string, string> argItem in paramArguments)
                {
                    parameter.Add($"@{argItem.Key}", argItem.Value);
                }
                var result = _conn.Query<T>(sql, parameter, commandType: CommandType.StoredProcedure);

                return result;
            }
        }

        public IEnumerable<T> ExcecuteSelectProceduceQuery(string sql)
        {
            //create connection string to database
            using (var _conn = _database.CreateConnection())
            {

                var result = _conn.Query<T>(sql, commandType: CommandType.StoredProcedure);

                return result;
            }
        }



        public T ExcecuteTextQuery(string sql, Dictionary<string, string> paramArguments)
        {
            using (var _conn = _database.CreateConnection())
            {
                //add dynamic argument parameters
                DynamicParameters parameter = new DynamicParameters();
                foreach (KeyValuePair<string, string> argItem in paramArguments)
                {
                    parameter.Add($"@{argItem.Key}", argItem.Value);
                }
                var result = _conn.QueryFirstOrDefault<T>(sql, parameter, commandType: CommandType.Text);

                return result;
            }
        }


        public IEnumerable<dynamic> ExcecuteProceduceQuery(string sql,
            Dictionary<string, string> paramArguments, params string[] allowFields)
        {
            if (allowFields != null && allowFields.Length > 0)
            {
                return QueryWithAllowField(sql, paramArguments, allowFields); //query require field
            }

            return QuerySelectAll(sql, paramArguments); //query allow all field
        }


        public (IEnumerable<T> data, long paramOut, Exception exception, IDictionary stats) ExcecuteProceduceQuery<T>(string sql, Dictionary<string, string> paramArguments, string paramOutput)
        {
            return QuerySelectAll<T>(sql, paramArguments, paramOutput); //query allow all field
        }

        private IEnumerable<dynamic> QueryWithAllowField(string sql,
            Dictionary<string, string> paramArguments, params string[] allowFields)
        {
            //create connection string to database
            using (var _conn = _database.CreateConnection())
            {
                //add dynamic argument parameters
                DynamicParameters parameter = new DynamicParameters();
                foreach (KeyValuePair<string, string> argItem in paramArguments)
                {
                    parameter.Add($"@{argItem.Key}", argItem.Value);
                }

                IDataReader reader = null;
                reader = _conn.ExecuteReader(sql, parameter, commandType: CommandType.StoredProcedure);

                while (reader.Read())
                {
                    Dictionary<string, object> item = new Dictionary<string, object>();
                    for (int i = 0; i < allowFields.Length; i++)
                    {
                        item.Add(allowFields[i], reader[allowFields[i]]);
                    }
                    yield return item;
                }
            }
        }

        private IEnumerable<dynamic> QuerySelectAll(string sql, Dictionary<string, string> paramArguments)
        {
            //create connection string to database
            using (var _conn = _database.CreateConnection())
            {
                //add dynamic argument parameters
                DynamicParameters parameter = new DynamicParameters();
                foreach (KeyValuePair<string, string> argItem in paramArguments)
                {
                    parameter.Add($"@{argItem.Key}", argItem.Value);
                }
                var result = _conn.Query(sql, parameter, commandType: CommandType.StoredProcedure);

                return result;
            }
        }

        private (IEnumerable<T> data, long paramOut, Exception exception, IDictionary stats) QuerySelectAll<T>(string sql, Dictionary<string, string> paramArguments, string paramOutput)
        {
            IEnumerable<T> results = default(IEnumerable<T>);
            Exception _exception = null;
            //create connection string to database
            using (var _conn = _database.CreateConnectionWithStats())
            {
                //add dynamic argument parameters
                DynamicParameters parameter = new DynamicParameters();
                foreach (KeyValuePair<string, string> argItem in paramArguments)
                {
                    parameter.Add($"@{argItem.Key}", argItem.Value);
                }


                parameter.Add($"@{paramOutput}", dbType: DbType.Int64, direction: ParameterDirection.Output);

                try
                {
                    results = _conn.Query<T>(sql, parameter, commandType: CommandType.StoredProcedure);
                }
                catch (Exception originalException)
                {
                    _exception = originalException;// AddAdditionalInfoToException(originalException, $"Error:{sql}", sql, paramArguments);
                }

                var stats = _conn.RetrieveStatistics();
                if (_exception != null)
                {
                    LogError("ReadData:", stats, sql, JsonConvert.SerializeObject(paramArguments));
                    LogError("ErrorData:", stats, sql, JsonConvert.SerializeObject(_exception));
                }

                return (results, parameter.Get<long>($"{paramOutput}"), _exception, stats);
            }
        }


        public (Exception exception, IEnumerable<VT> data) ExecuteAsTableTuple<VT>(string sql, DataTable table, string asTable)
        {
            Exception _exception = null;

            //create connection string to database
            using (var _conn = _database.CreateConnectionWithStats())
            {

                try
                {

                    //int commitResult = _conn.Execute(sql, new { dataset = table.AsTableValuedParameter(asTable) }, commandType: CommandType.StoredProcedure);
                    var commitResult = _conn.Query<VT>(sql, new { dataset = table.AsTableValuedParameter(asTable) }, commandType: CommandType.StoredProcedure);

                    return (_exception, commitResult);

                }
                catch (Exception originalException)
                {
                    _exception = AddAdditionalInfoToException(originalException, $"Error:{sql} - ValueTableName: {asTable}", sql);

                    Log.Error(originalException, $"{originalException.Message}, {JsonConvert.SerializeObject(originalException.InnerException)}");
                }

                var stats = _conn.RetrieveStatistics();
                if (_exception != null)
                {
                    LogError("InsertData:", stats, sql, $"ValueTableName:{asTable}, {_exception.Message}, {_exception.StackTrace}");

                }

                return (_exception, default(IEnumerable<VT>));
            }
        }


        public Exception ExcecuteAsTable(string sql, DataTable table, string asTable)
        {
            Exception _exception = null;
            //create connection string to database
            using (var _conn = _database.CreateConnectionWithStats())
            {

                try
                {
                    int commitResult = _conn.Execute(sql, new { dataset = table.AsTableValuedParameter(asTable) }, commandType: CommandType.StoredProcedure);


                }
                catch (Exception originalException)
                {


                    _exception = AddAdditionalInfoToException(originalException, $"Error:{sql} - ValueTableName: {asTable}", sql);
                }

                var stats = _conn.RetrieveStatistics();
                if (_exception != null)
                {
                    LogError("InsertData:", stats, sql, $"ValueTableName:{asTable}");

                }

                return _exception;
            }
        }

        public int ExcecuteNonQuery(string sql, Dictionary<string, string> paramArguments)
        {
            using (var _conn = _database.CreateConnection())
            {
                //add dynamic argument parameters
                DynamicParameters parameter = new DynamicParameters();
                foreach (KeyValuePair<string, string> argItem in paramArguments)
                {
                    parameter.Add($"@{argItem.Key}", argItem.Value);
                }


                parameter.Add(name: "@RetVal", dbType: DbType.Int32, direction: ParameterDirection.ReturnValue);

                var result = _conn.Execute(sql, parameter, commandType: CommandType.StoredProcedure);

                int retValue = parameter.Get<int>("@RetVal");

                return retValue;
            }
        }

        public int ExcecuteNonQuery(string sql, DynamicParameters parameters)
        {
            using (var _conn = _database.CreateConnection())
            {
                //parameters.Add(name: "@RetVal", dbType: DbType.Int32, direction: ParameterDirection.ReturnValue);
                var result = _conn.ExecuteScalar(sql, parameters, commandType: CommandType.StoredProcedure);
                //int retValue = parameters.Get<int>("@RetVal");
                return (int)result;
            }
        }


        public IEnumerable<dynamic> ExcecuteQuery(string sql)
        {
            //create connection string to database
            using (var _conn = _database.CreateConnection())
            {
                return _conn.Query(sql).AsEnumerable<dynamic>();
            }


        }

        private Exception AddAdditionalInfoToException(Exception originalException, string message, string sql, object parameters = null)
        {
            var additionalInfoException = new Exception(message, originalException);
            additionalInfoException.Data.Add("SQL", sql);
            additionalInfoException.Data.Add("Message", originalException.Message);
            additionalInfoException.Data.Add("StackTrace", originalException.StackTrace);

            if (parameters != null)
            {
                var props = parameters.GetType().GetProperties();
                foreach (var prop in props)
                {
                    additionalInfoException.Data.Add(prop.Name, prop.GetValue(parameters));
                }
            }


            return additionalInfoException;
        }

        private void LogError(string logPrefix, IDictionary stats, string sql, string parameters = null)
        {
            long elapsedMilliseconds = (long)stats["ConnectionTime"];
            var datalog = new
            {
                SQL = sql,
                Parameters = parameters,
                ExecutionTime = stats["ExecutionTime"],
                NetworkServerTime = stats["NetworkServerTime"],
                BytesSent = stats["BytesSent"],
                BytesReceived = stats["BytesReceived"],
                SelectRows = stats["SelectRows"]
            };
            Log.Error("{logPrefix} in {ElaspedTime:0.0000} ms: {datalog}", logPrefix, elapsedMilliseconds, datalog);
        }

        private void LogError(string logPrefix, string sql, string message)
        {
            var datalog = new
            {
                SQL = sql,
                Message = message
            };
            Log.Error("{logPrefix}-SQL:{sql}-Message:{Message}", logPrefix, datalog);
        }
    }
}
