
export default {
  'cassandra': {
    'roots': {
      'Default': null,
      'Type': 'String',
      'Required': 'true',
      'Description': 'Cassandra Contact Points. A list of one or many node address. It is a comma separated String.'
    },
    'keyspace': {
      'Default': null,
      'Type': 'String',
      'Required': 'true',
      'Description': 'Cassandra Keyspace name. The keyspace should be created prior to creating the sink.'
    },
    'columnFamily': {
      'Default': null,
      'Required': 'true',
      'Type': 'String',
      'Description': 'Cassandra ColumnFamily name. The column family should be created prior to creating the sink.'
    },
    'keyname': {
      'Default': null,
      'Required': 'true',
      'Type': 'String',
      'Description': "Key column name. The key column is used for storing Pulsar message keys. If a Pulsar message doesn't have any key associated, the message value will be used as the key."
    },
    'columnName': {
      'Default': null,
      'Required': 'true',
      'Type': 'String',
      'Description': 'Value column name. The value column is used for storing Pulsar message values.'
    }
  },
  'astra-cassandra': {
    'username': {
      'Default': null,
      'Type': 'String',
      'Required': 'true',
      'Description': 'Cassandra Astra user name.'
    },
    'password': {
      'Default': null,
      'Type': 'String',
      'Required': 'true',
      'Description': 'Cassandra Astra password.'
    },
    'keySpace': {
      'Default': null,
      'Type': 'String',
      'Required': 'true',
      'Description': 'Cassandra Keyspace name. The keyspace must already exist.'
    },
    'clusterId': {
      'Default': null,
      'Type': 'String',
      'Required': 'true',
      'Description': 'Cassandra Astra cluster ID.'
    },
    'clusterRegion': {
      'Default': null,
      'Type': 'String',
      'Required': 'true',
      'Description': 'Cassandra Astra cluster region.'
    },
    'tableName': {
      'Default': null,
      'Required': 'true',
      'Type': 'String',
      'Description': "The name of the table to write to. If the table does not exist, it will be created."
    },
    'tableSchema': {
      'Default': null,
      'Required': 'true',
      'Type': 'String',
      'Description': "The column definitions of the table. For an example, see https://dzone.com/articles/datastax-astra-graphqlrest-api-services."
    },
    'batchSize': {
      'Default': 20,
      'Required': 'false',
      'Type': 'String',
      'Description': "Number of records to batch for processing."
    },
  },
  'sap-em': {
    'connectionName': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'The connection name used for connecting to SAPEnterpriseMessaging.'
    },
    'xsappname': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'SAP HANA XS application name.'
    },
    'clientID': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'OAuth2 client id.'
    },
    'clientSecret': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'OAuth2 client secret.'
    },
    'tokenEndpoint': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'OAuth2 token endpoint URL.'
    },
    'serviceURL': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'SAP Enterprise Messaging Service URL.'
    },
    'destination': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'The SAPEnterpriseMessaging destination name optionally prefixed with "topic:"; if not prefixed "queue:" is assumed.'
    },
    'protocol': {
      'Type': 'String',
      'Required': 'false',
      'Default': 'amqp10ws',
      'Description': 'SAP Enterprise Messaging protocol.'
    },
    'maxReconnectAttempts': {
      'Type': 'String',
      'Required': 'false',
      'Default': '20',
      'Description': 'Maximum number of attempts at reconnecting before giving up; -1 for unlimited retries.'
    },
    'initialReconnectDelay': {
      'Type': 'String',
      'Required': 'false',
      'Default': '3000',
      'Description': 'Delay in millis before reconnecting after the first failure.'
    },
    'reconnectDelay': {
      'Type': 'String',
      'Required': 'false',
      'Default': '5000',
      'Description': 'Delay in millis between reconnect attempts after the first.'
    },
  },
  'aerospike': {
    'seedHosts': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'The comma-separated list of one or more Aerospike cluster hosts.\n\nEach host can be specified as a valid IP address or hostname followed by an optional port number.'
    },
    'keyspace': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'The Aerospike namespace.'
    },
    'columnName': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'The Aerospike column name.'
    },
    'userName': {
      'Type': 'String',
      'Required': 'false',
      'Default': null,
      'Description': 'The Aerospike username.'
    },
    'password': {
      'Type': 'String',
      'Required': 'false',
      'Default': null,
      'Description': 'The Aerospike password.'
    },
    'keySet': {
      'Type': 'String',
      'Required': 'false',
      'Default': null,
      'Description': 'The Aerospike set name.'
    },
    'maxConcurrentRequests': {
      'Type': 'Integer',
      'Required': 'false',
      'Default': '100',
      'Description': 'The maximum number of concurrent Aerospike transactions that a sink can open.'
    },
    'timeoutMs': {
      'Type': 'Integer',
      'Required': 'false',
      'Default': '100',
      'Description': 'This property controls socketTimeout and totalTimeout for Aerospike transactions.'
    },
    'retries': {
      'Type': 'Integer',
      'Required': 'false',
      'Default': '1',
      'Description': 'The maximum number of retries before aborting a write transaction to Aerospike.'
    }
  },
  'elastic_search': {
    'elasticSearchUrl': {
      'Default': null,
      'Required': 'true',
      'Description': 'The url of elastic search cluster that the connector connects to.'
    },
    'indexName': {
      'Default': null,
      'Required': 'true',
      'Description': 'The index name that the connector writes messages to.'
    },
    'indexNumberOfShards': {
      'Default': '1',
      'Required': 'false',
      'Description': 'The number of shards of the index.'
    },
    'indexNumberOfReplicas': {
      'Default': '1',
      'Required': 'false',
      'Description': 'The number of replicas of the index.'
    },
    'username': {
      'Default': null,
      'Required': 'false',
      'Description': 'The username used by the connector to connect to the elastic search cluster. If username is set, a password should also be provided.'
    },
    'password': {
      'Default': null,
      'Required': 'false',
      'Description': 'The password used by the connector to connect to the elastic search cluster. If password is set, a username should also be provided.'
    }
  },
  'flume': {
    'name': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'The name of the agent.'
    },
    'confFile': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'The configuration file.'
    },
    'noReloadConf': {
      'Type': 'Boolean',
      'Required': 'false',
      'Default': 'false',
      'Description': 'Whether to reload configuration file if changed.'
    },
    'zkConnString': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'The ZooKeeper connection.'
    },
    'zkBasePath': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'The base path in ZooKeeper for agent configuration.'
    }
  },
  'hbase': {
    'hbaseConfigResources': {
      'Type': 'String',
      'Default': '',
      'Required': 'false',
      'Description': 'HBase system configuration hbase-site.xml file.'
    },
    'zookeeperQuorum': {
      'Type': 'String',
      'Default': '',
      'Required': 'true',
      'Description': 'HBase system configuration about hbase.zookeeper.quorum value.'
    },
    'zookeeperClientPort': {
      'Type': 'String',
      'Default': '2181',
      'Required': 'false',
      'Description': 'HBase system configuration about hbase.zookeeper.property.clientPort value.'
    },
    'zookeeperZnodeParent': {
      'Type': 'String',
      'Default': '/hbase',
      'Required': 'false',
      'Description': 'HBase system configuration about zookeeper.znode.parent value.'
    },
    'tableName': {
      'Type': 'String',
      'Default': '',
      'Required': 'true',
      'Description': 'HBase table, the value is namespace:tableName.'
    },
    'rowKeyName': {
      'Type': 'String',
      'Default': '',
      'Required': 'true',
      'Description': 'HBase table rowkey name.'
    },
    'familyName': {
      'Type': 'String',
      'Default': '',
      'Required': 'true',
      'Description': 'HBase table column family name.'
    },
    'qualifierNames': {
      'Type': 'String',
      'Default': '',
      'Required': 'true',
      'Description': 'HBase table column qualifier names.'
    },
    'batchTimeMs': {
      'Type': 'Long',
      'Default': '1000',
      'Required': 'false',
      'Description': 'HBase table operation timeout in milliseconds.'
    },
    'batchSize': {
      'Type': 'Integer',
      'Default': '200',
      'Required': 'false',
      'Description': 'Batch size of updates made to the HBase table.'
    }
  },
  'hdfs2': {
    'hdfsConfigResources': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': "A file or a comma-separated list containing the Hadoop file system configuration.\n\nExample\n'core-site.xml'\n'hdfs-site.xml'"
    },
    'directory': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'The HDFS directory where files read from or written to.'
    },
    'encoding': {
      'Type': 'String',
      'Required': 'false',
      'Default': '',
      'Description': 'The character encoding for the files.\n\nExample\nUTF-8\nASCII'
    },
    'compression': {
      'Type': 'String',
      'Required': 'false',
      'Default': '',
      'Description': 'The compression code used to compress or de-compress the files on HDFS. \n\nBelow are the available options:\nBZIP2\nDEFLATE\nGZIP\nLZ4\nSNAPPY'
    },
    'kerberosUserPrincipal': {
      'Type': 'String',
      'Required': 'false',
      'Default': '',
      'Description': 'The principal account of Kerberos user used for authentication.'
    },
    'keytab': {
      'Type': 'String',
      'Required': 'false',
      'Default': '',
      'Description': 'The full pathname of the Kerberos keytab file used for authentication.'
    },
    'filenamePrefix': {
      'Type': 'String',
      'Required': 'false',
      'Default': '',
      'Description': 'The prefix of the files created inside the HDFS directory.Example: The value of topicA result in files named topicA-.'
    },
    'fileExtension': {
      'Type': 'String',
      'Required': 'false',
      'Default': '',
      'Description': "The extension added to the files written to HDFS. Example: '.txt', '.seq'"
    },
    'separator': {
      'Type': 'char',
      'Required': 'false',
      'Default': '',
      'Description': 'The character used to separate records in a text file. \n\nIf no value is provided, the contents from all records are concatenated together in one continuous byte array.'
    },
    'syncInterval': {
      'Type': 'Long',
      'Required': 'false',
      'Default': '0',
      'Description': 'The interval between calls to flush data to HDFS disk in milliseconds.'
    },
    'maxPendingRecords': {
      'Type': 'Integer',
      'Required': 'false',
      'Default': 'Integer.MAX_VALUE',
      'Description': 'The maximum number of records that hold in memory before acking. \n\nSetting this property to 1 makes every record send to disk before the record is acked.\n\nSetting this property to a higher value allows buffering records before flushing them to disk.'
    }
  },
  'hdfs3': {
    'hdfsConfigResources': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': "A file or a comma-separated list containing the Hadoop file system configuration.\n\nExample\n'core-site.xml'\n'hdfs-site.xml'"
    },
    'directory': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'The HDFS directory where files read from or written to.'
    },
    'encoding': {
      'Type': 'String',
      'Required': 'false',
      'Default': '',
      'Description': 'The character encoding for the files.\n\nExample\nUTF-8\nASCII'
    },
    'compression': {
      'Type': 'String',
      'Required': 'false',
      'Default': '',
      'Description': 'The compression code used to compress or de-compress the files on HDFS. \n\nBelow are the available options:\nBZIP2\nDEFLATE\nGZIP\nLZ4\nSNAPPY'
    },
    'kerberosUserPrincipal': {
      'Type': 'String',
      'Required': 'false',
      'Default': '',
      'Description': 'The principal account of Kerberos user used for authentication.'
    },
    'keytab': {
      'Type': 'String',
      'Required': 'false',
      'Default': '',
      'Description': 'The full pathname of the Kerberos keytab file used for authentication.'
    },
    'filenamePrefix': {
      'Type': 'String',
      'Required': 'false',
      'Default': '',
      'Description': 'The prefix of the files created inside the HDFS directory. Example: The value of topicA result in files named topicA-.'
    },
    'fileExtension': {
      'Type': 'String',
      'Required': 'false',
      'Default': '',
      'Description': "The extension added to the files written to HDFS. Example: '.txt' '.seq'"
    },
    'separator': {
      'Type': 'String',
      'Required': 'false',
      'Default': '',
      'Description': 'The character used to separate records in a text file. \n\nIf no value is provided, the contents from all records are concatenated together in one continuous byte array.'
    },
    'syncInterval': {
      'Type': 'Long',
      'Required': 'false',
      'Default': '0',
      'Description': 'The Integererval between calls to flush data to HDFS disk in milliseconds.'
    },
    'maxPendingRecords': {
      'Type': 'Integer',
      'Required': 'false',
      'Default': 'Integer.MAX_VALUE',
      'Description': 'The maximum number of records that hold in memory before acking. \n\nSetting this property to 1 makes every record send to disk before the record is acked.\n\nSetting this property to a higher value allows buffering records before flushing them to disk.'
    }
  },
  'aws-s3': {
    'accessKeyId': {
      'Default': null,
      'Required': 'true',
      'Description': 'AWS access key'
    },
    'secretAccessKey': {
      'Default': null,
      'Required': 'true',
      'Description': 'AWS secret access key'
    },
    'bucketName': {
      'Default': null,
      'Required': 'true',
      'Description': 'The bucket name to write to.'
    },
    'awsregion': {
      'Default': null,
      'Required': 'false',
      'Description': 'AWS region where the bucket resides. E.g. us-east-1, us-west-2'
    },
    'partSize': {
      'Default': '5242880',
      'Required': 'false',
      'Description': 'The size of the partition for multi-part upload.'
    },
    's3ObjectRolloverMinutes': {
      'Default': '10',
      'Required': 'false',
      'Description': 'To use time-based filenames, configure a rollover time in minutes.'
    },
    'logLevel': {
      'Default': '',
      'Required': 'false',
      'Description': 'The log level for InfluxDB request and response. Possible values: debug.'
    },
  },
  'influxdb': {
    'influxdbUrl': {
      'Default': null,
      'Required': 'true',
      'Description': 'The url of the InfluxDB instance to connect to.'
    },
    'username': {
      'Default': null,
      'Required': 'false',
      'Description': 'The username used to authenticate to InfluxDB.'
    },
    'password': {
      'Default': null,
      'Required': 'false',
      'Description': 'The password used to authenticate to InfluxDB.'
    },
    'database': {
      'Default': null,
      'Required': 'true',
      'Description': 'The InfluxDB database to write to.'
    },
    'consistencyLevel': {
      'Default': 'ONE',
      'Required': 'false',
      'Description': 'The consistency level for writing data to InfluxDB. Possible values [ALL, ANY, ONE, QUORUM].'
    },
    'logLevel': {
      'Default': 'NONE',
      'Required': 'false',
      'Description': 'The log level for InfluxDB request and response. Possible values [NONE, BASIC, HEADERS, FULL].'
    },
    'retentionPolicy': {
      'Default': 'autogen',
      'Required': 'false',
      'Description': 'The retention policy for the InfluxDB database.'
    },
    'gzipEnable': {
      'Default': 'false',
      'Required': 'false',
      'Description': 'Flag to determine if gzip should be enabled.'
    },
    'batchTimeMs': {
      'Default': '1000',
      'Required': 'false',
      'Description': 'The InfluxDB operation time in milliseconds.'
    },
    'batchSize': {
      'Default': '200',
      'Required': 'false',
      'Description': 'The batch size of write to InfluxDB database.'
    }
  },
  'jdbc': {
    'userName': {
      'Required': 'false',
      'Default': '',
      'Description': 'Username used to connect to the database specified by jdbcUrl.'
    },
    'password': {
      'Required': 'false',
      'Default': '',
      'Description': 'Password used to connect to the database specified by jdbcUrl.'
    },
    'jdbcUrl': {
      'Required': 'true',
      'Default': '',
      'Description': 'The JDBC url of the database this connector connects to. For postgres, use the format: jdbc:postgresql://host:port/database. For mysql, use: jdbc:mysql://host:port/database'
    },
    'tableName': {
      'Required': 'true',
      'Default': '',
      'Description': 'The name of the table this connector writes messages to.'
    },
    'nonKey': {
      'Required': 'false',
      'Default': '',
      'Description': 'Fields used in update events. A comma-separated list.'
    },
    'key': {
      'Required': 'false',
      'Default': '',
      'Description': 'Fields used in where condition of update and delete Events. A comma-separated list.'
    },
    'timeoutMs': {
      'Required': 'false',
      'Default': '500',
      'Description': 'The jdbc operation timeout in milliseconds.'
    },
    'batchSize': {
      'Required': 'false',
      'Default': '200',
      'Description': 'The batch size of updates made to the database.'
    }
  },
  'jdbc-postgres': {
    'userName': {
      'Required': 'false',
      'Default': '',
      'Description': 'Username used to connect to the database specified by jdbcUrl.'
    },
    'password': {
      'Required': 'false',
      'Default': '',
      'Description': 'Password used to connect to the database specified by jdbcUrl.'
    },
    'jdbcUrl': {
      'Required': 'true',
      'Default': '',
      'Description': 'The JDBC url of the database this connector connects to. Use the format: jdbc:postgresql://host:port/database.'
    },
    'tableName': {
      'Required': 'true',
      'Default': '',
      'Description': 'The name of the table this connector writes messages to.'
    },
    'nonKey': {
      'Required': 'false',
      'Default': '',
      'Description': 'Fields used in update events. A comma-separated list.'
    },
    'key': {
      'Required': 'false',
      'Default': '',
      'Description': 'Fields used in where condition of update and delete Events. A comma-separated list.'
    },
    'timeoutMs': {
      'Required': 'false',
      'Default': '500',
      'Description': 'The jdbc operation timeout in milliseconds.'
    },
    'batchSize': {
      'Required': 'false',
      'Default': '200',
      'Description': 'The batch size of updates made to the database.'
    }
  },
  'jdbc-mariadb': {
    'userName': {
      'Required': 'false',
      'Default': '',
      'Description': 'Username used to connect to the database specified by jdbcUrl.'
    },
    'password': {
      'Required': 'false',
      'Default': '',
      'Description': 'Password used to connect to the database specified by jdbcUrl.'
    },
    'jdbcUrl': {
      'Required': 'true',
      'Default': '',
      'Description': 'The JDBC url of the database this connector connects to. Use the format: jdbc:mariadb://host:port/database'
    },
    'tableName': {
      'Required': 'true',
      'Default': '',
      'Description': 'The name of the table this connector writes messages to.'
    },
    'nonKey': {
      'Required': 'false',
      'Default': '',
      'Description': 'Fields used in update events. A comma-separated list.'
    },
    'key': {
      'Required': 'false',
      'Default': '',
      'Description': 'Fields used in where condition of update and delete Events. A comma-separated list.'
    },
    'timeoutMs': {
      'Required': 'false',
      'Default': '500',
      'Description': 'The jdbc operation timeout in milliseconds.'
    },
    'batchSize': {
      'Required': 'false',
      'Default': '200',
      'Description': 'The batch size of updates made to the database.'
    }
  },
  'jdbc-clickhouse': {
    'userName': {
      'Required': 'false',
      'Default': '',
      'Description': 'Username used to connect to the database specified by jdbcUrl.'
    },
    'password': {
      'Required': 'false',
      'Default': '',
      'Description': 'Password used to connect to the database specified by jdbcUrl.'
    },
    'jdbcUrl': {
      'Required': 'true',
      'Default': '',
      'Description': 'The JDBC url of the database this connector connects to. Use the format: jdbc:clickhouse://host:port/database'
    },
    'tableName': {
      'Required': 'true',
      'Default': '',
      'Description': 'The name of the table this connector writes messages to.'
    },
    'nonKey': {
      'Required': 'false',
      'Default': '',
      'Description': 'Fields used in update events. A comma-separated list.'
    },
    'key': {
      'Required': 'false',
      'Default': '',
      'Description': 'Fields used in where condition of update and delete Events. A comma-separated list.'
    },
    'timeoutMs': {
      'Required': 'false',
      'Default': '500',
      'Description': 'The jdbc operation timeout in milliseconds.'
    },
    'batchSize': {
      'Required': 'false',
      'Default': '200',
      'Description': 'The batch size of updates made to the database.'
    }
  },
  'jdbc-sqlite': {
    'userName': {
      'Required': 'false',
      'Default': '',
      'Description': 'Username used to connect to the database specified by jdbcUrl.'
    },
    'password': {
      'Required': 'false',
      'Default': '',
      'Description': 'Password used to connect to the database specified by jdbcUrl.'
    },
    'jdbcUrl': {
      'Required': 'true',
      'Default': '',
      'Description': 'The JDBC url of the database this connector connects to. Use the format: jdbc:sqlite://host:port/database'
    },
    'tableName': {
      'Required': 'true',
      'Default': '',
      'Description': 'The name of the table this connector writes messages to.'
    },
    'nonKey': {
      'Required': 'false',
      'Default': '',
      'Description': 'Fields used in update events. A comma-separated list.'
    },
    'key': {
      'Required': 'false',
      'Default': '',
      'Description': 'Fields used in where condition of update and delete Events. A comma-separated list.'
    },
    'timeoutMs': {
      'Required': 'false',
      'Default': '500',
      'Description': 'The jdbc operation timeout in milliseconds.'
    },
    'batchSize': {
      'Required': 'false',
      'Default': '200',
      'Description': 'The batch size of updates made to the database.'
    }
  },
  'kafka': {
    'bootstrapServers': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'A comma-separated list of host and port pairs for establishing the initial connection to the Kafka cluster.'
    },
    'acks': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'The number of acknowledgments that the producer requires the leader to receive before a request completes. \nThis controls the durability of the sent records.'
    },
    'batchsize': {
      'Type': 'Long',
      'Required': 'false',
      'Default': '16384',
      'Description': 'The batch size that a Kafka producer attempts to batch records together before sending them to brokers.'
    },
    'maxRequestSize': {
      'Type': 'Long',
      'Required': 'false',
      'Default': '1048576',
      'Description': 'The maximum size of a Kafka request in bytes.'
    },
    'topic': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'The Kafka topic which receives messages from Pulsar.'
    },
    'keyDeserializationClass': {
      'Type': 'String',
      'Required': 'false',
      'Default': 'org.apache.kafka.common.serialization.StringSerializer',
      'Description': 'The serializer class for Kafka producers to serialize keys.'
    },
    'valueDeserializationClass': {
      'Type': 'String',
      'Required': 'false',
      'Default': 'org.apache.kafka.common.serialization.ByteArraySerializer',
      'Description': 'The serializer class for Kafka producers to serialize values.\n\nThe serializer is set by a specific implementation of KafkaAbstractSink.'
    },
    'producerConfigProperties': {
      'Type': 'String',
      'Required': 'false',
      'Default': '',
      'Description': 'The producer configuration properties to be passed to producers. \n\nNote:  other properties specified in the connector configuration file take precedence over this configuration.'
    }
  },
  'kinesis': {
    'messageFormat': {
      'Type': 'String',
      'Required': 'true',
      'Default': 'ONLY_RAW_PAYLOAD',
      'Description': 'Message format used to convert Pulsar messages Kinesis streams. ONLY_RAW_PAYLOAD: Pulsar message payload as a message. FULL_MESSAGE_IN_JSON: JSON payload with Pulsar message payload, properties and encryptionCtx. FULL_MESSAGE_IN_FB: Flatbuffer serialized payload with Pulsar message payload, properties and encryptionCtx.'
    },
    'retainOrdering': {
      'Type': 'Boolean',
      'Required': 'false',
      'Default': 'false',
      'Description': 'Whether Pulsar connectors to retain ordering when moving messages from Pulsar to Kinesis or not.'
    },
    'awsEndpoint': {
      'Type': 'String',
      'Required': 'false',
      'Default': '',
      'Description': 'The Kinesis end-point URL.'
    },
    'awsRegion': {
      'Type': 'String',
      'Required': 'false',
      'Default': '',
      'Description': 'The AWS region. Example: us-west-1, us-west-2'
    },
    'awsKinesisStreamName': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'The Kinesis stream name.'
    },
    'awsCredentialPluginName': {
      'Type': 'String',
      'Required': 'false',
      'Default': '',
      'Description': 'The fully-qualified class name of implementation of AwsCredentialProviderPlugin . \n\nIt is a factory class which creates an AWSCredentialsProvider that is used by Kinesis sink. \n\nIf it is empty, the Kinesis sink creates a default AWSCredentialsProvider which accepts json-map of credentials in awsCredentialPluginParam.'
    },
    'awsCredentialPluginParam': {
      'Type': 'String',
      'Required': 'false',
      'Default': '',
      'Description': 'The JSON parameter to initialize awsCredentialsProviderPlugin.'
    }
  },
  'mongo': {
    'mongoUri': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'The MongoDB URI to which the connector connects. \n\nFor more information, see connection string URI format.'
    },
    'database': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'The database name to which the collection belongs.'
    },
    'collection': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'The collection name to which the connector writes messages.'
    },
    'batchSize': {
      'Type': 'Integer',
      'Required': 'false',
      'Default': '100',
      'Description': 'The batch size of writing messages to collections.'
    },
    'batchTimeMs': {
      'Type': 'Long',
      'Required': 'false',
      'Default': '1000',
      'Description': 'The batch operation interval in milliseconds.'
    }
  },
  'rabbitmq': {
    'connectionName': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'The connection name.'
    },
    'host': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'The RabbitMQ host.'
    },
    'port': {
      'Type': 'Integer',
      'Required': 'true',
      'Default': '5672',
      'Description': 'The RabbitMQ port.'
    },
    'virtualHost': {
      'Type': 'String',
      'Required': 'true',
      'Default': '/',
      'Description': 'The virtual host used to connect to RabbitMQ.'
    },
    'username': {
      'Type': 'String',
      'Required': 'false',
      'Default': 'guest',
      'Description': 'The username used to authenticate to RabbitMQ.'
    },
    'password': {
      'Type': 'String',
      'Required': 'false',
      'Default': 'guest',
      'Description': 'The password used to authenticate to RabbitMQ.'
    },
    'queueName': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'The RabbitMQ queue name that messages should be read from or written to.'
    },
    'requestedChannelMax': {
      'Type': 'Integer',
      'Required': 'false',
      'Default': '0',
      'Description': 'The initially requested maximum channel number. \n\n0 means unlimited.'
    },
    'requestedFrameMax': {
      'Type': 'Integer',
      'Required': 'false',
      'Default': '0',
      'Description': 'The initially requested maximum frame size in octets. \n\n0 means unlimited.'
    },
    'connectionTimeout': {
      'Type': 'Integer',
      'Required': 'false',
      'Default': '60000',
      'Description': 'The timeout of TCP connection establishment in milliseconds. \n\n0 means infinite.'
    },
    'handshakeTimeout': {
      'Type': 'Integer',
      'Required': 'false',
      'Default': '10000',
      'Description': 'The timeout of AMQP0-9-1 protocol handshake in milliseconds.'
    },
    'requestedHeartbeat': {
      'Type': 'Integer',
      'Required': 'false',
      'Default': '60',
      'Description': 'The exchange to publish messages.'
    },
    'exchangeName': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'The maximum number of messages that the server delivers. 0 means unlimited.'
    },
    'prefetchGlobal': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'The routing key used to publish messages.'
    }
  },
  'redis': {
    'redisHosts': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'A comma-separated list of Redis hosts to connect to.'
    },
    'redisPassword': {
      'Type': 'String',
      'Required': 'false',
      'Default': '',
      'Description': 'The password used to connect to Redis.'
    },
    'redisDatabase': {
      'Type': 'Integer',
      'Required': 'true',
      'Default': '0',
      'Description': 'The Redis database to connect to.'
    },
    'clientMode': {
      'Type': 'String',
      'Required': 'false',
      'Default': 'Standalone',
      'Description': 'The client mode when interacting with Redis cluster. \n\nBelow are the available options: \nStandalone\nCluster'
    },
    'autoReconnect': {
      'Type': 'Boolean',
      'Required': 'false',
      'Default': 'true',
      'Description': 'Whether the Redis client automatically reconnect or not.'
    },
    'requestQueue': {
      'Type': 'Integer',
      'Required': 'false',
      'Default': '2147483647',
      'Description': 'The maximum number of queued requests to Redis.'
    },
    'tcpNoDelay': {
      'Type': 'Boolean',
      'Required': 'false',
      'Default': 'false',
      'Description': 'Whether to enable TCP with no delay or not.'
    },
    'keepAlive': {
      'Type': 'Boolean',
      'Required': 'false',
      'Default': 'false',
      'Description': 'Whether to enable a keepalive to Redis or not.'
    },
    'connectTimeout': {
      'Type': 'Long',
      'Required': 'false',
      'Default': '10000',
      'Description': 'The time to wait before timing out when connecting in milliseconds.'
    },
    'operationTimeout': {
      'Type': 'Long',
      'Required': 'false',
      'Default': '10000',
      'Description': 'The time before an operation is marked as timed out in milliseconds .'
    },
    'batchTimeMs': {
      'Type': 'Integer',
      'Required': 'false',
      'Default': '1000',
      'Description': 'The Redis operation time in milliseconds.'
    },
    'batchSize': {
      'Type': 'Integer',
      'Required': 'false',
      'Default': '200',
      'Description': 'The batch size of writing to Redis database.'
    }
  },
  'solr': {
    'solrUrl': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'Comma-separated zookeeper hosts with chroot used in the SolrCloud mode. Example: localhost:2181,localhost:2182/chroot \n\nURL to connect to Solr used in standalone mode. Example: localhost:8983/solr'
    },
    'solrMode': {
      'Type': 'String',
      'Required': 'true',
      'Default': 'SolrCloud',
      'Description': 'The client mode when interacting with the Solr cluster. Available options: Standalone, SolrCloud'
    },
    'solrCollection': {
      'Type': 'String',
      'Required': 'true',
      'Default': '',
      'Description': 'Solr collection name to which records need to be written.'
    },
    'solrCommitWithinMs': {
      'Type': 'Integer',
      'Required': 'false',
      'Default': '10',
      'Description': 'The time within million seconds for Solr updating commits.'
    },
    'username': {
      'Type': 'String',
      'Required': 'false',
      'Default': '',
      'Description': 'The username for basic authentication.\n\nNote: username is case-sensitive.'
    },
    'password': {
      'Type': 'String',
      'Required': 'false',
      'Default': '',
      'Description': 'The password for basic authentication. \n\nNote: password is case-sensitive.'
    }
  }
}
