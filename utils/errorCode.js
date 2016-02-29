/**
 * Created by Frank on 16/2/26.
 */
'use strict';

const OK = 0;
const ValidateSignatureError = -40001;
const ParseXmlError = -40002;
const ComputeSignatureError = -40003;
const IllegalAesKey = -40004;
const ValidateAppidError = -40005;
const EncryptAESError = -40006;
const DecryptAESError = -40007;
const IllegalBuffer = -40008;

module.exports = {
    OK,
    ValidateSignatureError,
    ParseXmlError,
    ComputeSignatureError,
    IllegalAesKey,
    ValidateAppidError,
    EncryptAESError,
    DecryptAESError,
    IllegalBuffer
};