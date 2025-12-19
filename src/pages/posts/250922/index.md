---
layout: ../../../layouts/MarkdownPostLayout.astro
title: 'VOP学习（三）加入房间与视频创建'
pubDate: '2025-09-22'
author: 'Magicalball'
tags: ['VOP学习']
---



## 功能

当创建房间并成功进入推流以后，便会看到摄像头返回的视频（主动触发），当有其他人进入时会自动将视频窗口加入（被动触发）。

## 创建房间时

创建房间加入并推流成功以后joinRoomFun()，主动触发previewLocalStream()本地流。

```typescript
/**
   * 预览本地流。
   * @param {LocalStreamConfig} config 本地流配置。
   * @returns {Promise<any>} 返回预览结果的Promise。
   */
  previewLocalStream(config: LocalStreamConfig): Promise<APICommonResponse> {
    return control.previewLocalStream(config);
  }
```

## 其他人加入房间时

在用户登录时meettingLogin()，其中在登录成功以后会触发这个方法installEventHandlers()

```typescript
//FHMeeting 所有监听rtc、im事件
  function installEventHandlers() {
  /.../
  }
```

其中是各种事件event的监听，其中：

```typescript
// 远端用户发布了视频
    FHMeeting.on(VOP.EVENT.REMOTE_VIDEO_AVAILABLE, (res) => {
      console.log('【---远端用户发布了视频---】', res)
      const { userId, streamType, stream } = res
      //递增远端流id显示
      if (streamType === 'main') {
        addView(res);
        FHMeeting.startRemoteVideo({
          userId,
          streamType,
          view: userId,
          stream
        })
      } else {
        FHMeeting.startRemoteVideo({
          userId,
          streamType,
          view: 'share_div',
          stream
        })
      }
    })
```

这个事件中我们可以发现，当streamType为true时候触发addView(res);

```typescript
//创建视频窗口盒子
  function addView(data) {
    const { userId, streamType } = data
    let div = document.createElement("div");
    let divattr = document.createAttribute("class");
    divattr.value = "video-view";
    let divattrId = document.createAttribute("id");
    divattrId.value = userId;
    div.setAttributeNode(divattr);
    div.setAttributeNode(divattrId);
    let video_grid = document.querySelector('#video_grid');
    div.onclick = () => getVideoFrameRemo(data)
    video_grid.appendChild(div);
  }
```

哦吼，真相大白了，这里便是被动触发，并可以创建新的视频窗口的地方了。

## 小结

已经熟悉上一节的api流程以后，我们可以通过这个思路找到一些功能的具体实现调用的流程。在这里我初识了一个重要内容——事件(event)，我们将在下一节着重与它相识。

