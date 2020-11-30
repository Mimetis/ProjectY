Using Panda

[https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.describe.html](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.describe.html)

Describe a `Series`:
``` python
s = pd.Series([1, 2, 3])
s.describe()
count    3.0
mean     2.0
std      1.0
min      1.0
25%      1.5
50%      2.0
75%      2.5
max      3.0
dtype: float64
```

Describe all columns from a `DataFRram`