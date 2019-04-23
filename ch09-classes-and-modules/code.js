function inherit(p) {
  if (p == null) throw TypeError();

  if (Object.create) {
    return Object.create(p);
  }

  if (typeof p !== "object" && typeof p !== "function") throw TypeError();

  var f = function() {};
  f.prototype = p;
  return new f();
}

// 例9-1：一个简单的JavaScript类
// range.js: 表示值的范围的类。

// 这个一个工厂方法，返回一个新的“范围对象”。
function range(from, to) {
  // 使用inherit()方法来创建对象，这个对象继承自下面定义的原型对象。
  // 原型对象存储在函数的一个属性中，它定义了所有“范围对象”所共享的方法（行为）。
  var r = inherit(range.methods);

  // 存储这个新的范围对象的开始点和结束点（状态）
  // 这两个属性是非继承属性，对每个对象来说，它们都是唯一的
  r.from = from;
  r.to = to;

  // 最后返回这个新创建的对象
  return r;
}

// 这个原型对象定义的方法可以被所有的范围对象继承。
range.methods = {
  // 如果x在范围中返回true，否则返回false
  // 这个方法可适用于数字，文本和日期
  includes: function(x) {
    return this.from <= x && x <= this.to;
  },
  // 依次对范围内的每个整数调用函数f
  // 仅适用于数字范围
  foreach: function(f) {
    var x = Math.ceil(this.from);
    for (; x <= this.to; x++) {
      f(x);
    }
  },
  // 返回表示这个范围的字符串
  toString: function() {
    return "(" + this.from + "..." + this.to + ")";
  }
};

// 下面是一些使用范围对象的例子
var r = range(1, 3); // 创建一个范围对象
r.includes(2);
r.foreach(console.log);
console.log(r);

// 例9-2：使用构造函数的范围类
// range2.js: 另一个表示范围值的类

// 这是一个初始化新Range对象的构造函数
// 注意它不创建也不返回这个对象，仅仅是初始化
function Range(from, to) {
  // 存储这个新的范围对象的开始点和结束点（状态）
  // 这两个属性是非继承属性，对每个对象来说，它们都是唯一的
  this.from = from;
  this.to = to;
}

// 所有的Range对象都继承自该对象
// 注意这里的属性名字必须是"prototype"才能生效。
Range.prototype = {
  // 如果x在范围中返回true，否则返回false
  // 这个方法可适用于数字，文本和日期
  includes: function(x) {
    return this.from <= x && x <= this.to;
  },
  // 依次对范围内的每个整数调用函数f
  // 仅适用于数字范围
  foreach: function(f) {
    for (var x = Math.ceil(this.from); x <= this.to; x++) {
      f(x);
    }
  },
  // 返回表示这个范围的字符串
  toString: function() {
    return "(" + this.from + "..." + this.to + ")";
  }
};

// 下面是一些使用范围对象的例子
var r = new Range(1, 3); // 创建一个范围对象
r.includes(2); // => true: 2 is in the range
r.foreach(console.log); // 打印1 2 3
console.log(r); // 打印(1...3)

r instanceof Range;

var F = function() {}; // 函数对象
var p = F.prototype; // F关联的原型对象
var c = p.constructor; // p关联的函数
// 对任意函数都成立：F.prototype.constructor == F
c === F; // => true

// 扩展预定义的Range.prototype对象，
// 使得我们不会覆盖自动创建的Range.prototype.constructor属性
Range.prototype.includes = function(x) {
  return this.from <= x && x <= this.to;
};
Range.prototype.foreach = function(f) {
  var x = Math.ceil(this.from);
  for (; x <= this.to; x++) f(x);
};
Range.prototype.toString = function() {
  return "(" + this.from + "..." + this.to + ")";
};
