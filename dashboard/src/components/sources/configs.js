//
//  Copyright 2021 DataStax, Inc. 
//  
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//  
//      http://www.apache.org/licenses/LICENSE-2.0
//  
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
//  
//

export default {
  'canal': {
    'username': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'Canal server account (not MySQL).'
    },
    'password': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'Canal server password (not MySQL).'
    },
    'destination': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'Source destination that Canal source connector connects to.'
    },
    'singleHostname': {
      'Type': 'String',
      'Required': 'false',
      'Default': null,
      'Description': 'Canal server address.'
    },
    'singlePort': {
      'Type': 'String',
      'Required': 'false',
      'Default': null,
      'Description': 'Canal server port.'
    },
    'cluster': {
      'Type': 'Boolean',
      'Required': 'true',
      'Default': 'false',
      'Description': 'Whether to enable cluster mode based on Canal server configuration or not.\n\ntrue: cluster mode.\nIf set to true, it talks to zkServers to figure out the actual database host.\n\nfalse: standalone mode.\nIf set to false, it connects to the database specified by singleHostname and singlePort.'
    },
    'zkServers': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'Address and port of the Zookeeper that Canal source connector talks to figure out the actual database host.'
    },
    'batchSize': {
      'Type': 'Integer',
      'Required': 'false',
      'Default': '1000',
      'Description': 'Batch size to fetch from Canal.'
    }
  },
  'debezium-mysql': {
    'database.hostname': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'The hostname of a database server.'
    },
    'database.port': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'The port number of a database server.'
    },
    'database.user': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'The name of a database user that has the required privileges.'
    },
    'database.password': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'The password for a database user that has the required privileges.'
    },
    'database.server.id': {
      'Type': 'String',
      'Required': 'false',
      'Default': null,
      'Description': 'The connector’s identifier that must be unique within a database cluster and similar to the database’s server.name configuration property.'
    },
    'database.server.name': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'The logical name of a database server/cluster, which forms a namespace and it is used in all the names of topics to which the connector writes, the schema names, and the namespaces of the corresponding Avro schema.'
    },
    'database.whitelist': {
      'Type': 'String',
      'Required': 'false',
      'Default': null,
      'Description': 'A list of all databases hosted by this server which is monitored by the connector.\n\n Optional.'
    },
    'key.converter': {
      'Type': 'String',
      'Required': 'false',
      'Default': 'org.apache.kafka.connect.json.JsonConverter',
      'Description': 'The converter to use when serializing the key. For Avro, use: org.apache.pulsar.kafka.shade.io.confluent.connect.avro.AvroConverter\n\n Optional.'
    },
    'value.converter': {
      'Type': 'String',
      'Required': 'false',
      'Default': 'org.apache.kafka.connect.json.JsonConverter',
      'Description': 'The converter to use when serializing the value. For Avro, use: org.apache.pulsar.kafka.shade.io.confluent.connect.avro.AvroConverter\n\n Optional.'
    },
    'json-with-envelope': {
      'Type': 'String',
      'Required': 'false',
      'DefaultOverride': 'true',
      'Description': 'Whether to include the JSON schema with the message or not. Only used if converter is org.apache.kafka.connect.json.JsonConverter .\n\n Optional.'
    },
  },
  'debezium-postgres': {
    'database.hostname': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'The hostname of a database server.'
    },
    'database.port': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'The port number of a database server.'
    },
    'database.user': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'The name of a database user that has the required privileges.'
    },
    'database.password': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'The password for a database user that has the required privileges.'
    },
    'database.dbname': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'The name of the database to connect to.'
    },
    'database.server.id': {
      'Type': 'String',
      'Required': 'false',
      'Default': null,
      'Description': 'The connector’s identifier that must be unique within a database cluster and similar to the database’s server.name configuration property.'
    },
    'database.server.name': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'The logical name of a database server/cluster, which forms a namespace and it is used in all the names of topics to which the connector writes, the schema names, and the namespaces of the corresponding Avro schema.'
    },
    'database.whitelist': {
      'Type': 'String',
      'Required': 'false',
      'Default': null,
      'Description': 'A list of all databases hosted by this server which is monitored by the connector.\n\n Optional.'
    },
    'plugin.name': {
      'Type': 'String',
      'Required': 'false',
      'DefaultOverride': 'pgoutput',
      'Description': 'The name of the plugin. Use pgoutput for PostgreSQL 10+. For older versions, install wal2json of decoderbufs plugin.\n\n Optional.'
    },
    'key.converter': {
      'Type': 'String',
      'Required': 'false',
      'Default': 'org.apache.kafka.connect.json.JsonConverter',
      'Description': 'The converter to use when serializing the key. For Avro, use: org.apache.pulsar.kafka.shade.io.confluent.connect.avro.AvroConverter\n\n Optional.'
    },
    'value.converter': {
      'Type': 'String',
      'Required': 'false',
      'Default': 'org.apache.kafka.connect.json.JsonConverter',
      'Description': 'The converter to use when serializing the value. For Avro, use: org.apache.pulsar.kafka.shade.io.confluent.connect.avro.AvroConverter\n\n Optional.'
    },
    'json-with-envelope': {
      'Type': 'String',
      'Required': 'false',
      'DefaultOverride': 'true',
      'Description': 'Whether to include the JSON schema with the message or not. Only used if converter is org.apache.kafka.connect.json.JsonConverter .\n\n Optional.'
    },
  },
  'data-generator': {

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
  'debezium-mongodb': {
    'mongodb.hosts': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': "The comma-separated list of hostname and port pairs ('host' or 'host:port') of the MongoDB servers in the replica set. If mongodb.members.auto.discover is set to false, prefix with the replica set name (e.g., rs0/localhost:27017)."
    },
    'mongodb.name': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'A unique name that identifies the connector and/or MongoDB replica set or shared cluster that this connector monitors. Each server should be monitored by at most one Debezium connector.'
    },
    'mongodb.user': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'Name of the database user to be used when connecting to MongoDB. This is required only when MongoDB is configured to use authentication.'
    },
    'mongodb.password': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'Password to be used when connecting to MongoDB. This is required only when MongoDB is configured to use authentication.'
    },
    'mongodb.task.id': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'The taskId of the MongoDB connector that attempts to use a separate task for each replica set.'
    },
    'database.whitelist': {
      'Type': 'String',
      'Required': 'false',
      'Default': null,
      'Description': 'A list of all databases hosted by this server which is monitored by the  connector.\n\n This is optional, and there are other properties for listing databases and tables to include or exclude from monitoring.'
    },
  },
  'file': {
    'inputDirectory': {
      'Type': 'String',
      'Required': 'true',
      'Default': 'No default value',
      'Description': 'The input directory to pull files.'
    },
    'recurse': {
      'Type': 'Boolean',
      'Required': 'false',
      'Default': 'true',
      'Description': 'Whether to pull files from subdirectory or not.'
    },
    'keepFile': {
      'Type': 'Boolean',
      'Required': 'false',
      'Default': 'false',
      'Description': 'If set to true, the file is not deleted after it is processed, which means the file can be picked up continually.'
    },
    'fileFilter': {
      'Type': 'String',
      'Required': 'false',
      'Default': '[^\\.].*',
      'Description': 'The file whose name matches the given regular expression is picked up.'
    },
    'pathFilter': {
      'Type': 'String',
      'Required': 'false',
      'Default': null,
      'Description': 'If recurse is set to true, the subdirectory whose path matches the given regular expression is scanned.'
    },
    'minimumFileAge': {
      'Type': 'Integer',
      'Required': 'false',
      'Default': '0',
      'Description': 'The minimum age that a file can be processed. \n\nAny file younger than minimumFileAge (according to the last modification date) is ignored.'
    },
    'maximumFileAge': {
      'Type': 'Long',
      'Required': 'false',
      'Default': 'Long.MAX_VALUE',
      'Description': 'The maximum age that a file can be processed. \n\nAny file older than maximumFileAge (according to last modification date) is ignored.'
    },
    'minimumSize': {
      'Type': 'Integer',
      'Required': 'false',
      'Default': '1',
      'Description': 'The minimum size (in bytes) that a file can be processed.'
    },
    'maximumSize': {
      'Type': 'Double',
      'Required': 'false',
      'Default': 'Double.MAX_VALUE',
      'Description': 'The maximum size (in bytes) that a file can be processed.'
    },
    'ignoreHiddenFiles': {
      'Type': 'Boolean',
      'Required': 'false',
      'Default': 'true',
      'Description': 'Whether the hidden files should be ignored or not.'
    },
    'pollingInterval': {
      'Type': 'Long',
      'Required': 'false',
      'Default': '10000L',
      'Description': 'Indicates how long to wait before performing a directory listing.'
    },
    'numWorkers': {
      'Type': 'Integer',
      'Required': 'false',
      'Default': '1',
      'Description': 'The number of worker threads that process files.\n\n This allows you to process a larger number of files concurrently. \n\nHowever, setting this to a value greater than 1 makes the data from multiple files mixed in the target topic.'
    }
  },
  'twitter': {
    'consumerKey': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'The twitter OAuth consumer key.\n\nFor more information, see Access tokens.'
    },
    'consumerSecret': {
      'Type': 'String',
      'Required': 'true',
      'Default': 'null',
      'Description': 'The twitter OAuth consumer secret.'
    },
    'token': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'The twitter OAuth token.'
    },
    'tokenSecret': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'The twitter OAuth secret.'
    },
    'guestimateTweetTime': {
      'Type': 'Boolean',
      'Required': 'false',
      'Default': 'false',
      'Description': 'Most firehose events have null createdAt time.\n\nIf guestimateTweetTime set to true, the connector estimates the createdTime of each firehose event to be current time.'
    },
    'clientName': {
      'Type': 'String',
      'Required': 'false',
      'Default': 'openconnector-twitter-source',
      'Description': 'The twitter firehose client name.'
    },
    'clientHosts': {
      'Type': 'String',
      'Required': 'false',
      'Default': 'Constants.STREAM_HOST',
      'Description': 'The twitter firehose hosts to which client connects.'
    },
    'clientBufferSize': {
      'Type': 'int',
      'Required': 'false',
      'Default': '50000',
      'Description': 'The buffer size for buffering tweets fetched from twitter firehose.'
    }
  },
  'flume': {
    'name': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'The name of the agent.'
    },
    'confFile': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
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
      'Default': null,
      'Description': 'The ZooKeeper connection.'
    },
    'zkBasePath': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'The base path in ZooKeeper for agent configuration.'
    }
  },
  'kafka': {
    'bootstrapServers': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'A comma-separated list of host and port pairs for establishing the initial connection to the Kafka cluster.'
    },
    'groupId': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'A unique string that identifies the group of consumer processes to which this consumer belongs.'
    },
    'fetchMinBytes': {
      'Type': 'long',
      'Required': 'false',
      'Default': '1',
      'Description': 'The minimum byte expected for each fetch response.'
    },
    'autoCommitEnabled': {
      'Type': 'boolean',
      'Required': 'false',
      'Default': 'true',
      'Description': "If set to true, the consumer's offset is periodically committed in the background.\n\n This committed offset is used when the process fails as the position from which a new consumer begins."
    },
    'autoCommitIntervalMs': {
      'Type': 'long',
      'Required': 'false',
      'Default': '5000',
      'Description': 'The frequency in milliseconds that the consumer offsets are auto-committed to Kafka if autoCommitEnabled is set to true.'
    },
    'heartbeatIntervalMs': {
      'Type': 'long',
      'Required': 'false',
      'Default': '3000',
      'Description': "The interval between heartbeats to the consumer when using Kafka's group management facilities. \n\nNote: heartbeatIntervalMs must be smaller than sessionTimeoutMs."
    },
    'sessionTimeoutMs': {
      'Type': 'long',
      'Required': 'false',
      'Default': '30000',
      'Description': "The timeout used to detect consumer failures when using Kafka's group management facility."
    },
    'topic': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'The Kafka topic which sends messages to Pulsar.'
    },
    'consumerConfigProperties': {
      'Type': 'Map',
      'Required': 'false',
      'Default': null,
      'Description': 'The consumer configuration properties to be passed to consumers. \n\nNote: other properties specified in the connector configuration file take precedence over this configuration.'
    },
    'keyDeserializationClass': {
      'Type': 'String',
      'Required': 'false',
      'Default': 'org.apache.kafka.common.serialization.StringDeserializer',
      'Description': 'The deserializer class for Kafka consumers to deserialize keys.\n The deserializer is set by a specific implementation of KafkaAbstractSource.'
    },
    'valueDeserializationClass': {
      'Type': 'String',
      'Required': 'false',
      'Default': 'org.apache.kafka.common.serialization.ByteArrayDeserializer',
      'Description': 'The deserializer class for Kafka consumers to deserialize values.'
    }
  },
  'kinesis': {
    'initialPositionInStream': {
      'Type': 'InitialPositionInStream',
      'Required': 'false',
      'Default': 'LATEST',
      'Description': 'The position where the connector starts from.\n\nBelow are the available options:\n\nAT_TIMESTAMP: start from the record at or after the specified timestamp.\n\nLATEST: start after the most recent data record.\n\nTRIM_HORIZON: start from the oldest available data record.'
    },
    'startAtTime': {
      'Type': 'Date',
      'Required': 'false',
      'Default': null,
      'Description': 'If set to AT_TIMESTAMP, it specifies the point in time to start consumption.'
    },
    'applicationName': {
      'Type': 'String',
      'Required': 'false',
      'Default': 'Pulsar IO connector',
      'Description': 'The name of the Amazon Kinesis application. \n\nBy default, the application name is included in the user agent string used to make AWS requests. This can assist with troubleshooting, for example, distinguish requests made by separate connector instances.'
    },
    'checkpointInterval': {
      'Type': 'long',
      'Required': 'false',
      'Default': '60000',
      'Description': 'The frequency of the Kinesis stream checkpoint in milliseconds.'
    },
    'backoffTime': {
      'Type': 'long',
      'Required': 'false',
      'Default': '3000',
      'Description': 'The amount of time to delay between requests when the connector encounters a throttling exception from AWS Kinesis in milliseconds.'
    },
    'numRetries': {
      'Type': 'int',
      'Required': 'false',
      'Default': '3',
      'Description': 'The number of re-attempts when the connector encounters an exception while trying to set a checkpoint.'
    },
    'receiveQueueSize': {
      'Type': 'int',
      'Required': 'false',
      'Default': '1000',
      'Description': 'The maximum number of AWS records that can be buffered inside the connector. \n\nOnce the receiveQueueSize is reached, the connector does not consume any messages from Kinesis until some messages in the queue are successfully consumed.'
    },
    'dynamoEndpoint': {
      'Type': 'String',
      'Required': 'false',
      'Default': null,
      'Description': 'The Dynamo end-point URL, which can be found at here.'
    },
    'cloudwatchEndpoint': {
      'Type': 'String',
      'Required': 'false',
      'Default': null,
      'Description': 'The Cloudwatch end-point URL, which can be found at here.'
    },
    'useEnhancedFanOut': {
      'Type': 'boolean',
      'Required': 'false',
      'Default': 'true',
      'Description': 'If set to true, it uses Kinesis enhanced fan-out.\n\nIf set to false, it uses polling.'
    },
    'awsEndpoint': {
      'Type': 'String',
      'Required': 'false',
      'Default': null,
      'Description': 'The Kinesis end-point URL, which can be found at here.'
    },
    'awsRegion': {
      'Type': 'String',
      'Required': 'false',
      'Default': null,
      'Description': 'The AWS region. \n\nExample\n us-west-1, us-west-2'
    },
    'awsKinesisStreamName': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'The Kinesis stream name.'
    },
    'awsCredentialPluginName': {
      'Type': 'String',
      'Required': 'false',
      'Default': null,
      'Description': 'The fully-qualified class name of AwsCredentialProviderPlugin .\n\nBuilt-in plugs:\n\norg.apache.pulsar.io.kinesis.AwsDefaultProviderChainPlugin:\n this plugin uses the default AWS provider chain.\n\norg.apache.pulsar.io.kinesis.STSAssumeRoleProviderPlugin: \nthis plugin takes a configuration via the awsCredentialPluginParam that describes a role to assume when running the KCL.\nJSON configuration example\n{"roleArn": "arn...", "roleSessionName": "name"} \n\nawsCredentialPluginName is a factory class which creates an AWSCredentialsProvider that is used by Kinesis sink. \n\nIf awsCredentialPluginName set to empty, the Kinesis sink creates a default AWSCredentialsProvider which accepts json-map of credentials in awsCredentialPluginParam.'
    },
    'awsCredentialPluginParam': {
      'Type': 'String',
      'Required': 'false',
      'Default': null,
      'Description': 'The JSON parameter to initialize awsCredentialsProviderPlugin.'
    }
  },
  'netty': {
    'type': {
      'Type': 'String',
      'Required': 'true',
      'Default': 'tcp',
      'Description': 'The network protocol over which data is transmitted to netty. \n\nBelow are the available options:\ntcphttpudp'
    },
    'host': {
      'Type': 'String',
      'Required': 'true',
      'Default': '127.0.0.1',
      'Description': 'The host name or address on which the source instance listen.'
    },
    'port': {
      'Type': 'int',
      'Required': 'true',
      'Default': '10999',
      'Description': 'The port on which the source instance listen.'
    },
    'numberOfThreads': {
      'Type': 'int',
      'Required': 'true',
      'Default': '1',
      'Description': 'The number of threads of Netty TCP server to accept incoming connections and handle the traffic of accepted connections.'
    }
  },
  'rabbitmq': {
    'connectionName': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'The connection name.'
    },
    'host': {
      'Type': 'String',
      'Required': 'true',
      'Default': null,
      'Description': 'The RabbitMQ host.'
    },
    'port': {
      'Type': 'int',
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
      'Default': null,
      'Description': 'The RabbitMQ queue name that messages should be read from or written to.'
    },
    'requestedChannelMax': {
      'Type': 'int',
      'Required': 'false',
      'Default': '0',
      'Description': 'The initially requested maximum channel number. \n\n0 means unlimited.'
    },
    'requestedFrameMax': {
      'Type': 'int',
      'Required': 'false',
      'Default': '0',
      'Description': 'The initially requested maximum frame size in octets. \n\n0 means unlimited.'
    },
    'connectionTimeout': {
      'Type': 'int',
      'Required': 'false',
      'Default': '60000',
      'Description': 'The timeout of TCP connection establishment in milliseconds. \n\n0 means infinite.'
    },
    'handshakeTimeout': {
      'Type': 'int',
      'Required': 'false',
      'Default': '10000',
      'Description': 'The timeout of AMQP0-9-1 protocol handshake in milliseconds.'
    },
    'requestedHeartbeat': {
      'Type': 'int',
      'Required': 'false',
      'Default': '60',
      'Description': 'The requested heartbeat timeout in seconds.'
    },
    'prefetchCount': {
      'Type': 'int',
      'Required': 'false',
      'Default': '0',
      'Description': 'The maximum number of messages that the server delivers.\n\n 0 means unlimited.'
    },
    'prefetchGlobal': {
      'Type': 'boolean',
      'Required': 'false',
      'Default': 'false',
      'Description': 'Whether the setting should be applied to the entire channel rather than each consumer.'
    }
  },
}
