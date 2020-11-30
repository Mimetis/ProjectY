import pandas as pd
from pyspark.sql import functions as F
from pyspark.sql.functions import isnan, when, count, col


def printit():
    return 'Hello World'

def dataprofile(data_all_df,data_cols):
    data_df = data_all_df.select(data_cols)
    columns2Bprofiled = data_df.columns
    global schema_name, table_name
    if not 'schema_name' in globals():
        schema_name = 'schema_name'
    if not 'table_name' in globals():
        table_name = 'table_name' 
        
    dprof_df = pd.DataFrame({'schema_name':[schema_name] * len(data_df.columns),\
                             'table_name':[table_name] * len(data_df.columns),\
                             'column_names':data_df.columns,\
                             'data_types':[x[1] for x in data_df.dtypes]}) 
    dprof_df = dprof_df[['schema_name','table_name','column_names', 'data_types']]
    # dprof_df.set_index('column_names', inplace=True, drop=False)
    # ======================
    num_rows = data_df.count()
    dprof_df['num_rows'] = num_rows
    # ======================    
    # number of rows with nulls and nans   
    df_nacounts = data_df.select([count(when(isnan(c) | col(c).isNull(), c)).alias(c) for c in data_df.columns \
                                   if data_df.select(c).dtypes[0][1]!='timestamp']).toPandas().transpose()
    df_nacounts = df_nacounts.reset_index()  
    df_nacounts.columns = ['column_names','num_null']
    dprof_df = pd.merge(dprof_df, df_nacounts, on = ['column_names'], how = 'left')
    # ========================
    # number of rows with white spaces (one or more space) or blanks
    num_spaces = [data_df.where(F.col(c).rlike('^\\s+$')).count() for c in data_df.columns]
    dprof_df['num_spaces'] = num_spaces
    num_blank = [data_df.where(F.col(c)=='').count() for c in data_df.columns]
    dprof_df['num_blank'] = num_blank
    # =========================
    # using the in built describe() function 
    desc_df = data_df.describe().toPandas().transpose()
    desc_df.columns = ['count', 'mean', 'stddev', 'min', 'max']
    desc_df = desc_df.iloc[1:,:]  
    desc_df = desc_df.reset_index()  
    desc_df.columns.values[0] = 'column_names'  
    desc_df = desc_df[['column_names','count', 'mean', 'stddev']] 
    dprof_df = pd.merge(dprof_df, desc_df , on = ['column_names'], how = 'left')
    # ===========================================
    allminvalues = [data_df.select(F.min(x)).limit(1).toPandas().iloc[0][0] for x in columns2Bprofiled]
    allmaxvalues = [data_df.select(F.max(x)).limit(1).toPandas().iloc[0][0] for x in columns2Bprofiled]
    allmincounts = [data_df.where(col(x) == y).count() for x,y in zip(columns2Bprofiled, allminvalues)]
    allmaxcounts = [data_df.where(col(x) == y).count() for x,y in zip(columns2Bprofiled, allmaxvalues)]    
    df_counts = dprof_df[['column_names']]
    df_counts.insert(loc=0, column='min', value=allminvalues)
    df_counts.insert(loc=0, column='counts_min', value=allmincounts)
    df_counts.insert(loc=0, column='max', value=allmaxvalues)
    df_counts.insert(loc=0, column='counts_max', value=allmaxcounts)
    df_counts = df_counts[['column_names','min','counts_min','max','counts_max']]
    dprof_df = pd.merge(dprof_df, df_counts , on = ['column_names'], how = 'left')  
    # ==========================================
    # number of distinct values in each column
    dprof_df['num_distinct'] = [data_df.select(x).distinct().count() for x in columns2Bprofiled]
    # ============================================
    # most frequently occuring value in a column and its count
    dprof_df['most_freq_valwcount'] = [data_df.groupBy(x).count().sort("count",ascending=False).limit(1).\
                                       toPandas().iloc[0].values.tolist() for x in columns2Bprofiled]
    dprof_df['most_freq_value'] = [x[0] for x in dprof_df['most_freq_valwcount']]
    dprof_df['most_freq_value_count'] = [x[1] for x in dprof_df['most_freq_valwcount']]
    dprof_df = dprof_df.drop(['most_freq_valwcount'],axis=1)
    # least frequently occuring value in a column and its count
    dprof_df['least_freq_valwcount'] = [data_df.groupBy(x).count().sort("count",ascending=True).limit(1).\
                                        toPandas().iloc[0].values.tolist() for x in columns2Bprofiled]
    dprof_df['least_freq_value'] = [x[0] for x in dprof_df['least_freq_valwcount']]
    dprof_df['least_freq_value_count'] = [x[1] for x in dprof_df['least_freq_valwcount']]
    dprof_df = dprof_df.drop(['least_freq_valwcount'],axis=1)

    return dprof_df