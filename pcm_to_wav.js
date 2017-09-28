var audo = this;

var addWavHeader = function(samples,sampleRateTmp,sampleBits,channelCount){
    var dataLength = samples.byteLength;
    var buffer = new ArrayBuffer(44 + dataLength);
    var view = new DataView(buffer);
    function writeString(view, offset, string){
        for (var i = 0; i < string.length; i++){
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }
    var offset = 0;
    /* 资源交换文件标识符 */
    writeString(view, offset, 'RIFF'); offset += 4;
    /* 下个地址开始到文件尾总字节数,即文件大小-8 */
    view.setUint32(offset, /*32*/ 36 + dataLength, true); offset += 4;
    /* WAV文件标志 */
    writeString(view, offset, 'WAVE'); offset += 4;
    /* 波形格式标志 */
    writeString(view, offset, 'fmt '); offset += 4;
    /* 过滤字节,一般为 0x10 = 16 */
    view.setUint32(offset, 16, true); offset += 4;
    /* 格式类别 (PCM形式采样数据) */
    view.setUint16(offset, 1, true); offset += 2;
    /* 通道数 */
    view.setUint16(offset, channelCount, true); offset += 2;
    /* 采样率,每秒样本数,表示每个通道的播放速度 */
    view.setUint32(offset, sampleRateTmp, true); offset += 4;
    /* 波形数据传输率 (每秒平均字节数) 通道数×每秒数据位数×每样本数据位/8 */
    view.setUint32(offset, sampleRateTmp * channelCount * (sampleBits / 8), true); offset +=4;
    /* 快数据调整数 采样一次占用字节数 通道数×每样本的数据位数/8 */
    view.setUint16(offset, channelCount * (sampleBits / 8), true); offset += 2;
    /* 每样本数据位数 */
    view.setUint16(offset, sampleBits, true); offset += 2;
    /* 数据标识符 */
    writeString(view, offset, 'data'); offset += 4;
    /* 采样数据总数,即数据总大小-44 */
    view.setUint32(offset, dataLength, true); offset += 4;
    function floatTo32BitPCM(output, offset, input){
        input = new Int32Array(input);
        for (var i = 0; i < input.length; i++, offset+=4){
            output.setInt32(offset,input[i],true);
        }
    }
    function floatTo16BitPCM(output, offset, input){
        input = new Int16Array(input);
        for (var i = 0; i < input.length; i++, offset+=2){
            output.setInt16(offset,input[i],true);
        }
    }
    function floatTo8BitPCM(output, offset, input){
        input = new Int8Array(input);
        for (var i = 0; i < input.length; i++, offset++){
            output.setInt8(offset,input[i],true);
        }
    }
    if(sampleBits == 16){
        floatTo16BitPCM(view, 44, samples);
    }else if(sampleBits == 8){
        floatTo8BitPCM(view, 44, samples);
    }else{
        floatTo32BitPCM(view, 44, samples);
    }
    return view.buffer;
}

var _visualize = function(audioContext, buffer) {
    var audioBufferSouceNode = audioContext.createBufferSource(),
        analyser = audioContext.createAnalyser(),
        that = this;
    //connect the source to the analyser
    audioBufferSouceNode.connect(analyser);
    //connect the analyser to the destination(the speaker), or we won't hear the sound
    analyser.connect(audioContext.destination);
    //then assign the buffer to the buffer source node
    audioBufferSouceNode.buffer = buffer;
    //play the source
    if (!audioBufferSouceNode.start) {
        audioBufferSouceNode.start = audioBufferSouceNode.noteOn //in old browsers use noteOn method
        audioBufferSouceNode.stop = audioBufferSouceNode.noteOff //in old browsers use noteOff method
    };
    //stop the previous sound if any
    if (this.animationId !== null) {
        cancelAnimationFrame(this.animationId);
    }
    audioBufferSouceNode.start(0);
    audo.source = audioBufferSouceNode;
    audo.audioContext = audioContext;
}
var pcm_wav = function(pcm,sampleRateTmp,sampleBits,channelCount){
    var audioContext = new ( window.AudioContext || window.webkitAudioContext )();
    var req = new XMLHttpRequest();
    req.open("GET", pcm, true); // grab our audio file
    req.responseType = "arraybuffer";   // needs to be specific type to work
    req.overrideMimeType('text/xml; charset = utf-8')
    req.onload = function() {
        if(this.status!=200){
            alert("pcm文件不存在/文件格式错误！");
            return;
        }
        //根据pcm文件 填写 sampleRateTmp【采样率】（11025） 和sampleBits【采样精度】（16） channelCount【声道】（单声道1，双声道2）
        var fileResult = addWavHeader(req.response,sampleRateTmp,sampleBits,channelCount);
    	audioContext.decodeAudioData(fileResult, function(buffer) {
    	   _visualize(audioContext,buffer);
        });
    };
    req.send();
}