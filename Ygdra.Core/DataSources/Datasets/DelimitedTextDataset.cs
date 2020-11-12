using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ygdra.Core.DataSources.Entities;

namespace Ygdra.Core.DataSources.Datasets
{
    public class DelimitedTextDataset
    {
        public DelimitedTextDataset(
            string folderName,
            string fileName,
            string folderPath = default,
            ColumnDelimiter columnDelimiter = default,
            RowDelimiter rowDelimiter = default,
            EncodingName encodingName = default,
            CompressionCodec compressionCodec = default,
            CompressionLevel compressionLevel = default,
            QuoteChar quoteChar = default,
            EscapeChar escapeChar = default,
            bool firstRowAsHeader = false,
            string nullValue = default,
            IList<SchemaColumn> schema = default)
        {
            FolderName = folderName;
            FileName = fileName;
            FolderPath = folderPath;
            ColumnDelimiter = columnDelimiter;
            RowDelimiter = rowDelimiter;
            EncodingName = encodingName;
            CompressionCodec = compressionCodec;
            CompressionLevel = compressionLevel;
            QuoteChar = quoteChar;
            EscapeChar = escapeChar;
            FirstRowAsHeader = firstRowAsHeader;
            NullValue = nullValue;
            Schema = schema;
        }

        public string FolderName { get; set; }
        public string FileName { get; set; }
        public string FolderPath { get; set; }
        public ColumnDelimiter ColumnDelimiter { get; set; }
        public RowDelimiter RowDelimiter { get; set; }
        public EncodingName EncodingName { get; set; }
        public CompressionCodec CompressionCodec { get; set; }
        public CompressionLevel CompressionLevel { get; set; }
        public QuoteChar QuoteChar { get; set; }
        public EscapeChar EscapeChar { get; set; }
        public bool FirstRowAsHeader { get; set; }
        public string NullValue { get; set; }
        public IList<SchemaColumn> Schema { get; }
    }
}
