# MIDI 播放器调试指南

## 问题描述

用户反馈点击播放按钮没有声音，播放器似乎没有正常工作。

## 调试步骤

### 1. 检查浏览器控制台

在浏览器中打开开发者工具 (F12)，切换到 Console 标签页，然后：

1. 访问作品页面
2. 找到协作请求中的 MIDI 播放器
3. 点击播放按钮
4. 查看控制台输出的调试信息

### 2. 预期的调试输出

正常情况下，你应该看到以下输出：

```
Loading MIDI file from: /uploads/midi/xxx.mid
Initializing audio context...
Audio context started, state: running
Synth created: PolySynth {...}
Volume set to: -6.020599913279624
Transport obtained: Transport {...}
Testing synth with a simple note...
Audio initialized successfully
MIDI file loaded, size: 34 bytes
MIDI parsed successfully
MIDI loaded successfully: {duration: 2, tracks: 1, name: ""}
Track 0: {name: "", notes: 1, instruments: "acoustic grand piano", firstNote: {...}}
playMidi called, isPlaying: false
midiData: Midi {...}
synthRef.current: PolySynth {...}
transportRef.current: Transport {...}
Starting playback...
Transport state: stopped
Track 0: 1 notes
Note 0: {name: "C", octave: 4, time: 0, duration: 2, velocity: 64}
Total notes scheduled: 1
Volume set to: -6.020599913279624
Transport started, isPlaying set to true
Playing note: C4 at time 0
```

### 3. 常见问题及解决方案

#### 问题 1：音频上下文未启动

**症状**：看到 "Audio context started, state: suspended"
**原因**：浏览器安全策略要求用户交互才能启动音频上下文
**解决方案**：

- 确保点击了播放按钮
- 检查浏览器是否支持 Web Audio API
- 尝试刷新页面后重新点击播放

#### 问题 2：MIDI 文件加载失败

**症状**：看到 "Failed to load MIDI" 错误
**原因**：文件路径错误或文件格式问题
**解决方案**：

- 检查文件路径是否正确
- 确认文件是有效的 MIDI 格式
- 检查网络连接

#### 问题 3：没有音符数据

**症状**：看到 "MIDI loaded successfully" 但 notes: 0
**原因**：MIDI 文件为空或没有音符数据
**解决方案**：

- 使用包含音符的 MIDI 文件
- 检查 MIDI 文件是否损坏

#### 问题 4：合成器没有声音

**症状**：看到 "Playing note: C4 at time 0" 但没有声音
**原因**：音量设置问题或音频设备问题
**解决方案**：

- 检查系统音量设置
- 确认浏览器音量未被静音
- 检查音频设备连接
- 尝试调整播放器中的音量滑块

#### 问题 5：音符调度失败

**症状**：没有看到 "Playing note" 输出
**原因**：音符调度逻辑问题
**解决方案**：

- 检查 MIDI 文件的时间信息
- 确认音符的 velocity 值在有效范围内
- 检查合成器是否正确初始化

### 4. 测试用的简单 MIDI 文件

我已经创建了一个包含单个 C4 音符的简单 MIDI 文件用于测试：

- **文件大小**：34 bytes
- **内容**：一个 C4 音符，持续 2 秒
- **用途**：验证播放器基本功能

### 5. 手动测试步骤

1. **基础测试**：

   - 打开浏览器开发者工具
   - 访问作品页面
   - 找到最新的协作请求（包含简单测试 MIDI）
   - 点击播放按钮

2. **音频测试**：

   - 检查系统音量
   - 检查浏览器标签页是否被静音
   - 尝试调整播放器音量滑块

3. **网络测试**：
   - 检查 MIDI 文件是否可以正常访问
   - 确认文件大小和格式正确

### 6. 浏览器兼容性

支持的浏览器：

- ✅ Chrome 66+
- ✅ Firefox 60+
- ✅ Safari 14.1+
- ✅ Edge 79+

不支持的浏览器：

- ❌ Internet Explorer
- ❌ 旧版本移动浏览器

### 7. 故障排除清单

- [ ] 浏览器支持 Web Audio API
- [ ] 用户已点击播放按钮（用户交互）
- [ ] 系统音量未静音
- [ ] 浏览器标签页未静音
- [ ] MIDI 文件格式正确
- [ ] 网络连接正常
- [ ] 控制台无错误信息
- [ ] 音频上下文状态为 "running"

### 8. 联系支持

如果按照以上步骤仍无法解决问题，请提供：

1. 浏览器版本和操作系统
2. 控制台的完整错误信息
3. MIDI 文件的详细信息
4. 重现问题的具体步骤

## 总结

MIDI 播放器使用 Tone.js 和 @tonejs/midi 库实现真正的浏览器内 MIDI 播放。通过详细的调试日志，我们可以快速定位问题所在。大多数播放问题都与音频上下文初始化、文件加载或音量设置相关。
