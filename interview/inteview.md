# Interview

## 算法

## 基础知识

## http 机制和原理

## tcp 和 udp 区别

1. TCP 面向连接（如打电话要先拨号建立连接）;UDP 是无连接的，即发送数据之前不需要建立连接
2. TCP 提供可靠的服务。也就是说，通过 TCP 连接传送的数据，无差错，不丢失，不重复，且按序到达;UDP 尽最大努力交付，即不保   证可靠交付
3. TCP 面向字节流，实际上是 TCP 把数据看成一连串无结构的字节流;UDP 是面向报文的
     UDP 没有拥塞控制，因此网络出现拥塞不会使源主机的发送速率降低（对实时应用很有用，如 IP 电话，实时视频会议等）
4. 每一条 TCP 连接只能是点到点的;UDP 支持一对一，一对多，多对一和多对多的交互通信
5. TCP 首部开销 20 字节;UDP 的首部开销小，只有 8 个字节
6. TCP 的逻辑通信信道是全双工的可靠信道，UDP 则是不可靠信道

## 栈和链表的区别

## 缓存机制

[Web 缓存机制系列](http://www.alloyteam.com/2012/03/web-cache-1-web-cache-overview/)

[浏览器缓存](https://github.com/amandakelake/blog/issues/43)

## http 协议

[关于 HTTP 协议，一篇就够了](https://www.jianshu.com/p/80e25cb1d81a)

[TCP 协议详解](https://www.jianshu.com/p/ef892323e68f)

## 继承

## 跨域

[前端常见跨域解决方案（全）](https://segmentfault.com/a/1190000011145364)

## 前端安全

[前端常见的攻击方式及预防方法](https://www.jianshu.com/p/a5ff8a23b423)

[Web 安全之 CSRF 攻击](https://www.cnblogs.com/lovesong/p/5233195.html)

## react 虚拟 dom 和 diff 算法

[react diff 算法浅析](https://blog.csdn.net/qq_26708777/article/details/78107577)

## ES6

[ES2015 简介和基本语法](https://www.jianshu.com/p/220a54f7adce)

## 数组的常见方法

[JavaScript Array 对象](http://www.w3school.com.cn/jsref/jsref_obj_array.asp)

## css 盒模型

## webpack

## promise

[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

## 函数柯里化 currying

[详解 JS 函数柯里化](https://www.jianshu.com/p/2975c25e4d71)

## 性能优化

[雅虎十四条优化原则](https://blog.csdn.net/u010648555/article/details/50721751)

## 事件模型

[js 事件冒泡和事件捕获详解](https://www.cnblogs.com/linxuehan/p/3623760.html)

## 浏览器绘制 html

[网页性能 -- 浏览器的重绘和重排](https://blog.csdn.net/qq_33678670/article/details/80826971)

[前端必读：浏览器内部工作原理](https://www.cnblogs.com/wyaocn/p/5761163.html)

## https

[HTTP 和 HTTPS 的区别，SSL 的握手过程](https://www.cnblogs.com/lmjZone/p/8523010.html)
