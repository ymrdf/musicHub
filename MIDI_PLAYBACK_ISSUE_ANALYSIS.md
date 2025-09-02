# MIDI 播放问题分析

## 问题现象

用户反馈点击播放按钮没有声音，但控制台显示：

- MIDI 文件加载成功（3 个音轨，15 个音符）
- 音符调度成功
- 播放时间从 19 秒开始，而不是从 0 秒开始

## 问题分析

### 1. 时间计算问题

从控制台输出可以看出：

```
Playing note: A44 at time 19.169333333333338
Playing note: C55 at time 19.368552083333338
```

**问题**：音符的播放时间从 19 秒开始，这表明 Tone.js 的 Transport 时间系统存在问题。

**原因**：

- MIDI 文件中的时间是基于 MIDI ticks 的
- Tone.js 的 Transport 使用不同的时间系统
- 时间转换或调度方式不正确

### 2. 可能的解决方案

#### 方案 1：使用相对时间调度

```typescript
// 使用相对时间标记
transportRef.current!.schedule((time) => {
  // 播放音符
}, `+${note.time}`);
```

#### 方案 2：重置 Transport 时间

```typescript
// 在开始播放前重置Transport
transportRef.current.seconds = 0;
transportRef.current.start();
```

#### 方案 3：使用 Part 对象

```typescript
// 使用Tone.Part来调度音符
const part = new Tone.Part((time, note) => {
  synthRef.current.triggerAttackRelease(
    note.name,
    note.duration,
    time,
    note.velocity
  );
}, midiData.tracks[0].notes);
```

### 3. 调试步骤

1. **测试合成器**：

   - 点击"测试"按钮
   - 应该能听到 C4 音符
   - 如果没声音，说明是音频设备问题

2. **检查音频上下文**：

   - 确认音频上下文状态为"running"
   - 检查音量设置

3. **验证 MIDI 解析**：

   - 确认音符数据正确
   - 检查时间值是否合理

4. **测试时间调度**：
   - 使用简单的固定时间测试
   - 逐步增加复杂度

## 修复建议

### 1. 立即修复

添加"测试"按钮来验证合成器是否工作：

```typescript
<button
  onClick={() => {
    if (synthRef.current) {
      synthRef.current.triggerAttackRelease("C4", "4n");
    }
  }}
>
  测试
</button>
```

### 2. 时间调度修复

使用更可靠的时间调度方式：

```typescript
// 方案1：使用Part对象
const part = new Tone.Part((time, note) => {
  synthRef.current.triggerAttackRelease(
    note.name + note.octave,
    note.duration,
    time,
    note.velocity
  );
}, midiData.tracks[0].notes);

part.start(0);

// 方案2：使用相对时间
midiData.tracks.forEach((track) => {
  track.notes.forEach((note) => {
    transportRef.current.schedule((time) => {
      synthRef.current.triggerAttackRelease(
        note.name + note.octave,
        note.duration,
        time,
        note.velocity
      );
    }, `+${note.time}`);
  });
});
```

### 3. 音量问题排查

确保音量设置正确：

```typescript
// 检查音量设置
console.log("Volume:", synthRef.current.volume.value);
console.log("Gain:", Tone.gainToDb(volume));

// 设置合适的音量
synthRef.current.volume.value = Tone.gainToDb(0.5); // 50%音量
```

## 测试计划

### 阶段 1：基础功能测试

1. 点击"测试"按钮验证合成器
2. 检查音频上下文状态
3. 验证音量设置

### 阶段 2：MIDI 播放测试

1. 使用简单的单音符 MIDI 文件
2. 测试时间调度
3. 验证播放控制

### 阶段 3：完整功能测试

1. 测试多音轨 MIDI 文件
2. 验证进度显示
3. 测试播放控制功能

## 预期结果

修复后应该能够：

1. 点击"测试"按钮听到 C4 音符
2. 点击"播放"按钮听到 MIDI 文件中的音符
3. 看到正确的播放进度
4. 控制台显示正确的播放时间（从 0 秒开始）

## 总结

主要问题是 Tone.js 的 Transport 时间系统与 MIDI 文件时间不匹配。通过添加测试按钮和修复时间调度逻辑，应该能够解决播放问题。
