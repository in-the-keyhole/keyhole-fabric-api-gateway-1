'use strict';
/** 
Copyright 2019 Keyhole Labs LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


var config = require('../config.js');
var log4js = require('log4js');
var logger = log4js.getLogger('endpoint/channelconfig.js');
logger.setLevel(config.loglevel);

var util = require('./util.js');

var getConfig = function (channel_id, block_number) {
    return Promise.resolve().then(() => {
        return util.connectChannel(channel_id);
    }).then((c) => {
        return c.getChannelConfig();
    }).then((r) => {
        var result = {};
        var bt = r.config.channel_group.groups.map.Orderer.value.values.map.BatchTimeout.value.value.readString(4);
        var bs = r.config.channel_group.groups.map.Orderer.value.values.map.BatchSize.value.value.readVarint32ZigZag();
        var ct = r.config.channel_group.groups.map.Orderer.value.values.map.ConsensusType.value.value.readString(6);
        var ha = r.config.channel_group.values.map.HashingAlgorithm.value.value.readString(8);
        var oa = r.config.channel_group.values.map.OrdererAddresses.value.value.readString(20);
        result.hashAlgorithm = ha.substring(2);
        result.ordererAddresses = oa.substring(2);
        result.batchSize = bs;
        result.batchTimeout = bt.substring(2);
        result.consensusType = ct.substring(2);

        util.done(channel_id);
        return JSON.stringify(result);
    }).catch((err) => {
        logger.error("Caught Error", err);
        util.removeChannel(channel_id);
        return "Error " + err;
    });
};

exports.getConfig = getConfig;
