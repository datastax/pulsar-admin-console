import ApiBase from '@/services/ApiBase'
import ApiBaseV2 from '@/services/ApiBaseV2'

export default {
  getNamespaces (cluster, tenant) {
    const response = ApiBase().get(`${cluster}/namespaces/${tenant}`)
    return response
  },
  getFunctions (cluster, namespacePath) {
    const response = ApiBase().get(`${cluster}/functions/${namespacePath}`)
    return response
  },
  getBuiltinSinks (cluster) {
    const response = ApiBase().get(`${cluster}/sinks/builtinsinks`)
    return response
  },
  getSinks (cluster, namespacePath) {
    const response = ApiBase().get(`${cluster}/sinks/${namespacePath}`)
    return response
  },
  getBuiltinSources (cluster) {
    const response = ApiBase().get(`${cluster}/sources/builtinsources`)
    return response
  },
  getSources (cluster, namespacePath) {
    const response = ApiBase().get(`${cluster}/sources/${namespacePath}`)
    return response
  },
  getTopicsByNamespace (cluster, namespacePath) {
    const response = ApiBase().get(`${cluster}/namespaces/${namespacePath}/topics?mode=ALL`)
    return response
  },
  getTopicsNonPersistent (cluster, namespacePath) {
    const response = ApiBase().get(`${cluster}/non-persistent/${namespacePath}`)
    return response
  },
  getTopicsPersistent (cluster, namespacePath) {
    const response = ApiBase().get(`${cluster}/persistent/${namespacePath}`)
    return response
  },
  getPartitionedTopics (cluster, namespacePath) {
    const response = ApiBase().get(`${cluster}/persistent/${namespacePath}/partitioned`)
    return response
  },
  getNamespaceInfo (cluster, namespacePath) {
    const response = ApiBase().get(`${cluster}/namespaces/${namespacePath}`)
    return response
  },
  getNamespacePersistence (cluster, namespacePath) {
    const response = ApiBase().get(`${cluster}/namespaces/${namespacePath}/persistence`)
    return response
  },
  getTenantConfig (cluster, tenant) {
    const response = ApiBase().get(`${cluster}/tenants/${tenant}`)
    return response
  },
  getTenants (cluster, tenant) {
    const response = ApiBase().get(`${cluster}/tenants`)
    return response
  },
  getTenantStats (cluster, tenant) {
    const response = ApiBaseV2().get(`${cluster}/br/stats/topics/${tenant}`)
    return response
  },
  getBrokerLoadReport (cluster) {
    const response = ApiBaseV2().get(`${cluster}/broker-stats/load-report`)
    return response
  },
  getFunctionLogs (cluster, sourcePath, backPos, forwardPos, instance = 0) {
    if (backPos > 0) {
      const response = ApiBaseV2().get(`${cluster}/br/function-logs/${sourcePath}/${instance}?backwardpos=${backPos}`)
      return response
    } else if (forwardPos > 0) {
      const response = ApiBaseV2().get(`${cluster}/br/function-logs/${sourcePath}/${instance}?forwardpos=${forwardPos}`)
      return response
    } else {
      const response = ApiBaseV2().get(`${cluster}/br/function-logs/${sourcePath}/${instance}`)
      return response
    }
  },
  generateToken (cluster, subject) {
    const response = ApiBaseV2().get(`${cluster}/br/subject/${subject}`)
    return response
  },
  getClusterConfig (cluster) {
    const response = ApiBase().get(`${cluster}/brokers/configuration/runtime`)
    return response
  },
  getTopicStats (cluster, type, topicPath) {
    const response = ApiBase().get(`${cluster}/${type}/${topicPath}/stats`)
    return response
  },
  getFunctionStats (cluster, funcPath) {
    const response = ApiBase().get(`${cluster}/functions/${funcPath}/stats`)
    return response
  },
  getSinkStats (cluster, funcPath) {
    const response = ApiBase().get(`${cluster}/sinks/${funcPath}/stats`)
    return response
  },
  getSourceStats (cluster, funcPath) {
    const response = ApiBase().get(`${cluster}/sources/${funcPath}/stats`)
    return response
  },
  stopFunctionInstance (cluster, funcPath, instance) {
    const response = ApiBase().post(`${cluster}/functions/${funcPath}/${instance}/stop`)
    return response
  },
  stopSinkInstance (cluster, funcPath, instance) {
    const response = ApiBase().post(`${cluster}/sinks/${funcPath}/${instance}/stop`)
    return response
  },
  stopSourceInstance (cluster, funcPath, instance) {
    const response = ApiBase().post(`${cluster}/sources/${funcPath}/${instance}/stop`)
    return response
  },
  startFunctionInstance (cluster, funcPath, instance) {
    const response = ApiBase().post(`${cluster}/functions/${funcPath}/${instance}/start`)
    return response
  },
  startSinkInstance (cluster, funcPath, instance) {
    const response = ApiBase().post(`${cluster}/sinks/${funcPath}/${instance}/start`)
    return response
  },
  startSourceInstance (cluster, funcPath, instance) {
    const response = ApiBase().post(`${cluster}/sources/${funcPath}/${instance}/start`)
    return response
  },
  restartFunctionInstance (cluster, funcPath, instance) {
    const response = ApiBase().post(`${cluster}/functions/${funcPath}/${instance}/restart`)
    return response
  },
  restartSinkInstance (cluster, funcPath, instance) {
    const response = ApiBase().post(`${cluster}/sinks/${funcPath}/${instance}/restart`)
    return response
  },
  restartSourceInstance (cluster, funcPath, instance) {
    const response = ApiBase().post(`${cluster}/sources/${funcPath}/${instance}/restart`)
    return response
  },
  stopAllFunctionInstances (cluster, funcPath) {
    const response = ApiBase().post(`${cluster}/functions/${funcPath}/stop`)
    return response
  },
  stopAllSinkInstances (cluster, funcPath) {
    const response = ApiBase().post(`${cluster}/sinks/${funcPath}/stop`)
    return response
  },
  stopAllSourceInstances (cluster, funcPath) {
    const response = ApiBase().post(`${cluster}/sources/${funcPath}/stop`)
    return response
  },
  startAllFunctionInstances (cluster, funcPath) {
    const response = ApiBase().post(`${cluster}/functions/${funcPath}/start`)
    return response
  },
  startAllSinkInstances (cluster, funcPath) {
    const response = ApiBase().post(`${cluster}/sinks/${funcPath}/start`)
    return response
  },
  startAllSourceInstances (cluster, funcPath) {
    const response = ApiBase().post(`${cluster}/sources/${funcPath}/start`)
    return response
  },
  restartAllFunctionInstances (cluster, funcPath) {
    // Bumping the timeout on this command
    var configData = {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    const response = ApiBase().post(`${cluster}/functions/${funcPath}/restart`, null, configData)
    // const response = ApiBase().post(`${cluster}/functions/${funcPath}/restart`)
    return response
  },
  restartAllSinkInstances (cluster, funcPath) {
    // Bumping the timeout on this command
    var configData = {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    const response = ApiBase().post(`${cluster}/sinks/${funcPath}/restart`, null, configData)
    // const response = ApiBase().post(`${cluster}/sinks/${funcPath}/restart`)
    return response
  },
  restartAllSourceInstances (cluster, funcPath) {
    // Bumping the timeout on this command
    var configData = {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    const response = ApiBase().post(`${cluster}/sources/${funcPath}/restart`, null, configData)
    // const response = ApiBase().post(`${cluster}/sources/${funcPath}/restart`)
    return response
  },
  getFunctionStatus (cluster, funcPath) {
    const response = ApiBase().get(`${cluster}/functions/${funcPath}/status`)
    return response
  },
  getSinkStatus (cluster, funcPath) {
    const response = ApiBase().get(`${cluster}/sinks/${funcPath}/status`)
    return response
  },
  getSourceStatus (cluster, funcPath) {
    const response = ApiBase().get(`${cluster}/sources/${funcPath}/status`)
    return response
  },
  getFunctionInfo (cluster, funcPath) {
    const response = ApiBase().get(`${cluster}/functions/${funcPath}`)
    return response
  },
  getSinkInfo (cluster, funcPath) {
    const response = ApiBase().get(`${cluster}/sinks/${funcPath}`)
    return response
  },
  getSourceInfo (cluster, funcPath) {
    const response = ApiBase().get(`${cluster}/sources/${funcPath}`)
    return response
  },
  getFunctionState (cluster, funcPath, key) {
    const response = ApiBase().get(`${cluster}/functions/${funcPath}/state/${key}`)
    return response
  },
  getSinkState (cluster, funcPath, key) {
    const response = ApiBase().get(`${cluster}/sinks/${funcPath}/state/${key}`)
    return response
  },
  getSourceState (cluster, funcPath, key) {
    const response = ApiBase().get(`${cluster}/sources/${funcPath}/state/${key}`)
    return response
  },
  setFunctionState (cluster, funcPath, key, value) {
    let formData = new FormData()
    const stateData = {
      key: key,
      stringValue: value
    }
    const blob = new Blob([JSON.stringify(stateData)], { type: 'application/json' })
    formData.append('state', blob)

    var configData = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    const response = ApiBase().post(`${cluster}/functions/${funcPath}/state/${key}`, formData, configData)
    return response
  },
  setSinkState (cluster, funcPath, key, value) {
    let formData = new FormData()
    const stateData = {
      key: key,
      stringValue: value
    }
    const blob = new Blob([JSON.stringify(stateData)], { type: 'application/json' })
    formData.append('state', blob)

    var configData = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    const response = ApiBase().post(`${cluster}/sinks/${funcPath}/state/${key}`, formData, configData)
    return response
  },
  setSourceState (cluster, funcPath, key, value) {
    let formData = new FormData()
    const stateData = {
      key: key,
      stringValue: value
    }
    const blob = new Blob([JSON.stringify(stateData)], { type: 'application/json' })
    formData.append('state', blob)

    var configData = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    const response = ApiBase().post(`${cluster}/sources/${funcPath}/state/${key}`, formData, configData)
    return response
  },
  getTopicInternalStats (cluster, type, topicPath) {
    const response = ApiBase().get(`${cluster}/${type}/${topicPath}/internalStats`)
    return response
  },
  getTopicBacklog (cluster, type, topicPath) {
    const response = ApiBase().get(`${cluster}/${type}/${topicPath}/backlog`)
    return response
  },
  getTopicSchema (cluster, topicPath) {
    const response = ApiBase().get(`${cluster}/schemas/${topicPath}/schema`)
    return response
  },
  deleteTopicSchema (cluster, topicPath) {
    const response = ApiBase().delete(`${cluster}/schemas/${topicPath}/schema`)
    return response
  },
  updateTopicSchema (cluster, topicPath, schemaObj) {
    const response = ApiBase().post(`${cluster}/schemas/${topicPath}/schema`, schemaObj, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response
  },
  getPartitionedTopicStats (cluster, topicPath) {
    const response = ApiBase().get(`${cluster}/persistent/${topicPath}/partitioned-stats`)
    return response
  },
  deleteTopic (cluster, type, topicPath) {
    const response = ApiBase().delete(`${cluster}/${type}/${topicPath}`)
    return response
  },
  deleteFunction (cluster, functionPath) {
    const response = ApiBase().delete(`${cluster}/functions/${functionPath}`)
    return response
  },
  deleteSink (cluster, sinkPath) {
    const response = ApiBase().delete(`${cluster}/sinks/${sinkPath}`)
    return response
  },
  deleteSource (cluster, sourcePath) {
    const response = ApiBase().delete(`${cluster}/sources/${sourcePath}`)
    return response
  },
  newTriggerFunction (cluster, functionPath, message, topic) {
    let formData = new FormData()
    var messageBlob = new Blob([JSON.stringify(message)], { type: 'application/json' })
    var topicBlob = new Blob([JSON.stringify(topic)], { type: 'application/json' })

    formData.append('data', messageBlob)
    formData.append('topic', topicBlob)

    var configData = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Connection': 'close'
      }
    }

    // Bumping the timeout on this command
    configData['timeout'] = 6000

    const response = ApiBase().post(`${cluster}/functions/${functionPath}/trigger`, formData, configData)
    return response
  },
  triggerFunction (cluster, functionPath, message, topic) {
    let formData = new FormData()
    formData.append('data', message)
    formData.append('topic', topic)

    var configData = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    // Bumping the timeout on this command
    configData['timeout'] = 6000

    const response = ApiBase().post(`${cluster}/functions/${functionPath}/trigger`, formData, configData)
    return response
  },
  createFunction (cluster, functionPath, functionConfig, fileBlob, fileName) {
    let formData = new FormData()
    // Convert the functionConfig object to JSON then store it in a blob
    var blob = new Blob([JSON.stringify(functionConfig)], { type: 'application/json' })
    formData.append('functionConfig', blob)

    formData.append('data', fileBlob, fileName)

    const response = ApiBase().post(`${cluster}/functions/${functionPath}`, formData, {
      timeout: 30000,
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    return response
  },
  createSink (cluster, sinkPath, sinkConfig) {
    let formData = new FormData()
    // Convert the sinkConfig object to JSON then store it in a blob
    var blob = new Blob([JSON.stringify(sinkConfig)], { type: 'application/json' })
    formData.append('sinkConfig', blob)

    const response = ApiBase().post(`${cluster}/sinks/${sinkPath}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  },
  createSource (cluster, sourcePath, sourceConfig) {
    let formData = new FormData()
    // Convert the sourceConfig object to JSON then store it in a blob
    var blob = new Blob([JSON.stringify(sourceConfig)], { type: 'application/json' })
    formData.append('sourceConfig', blob)

    const response = ApiBase().post(`${cluster}/sources/${sourcePath}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  },
  updateFunction (cluster, functionPath, functionConfig, fileBlob, fileName) {
    let formData = new FormData()
    // Convert the functionConfig object to JSON then store it in a blob
    var blob = new Blob([JSON.stringify(functionConfig)], { type: 'application/json' })
    formData.append('functionConfig', blob)

    if (fileBlob) {
      formData.append('data', fileBlob, fileName)
    }

    const response = ApiBase().put(`${cluster}/functions/${functionPath}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  },
  updateSink (cluster, sinkPath, sinkConfig, fileBlob, fileName) {
    let formData = new FormData()
    // Convert the sinkConfig object to JSON then store it in a blob
    var blob = new Blob([JSON.stringify(sinkConfig)], { type: 'application/json' })
    formData.append('sinkConfig', blob)

    if (fileBlob) {
      formData.append('data', fileBlob, fileName)
    }

    const response = ApiBase().put(`${cluster}/sinks/${sinkPath}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  },
  updateSource (cluster, sourcePath, sourceConfig, fileBlob, fileName) {
    let formData = new FormData()
    // Convert the sourceConfig object to JSON then store it in a blob
    var blob = new Blob([JSON.stringify(sourceConfig)], { type: 'application/json' })
    formData.append('sourceConfig', blob)

    if (fileBlob) {
      formData.append('data', fileBlob, fileName)
    }

    const response = ApiBase().put(`${cluster}/sources/${sourcePath}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  },
  deletePartitionedTopic (cluster, topicPath) {
    const response = ApiBase().delete(`${cluster}/persistent/${topicPath}/partitions`)
    return response
  },
  createPartitionedTopic (cluster, topicPath, numPartitions) {
    const response = ApiBase().put(`${cluster}/persistent/${topicPath}/partitions`, numPartitions, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response
  },
  createMissingPartitions (cluster, topicPath) {
    const response = ApiBase().post(`${cluster}/persistent/${topicPath}/createMissedPartitions`, '', {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response
  },
  createNonPartitionedTopic (cluster, topicPath) {
    const response = ApiBase().put(`${cluster}/persistent/${topicPath}`)
    return response
  },
  createTenant (cluster, tenant, allowedCluster) {
    const body = {
      adminRoles: [],
      allowedClusters: [allowedCluster]
    }
    const response = ApiBase().put(`${cluster}/tenants/${tenant}`, body)
    return response
  },
  updateNamespaceBacklog (cluster, namespacePath, limit, policy) {
    const body = {
      limit: limit,
      policy: policy
    }
    const response = ApiBase().post(`${cluster}/namespaces/${namespacePath}/backlogQuota`, body)
    return response
  },
  updateRetention (cluster, namespacePath, size, time) {
    const body = {
      retentionSizeInMB: size,
      retentionTimeInMinutes: time
    }
    const response = ApiBase().post(`${cluster}/namespaces/${namespacePath}/retention`, body)
    return response
  },
  updateNamespaceTopicDispatchRate (cluster, namespacePath, message, byte, interval) {
    const body = {
      dispatchThrottlingRateInMsg: message,
      dispatchThrottlingRateInByte: byte,
      ratePeriodInSecond: interval
    }
    const response = ApiBase().post(`${cluster}/namespaces/${namespacePath}/dispatchRate`, body)
    return response
  },
  updateNamespaceSubscriptionDispatchRate (cluster, namespacePath, message, byte, interval) {
    const body = {
      dispatchThrottlingRateInMsg: message,
      dispatchThrottlingRateInByte: byte,
      ratePeriodInSecond: interval
    }
    const response = ApiBase().post(`${cluster}/namespaces/${namespacePath}/subscriptionDispatchRate`, body)
    return response
  },
  updateNamespaceProducerRate (cluster, namespacePath, message, byte) {
    const body = {
      publishThrottlingRateInMsg: message,
      publishThrottlingRateInByte: byte,
    }
    const response = ApiBase().post(`${cluster}/namespaces/${namespacePath}/publishRate`, body)
    return response
  },
  updateNamespaceOffloadThreshold (cluster, namespacePath, threshold) {
    const response = ApiBase().put(`${cluster}/namespaces/${namespacePath}/offloadThreshold`, threshold, { headers: {
      'Content-Type': 'application/json'
    }} )
    return response
  },
  updateMaxProducers (cluster, namespacePath, producers) {
    
    const response = ApiBase().post(`${cluster}/namespaces/${namespacePath}/maxProducersPerTopic`, producers, { headers: {
      'Content-Type': 'application/json'
    }} )
    return response
  },
  updateTtl (cluster, namespacePath, ttl) {
    
    const response = ApiBase().post(`${cluster}/namespaces/${namespacePath}/messageTTL`, ttl, { headers: {
      'Content-Type': 'application/json'
    }} )
    return response
  },
  updateDedupe (cluster, namespacePath, dedupe) {
    
    const response = ApiBase().post(`${cluster}/namespaces/${namespacePath}/deduplication`, dedupe, { headers: {
      'Content-Type': 'application/json'
    }} )
    return response
  },
  updateMaxConsTopic (cluster, namespacePath, consumers) {
    
    const response = ApiBase().post(`${cluster}/namespaces/${namespacePath}/maxConsumersPerTopic`, consumers, { headers: {
      'Content-Type': 'application/json'
    }} )
    return response
  },
  updateMaxConsSub (cluster, namespacePath, consumers) {
    
    const response = ApiBase().post(`${cluster}/namespaces/${namespacePath}/maxConsumersPerSubscription`, consumers, { headers: {
      'Content-Type': 'application/json'
    }} )
    return response
  },
  deleteNamespaceBacklog (cluster, namespacePath) {
    return ApiBase().delete(`${cluster}/namespaces/${namespacePath}/backlogQuota`)
  },
  deleteNamespace (cluster, namespacePath) {
    return ApiBase().delete(`${cluster}/namespaces/${namespacePath}`)
  },
  createNamespace (cluster, namespacePath) {
    return ApiBase().put(`${cluster}/namespaces/${namespacePath}`)
  },
  unloadNamespace (cluster, namespacePath) {
    return ApiBase().put(`${cluster}/namespaces/${namespacePath}/unload`)
  },
  unloadBundle (cluster, namespacePath, bundle) {
    return ApiBase().put(`${cluster}/namespaces/${namespacePath}/${bundle}/unload`)
  },
  deleteBundle (cluster, namespacePath, bundle) {
    return ApiBase().delete(`${cluster}/namespaces/${namespacePath}/${bundle}`)
  },
  deleteNamespaceRole (cluster, namespacePath, role) {
    return ApiBase().delete(`${cluster}/namespaces/${namespacePath}/permissions/${role}`)
  },
  addNamespaceRole (cluster, namespacePath, role, actions) {
    return ApiBase().post(`${cluster}/namespaces/${namespacePath}/permissions/${role}`,actions)
  },
  splitBundle (cluster, namespacePath, bundle, splitStrategy = 'range_equally_divide', unload = false) {
    return ApiBase().put(`${cluster}/namespaces/${namespacePath}/${bundle}/split?splitAlgorithmName=${splitStrategy}&unload=${unload}`)
  },
  compactTopic (cluster, topicPath) {
    const response = ApiBase().put(`${cluster}/persistent/${topicPath}/compaction`)
    return response
  },
  offloadTopic (cluster, topicPath, ledgerId, entryId, partitionIndex) {
    const response = ApiBase().put(`${cluster}/persistent/${topicPath}/offload`, {
      'entryId': entryId,
      'ledgerId': ledgerId,
      'partitionIndex': partitionIndex
    })
    return response
  },
  getOffloadStatus (cluster, topicPath) {
    const response = ApiBase().get(`${cluster}/persistent/${topicPath}/offload`)
    return response
  },
  getCompactionStatus (cluster, topicPath) {
    const response = ApiBase().get(`${cluster}/persistent/${topicPath}/compaction`)
    return response
  },
  unloadTopic (cluster, topicPath) {
    const response = ApiBase().put(`${cluster}/persistent/${topicPath}/unload`)
    return response
  },
  forceDeleteTopic (cluster, type, topicPath) {
    const response = ApiBase().delete(`${cluster}/${type}/${topicPath}`, {
      params: {
        force: 'true'
      }
    })
    return response
  },
  forceDeletePartitionedTopic (cluster, topicPath) {
    const response = ApiBase().delete(`${cluster}/persistent/${topicPath}/partitions`, {
      params: {
        force: 'true'
      }
    })
    return response
  },
  deleteSubscription (cluster, type, topicPath, subName) {
    var encodedSub = encodeURIComponent(subName)
    const response = ApiBase().delete(`${cluster}/${type}/${topicPath}/subscription/${encodedSub}`)
    return response
  },
  clearBacklog (cluster, type, topicPath, subName) {
    var encodedSub = encodeURIComponent(subName)
    const response = ApiBase().post(`${cluster}/${type}/${topicPath}/subscription/${encodedSub}/skip_all`)
    return response
  },
  clearBacklogNumber (cluster, type, topicPath, subName, number) {
    var encodedSub = encodeURIComponent(subName)
    const response = ApiBase().post(`${cluster}/${type}/${topicPath}/subscription/${encodedSub}/skip/${number}`)
    return response
  },
  rewindSubTime (cluster, type, topicPath, subName, timestamp) {
    var encodedSub = encodeURIComponent(subName)
    const response = ApiBase().post(`${cluster}/${type}/${topicPath}/subscription/${encodedSub}/resetcursor/${timestamp}`)
    return response
  },
  expireSubTime (cluster, type, topicPath, subName, seconds) {
    var encodedSub = encodeURIComponent(subName)
    const response = ApiBase().post(`${cluster}/${type}/${topicPath}/subscription/${encodedSub}/expireMessages/${seconds}`)
    return response
  },
  peekSubIndex (cluster, type, topicPath, subName, index) {
    var encodedSub = encodeURIComponent(subName)
    const response = ApiBase().get(`${cluster}/${type}/${topicPath}/subscription/${encodedSub}/position/${index}`)
    return response
  },
  lastMessageId (cluster, type, topicPath) {
    const response = ApiBase().get(`${cluster}/${type}/${topicPath}/lastMessageId`)
    return response
  },
  rewindSubPosition (cluster, type, topicPath, subName, ledgerId, entryId, partitionIndex) {
    var encodedSub = encodeURIComponent(subName)
    const response = ApiBase().post(`${cluster}/${type}/${topicPath}/subscription/${encodedSub}/resetcursor`, {
      entryId: entryId,
      ledgerId: ledgerId,
      partitionIndex: partitionIndex
    })
    return response
  },
  createSubscriptionLatest (cluster, type, topicPath, subName) {
    var encodedSub = encodeURIComponent(subName)
    const magicString = '{"ledgerId":9223372036854775807,"entryId":9223372036854775807,"partitionIndex":-1}'
    const response = ApiBase().put(`${cluster}/${type}/${topicPath}/subscription/${encodedSub}`, magicString, {
      headers: {
        'Content-Type': 'application/json'
      } })
    return response
  },
  createSubscriptionPosition (cluster, type, topicPath, subName, ledgerId, entryId, partitionIndex) {
    var encodedSub = encodeURIComponent(subName)
    const response = ApiBase().put(`${cluster}/${type}/${topicPath}/subscription/${encodedSub}`, {
      'entryId': entryId,
      'ledgerId': ledgerId,
      'partitionIndex': partitionIndex
    })
    return response
  },
  expireAllSubscriptions (cluster, type, topicPath, expireTime) {
    const response = ApiBase().post(`${cluster}/${type}/${topicPath}/all_subscription/expireMessages/${expireTime}`)
    return response
  },
}
