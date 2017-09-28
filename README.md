# pcm_to_wav
pcm音频数据流转wav直接播放。【PCM audio stream 】

# 应用场景
在线直接播放pcm音频数据。

## Example

```html
<!DOCTYPE html>
<html>
    <head>
        <meta name="description" content="pcm player">
		<meta charset="UTF-8">
        <title>pcm to wav </title>
    </head>
    <body>
        采样率 <input type="number" value=11025 min=0 id="sampleRate"/>
        采样精度    <select id="sampleBits">
        <option value="8">8bits</option>
        <option value="16" selected>16bits</option>
        <option value="32">32bits</option>
        </select>
        声道  <select id="channelCount">
        <option value="1">单声道</option>
        <option value="2">双声道</option>
        </select>

        //引入pcm_to_wav.js
        <script type="text/javascript" src="pcm_to_wav.js"></script>
        <script type="text/javascript">
        	//直接调用即可播放pcm音频数据
            pcm_wav('test.pcm','11025','16','1');
        </script>
    </body>
</html>
```

### 根据自己的业务修改js文件，可控制pcm音频播放暂停等。

### Test Demo [HTML5_Audio_Visualizer](https://loringheart.github.io/pcm_to_wav/)
测试 test.pcm 文件有点大，网络不好的情况请稍等一下。
 
### 参考资料  [HTML5_Audio_Visualizer](https://github.com/loringmore/HTML5_Audio_Visualizer)

### 测试本地pcm文件 [HTML5_Audio_Visualizer](https://loringheart.github.io/pcm_to_wav/demo/)


