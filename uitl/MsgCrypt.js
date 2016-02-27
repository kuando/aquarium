/**
 * Created by Frank on 16/2/26.
 */
'use strict';
const _ = require('lodash');
const crypto = require('crypto');
const libxmljs = require("libxmljs");
const randomString = require('randomstring');


/**
 * 计算公共平台的消息签名接口
 * @param token
 * @param timestamp
 * @param nonce
 * @param encrypt
 */
function getSHA1(token, timestamp, nonce, encrypt) {
    let sortedList = [token, timestamp, nonce, encrypt];
    sortedList.sort();
    let sha = crypto.createHash('sha1');
    sha.update(sortedList.join(""));
    return sha.digest("hex");
}


function extractXml(xmlText) {
    try {
        let xmlDoc = libxmljs.parseXml(xmlText);
        let encrypt = xmlDoc.get('//Encrypt');
        let toUserName = xmlDoc.get('//ToUserName');
        return {
            encrypt: encrypt.text(),
            toUseName: toUserName.text()
        };
    } catch (err) {
        throw new Error('解析xml失败')
    }
}

function generateXml(data) {
    return `
    <xml>
        <Encrypt><![CDATA[${data.encrypt}]]></Encrypt>
        <MsgSignature><![CDATA[${data.signature}]]></MsgSignature>
        <TimeStamp>${data.timestamp}</TimeStamp>
        <Nonce><![CDATA[${data.nonce}]]></Nonce>
    </xml>`;
}


//对明文进行补位填充
function pkcs7Encode(size) {
    let blockSize = 32;
    let amountToPad = blockSize - (size % blockSize);
    if (amountToPad === 0) {
        amountToPad = blockSize;
    }
    let tmp = "";
    let padChr = String.fromCharCode(amountToPad);
    for (let i = 0; i < amountToPad; i++) {
        tmp += padChr;
    }
    return new Buffer(tmp);
}

// 删除解密后的明文补位字符
function pkcs7Decode(decrypted) {

    let pad = _.last(decrypted);
    if (pad < 1 || pad > 32) {
        pad = 0;
    }
    return decrypted.slice(0, decrypted.length - pad);
}

//获取网络字节序
function getNetworkBytesOrder(sourceNumber) {
    let buf = new Buffer(4);
    buf[3] = sourceNumber & 0xFF;
    buf[2] = sourceNumber >> 8 & 0xFF;
    buf[1] = sourceNumber >> 16 & 0xFF;
    buf[0] = sourceNumber >> 24 & 0xFF;
    return buf;
}

//还原4个字节的网络字节序
function recoverNetworkBytesOrder(orderBuf) {
    let sourceNumber = 0;
    for (let i = 0; i < 4; i++) {
        sourceNumber <<= 8;
        sourceNumber |= orderBuf[i] & 0xFF;
    }
    return sourceNumber;
}


// 获取16位随机字符串
function getRandomString() {
    return randomString.generate({
        length: 16
    });
}

/**
 *
 * @param token 公共平台开发者设置的token
 * @param key   EncodingAESKey
 * @param appid 公共平台appid
 * @constructor
 */
function Prpcrypt(token, key, appid) {
    this.token = token;
    this.key = new Buffer(key + '=', 'base64');
    this.appid = appid;
}

Prpcrypt.prototype.getCipher = function () {
    let cipher = crypto.createCipheriv('aes-256-cbc', this.key, this.key.slice(0,16));
    cipher.setAutoPadding(true);
    return cipher;
};

Prpcrypt.prototype.getDecipher = function () {
    let decipher = crypto.createDecipheriv('aes-256-cbc', this.key, this.key.slice(0, 16));
    decipher.setAutoPadding(true);
    return decipher;
};


/**
 * 对消息进行加密
 * @param text  需要加密的明文
 */
Prpcrypt.prototype.encrypt = function (text) {
    let randomBuf = new Buffer(getRandomString());
    let textBuf = new Buffer(text);
    let netBytesOrderBuf = new Buffer(getNetworkBytesOrder(textBuf.length));
    let appidBuf = new Buffer(this.appid);
    let totalLength = randomBuf.length + textBuf.length + netBytesOrderBuf.length + appidBuf.length;
    let padBuf = pkcs7Encode(totalLength);
    totalLength += padBuf.length;
    let sumBuf = Buffer.concat([randomBuf, netBytesOrderBuf, textBuf, appidBuf, padBuf], totalLength);
    let cipher = this.getCipher();
    try {
        let crypted = Buffer.concat([cipher.update(sumBuf), cipher.final()]);
        return crypted.toString('base64');
    } catch (err) {
        throw new Error(err);
    }
};

Prpcrypt.prototype.decrypt = function (text) {
    let decipher = this.getDecipher();
    let decrypted = new Buffer(text, 'base64');
    let xmlContent;
    let fromAppid;
    try {
        decrypted = Buffer.concat([decipher.update(decrypted), decipher.final()]);
        decrypted = pkcs7Decode(new Buffer(decrypted));
        let networkOrder = decrypted.slice(16, 20);
        let xmlLength = recoverNetworkBytesOrder(networkOrder);
        xmlContent = decrypted.slice(20, 20 + xmlLength).toString();
        fromAppid = decrypted.slice(20 + xmlLength, decrypted.length).toString();
    } catch (err) {
        throw new Error(err);
    }
    if (fromAppid !== this.appid) {
        throw new Error('appid不一致');
    }
    return xmlContent;
};

/**
 *
 * @param replayMsg 回复用户的消息
 * @param nonce
 * @param timestamp
 */
Prpcrypt.prototype.encryptMsg = function (replayMsg, nonce, timestamp) {
    let encrypt = this.encrypt(replayMsg);
    if (timestamp === "") {
        timestamp = new Date().getTime();
    }
    let signature = getSHA1(this.token, timestamp, nonce, encrypt);
    return generateXml({
        signature,
        nonce,
        timestamp,
        encrypt
    })
};

/**
 *
 * @param msgSignature
 * @param timestamp
 * @param nonce
 * @param postData
 */
Prpcrypt.prototype.decryptMsg = function (msgSignature, timestamp, nonce, postData) {
    let xmlData = extractXml(postData);
    let signature = getSHA1(this.token, timestamp, nonce, xmlData.encrypt);
    if (signature !== msgSignature) {
        throw new Error('签名不匹配');
    }
    return this.decrypt(xmlData.encrypt);
};


module.exports = Prpcrypt;

