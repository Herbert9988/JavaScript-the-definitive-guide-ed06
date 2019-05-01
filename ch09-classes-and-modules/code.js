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

// 例8-3
// Define an extend function that copies the properties of its second and
// subsequent arguments onto its first argument.
// We work around an IE bug here: in many versions of IE, the for/in loop
// won't enumerate an enumerable property of o if the prototype of o has
// a nonenumerable property by the same name. This means that properties
// like toString are not handled correctly unless we explicitly check for them.
var extend = (function() {
  // Assign the return value of this function
  // First check for the presence of the bug before patching it.
  for (var p in { toString: null }) {
    // If we get here, then the for/in loop works correctly and we return
    // a simple version of the extend() function
    return function extend(o) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var prop in source) o[prop] = source[prop];
      }
      return o;
    };
  }
  // If we get here, it means that the for/in loop did not enumerate
  // the toString property of the test object. So return a version
  // of the extend() function that explicitly tests for the nonenumerable
  // properties of Object.prototype.
  return function patched_extend(o) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      // Copy all the enumerable properties
      for (var prop in source) o[prop] = source[prop];
      // And now check the special-case properties
      for (var j = 0; j < protoprops.length; j++) {
        prop = protoprops[j];
        if (source.hasOwnProperty(prop)) o[prop] = source[prop];
      }
    }
    return o;
  };
  // This is the list of special-case properties we check for
  var protoprops = [
    "toString",
    "valueOf",
    "constructor",
    "hasOwnProperty",
    "isPrototypeOf",
    "propertyIsEnumerable",
    "toLocaleString"
  ];
})();

/**
 * 一个定义简单类的简单函数
 * @param {*} constructor 定义实例属性的函数
 * @param {*} methods 实例方法：拷贝到原型对象
 * @param {*} statics 类属性： 拷贝到构造函数
 */
function defineClass(constructor, methods, statics) {
  if (methods) extend(constructor.prototype, methods);
  if (statics) extend(constructor, statics);
  return constructor;
}

// 这是我们Range类的一个简单变体
var SimpleRange = defineClass(
  function(f, t) {
    this.f = f;
    this.t = t;
  },
  {
    includes: function(x) {
      return this.f <= x && x <= this.to;
    },
    toString: function() {
      return this.f + "..." + this.to;
    }
  },
  {
    upto: function(t) {
      return new SimpleRange(0, t);
    }
  }
);

// 例 9-3. Complex.js: 一个复数类
/**
 * Complex.js:
 * 这个文件定义一个复数类来表示复数。
 * 回想一下，一个复数是一个实数和一个虚数的和，而虚数i是-1的平方根
 */

/**
 * 这个构造函数为每个它创建的实例对象定义了实例变量r和i。
 * 这两个实例变量保存了复数的实部和虚部：它们是对象的状态。
 */
function Complex(real, imaginary) {
  if (isNaN(real) || isNaN(imaginary)) throw new TypeError();
  this.r = real; // 实部
  this.i = imaginary; // 虚部
}

/**
 * 类的实例方法被定义为原型对象的属性（属性值为函数）。
 * 此处定义的方法可以被所有的实例对象继承，这些方法提供类的共享行为。
 * 注意JavaScript的实例方法必须使用this关键字去访问实例变量。
 */

// 当前复数加上另一个复数，并在一个新对象中返回它们的和
Complex.prototype.add = function(that) {
  return new Complex(this.r + that.r, this.i + that.i);
};

// 当前复数乘以另一个复数，返回它们的乘积
Complex.prototype.mul = function(that) {
  var r = this.r * that.r - this.i * that.i;
  var i = this.r * that.i + this.i * that.r;
  return new Complex(r, i);
};

// 返回复数的模，它定义为原点(0, 0)到复平面的距离
Complex.prototype.mag = function() {
  return Math.sqrt(this.r * this.r + this.i * this.i);
};

// 复数取负
Complex.prototype.neg = function() {
  return new Complex(-this.r, -this.i);
};

// 复数转化为字符串
Complex.prototype.toString = function() {
  return "{" + this.r + "," + this.i + "}";
};

// 测试当前复数和另一个复数是否有相同的值。
Complex.prototype.equals = function(that) {
  return (
    that != null &&
    that.constructor === Complex &&
    this.r === that.r &&
    this.i === that.i
  );
};

/**
 * 类变量（如常量）和类方法被定义为构造函数的属性。
 * 注意类方法通常不使用this关键字：它们仅对其实参进行处理。
 */

// 这里有一些类变量来保存一些预定义的常用实数。
// 它们的名字是全大写的，表明它们是常量。
// （在ES5中，我们实际上可以通过属性描述符，让这些属性只读）
Complex.ZERO = new Complex(0, 0);
Complex.ONE = new Complex(1, 0);
Complex.I = new Complex(0, 1);

// 这个类方法按特定格式（与toString()实例方法返回的字符串格式相同）去解析字符串参数，
// 返回一个新的复数对象，或抛出TypeError。
Complex.parse = function(s) {
  try {
    var m = Complex._format.exec(s);
    return new Complex(parseFloat(m[1]), parseFloat(m[2]));
  } catch (x) {
    throw new TypeError("Can't parse '" + s + "' as a complex number.");
  }
};

// 一个在上面Complex.parse()方法中用到的“私有”类变量。
// 变量名前面的下划线表明它旨在供内部使用，不应被视为这个类公共API的一部分。
Complex._format = /^\{([^,]+),([^}]+)\}$/;

// 使用构造函数创建一个新的对象
var c = new Complex(2, 3);
// 使用c的实例变量
var d = new Complex(c.r, c.i);
// 使用实例方法
c.add(d).toString(); // => {5,5}

// 一个更复杂的表达式，使用了类方法和类变量
Complex.parse(c.toString()) // 把c转换成字符串，再解析成对象
  .add(c.neg()) // 加上c的相反数
  .equals(Complex.ZERO); // =>true: 始终为0

Complex.prototype.toString = function() {
  with (this) {
    return "{" + r + "," + i + "}";
  }
};

// 返回当前复数的共轭复数
Complex.prototype.conj = function() {
  return new Complex(this.r, -this.i);
};

c.conj();

if (!Function.prototype.bind) {
  Function.prototype.bind = function(o /* args */) {
    // ...
  };
}

// 多次调用函数f，传入需要迭代的次数
// 比如，打印3次"hello"
// var n = 3;
// n.times(function(n) {console.log(n + " hello")})
Number.prototype.times = function(f, context) {
  var n = Number(this);
  for (var i = 0; i < n; i++) {
    f.call(context, i);
  }
};

// 定义ES5中的String.trim()方法（如果它不存在）
// 这个方法返回去掉首尾空白的字符串
String.prototype.trim =
  String.prototype.trim ||
  function() {
    if (!this) return this;
    return this.replace(/^\s+|\s+$/g, "");
  };

// 返回函数的名称。如果它有一个name属性（非标准），返回其值。
// 否则，把函数转化为字符串，并从中提取函数名。
// 对于未命名的函数（如这个函数本身），返回空白字符串。
Function.prototype.getName = function() {
  return this.name || this.toString.match(/function\s*([^(]*)\(/)[1];
};

function typeAndValue(x) {
  if (x == null) return ""; // null和undefined没有构造函数
  switch (x.constructor) {
    case Number: // 适用于原型类型
      return "Number: " + x;
    case String:
      return "String: " + x;
    case Date: // 内置类型
      return "Date: " + x;
    case RegExp:
      return "RegExp: " + x;
    case Complex: // 用户定义类型
      return "Complex: " + x;
  }
}

// 例9-4. type()函数用来识别一个值的类型

/**
 * 以字符串返回o的类型。
 *  - 如果o是null，返回"null"，如果o是NaN，返回"nan"
 *  - 如果typeof不是返回"object"，则直接返回这个值
 *  - （注意有些JS实现把RegExp标识为函数）
 *  - 如果classof不是返回"Object"，则直接返回这个值
 *  - 如果o有构造函数，并且构造函数有名称，则返回这个名称
 *  - 否则，返回“Object”
 */
function type(o) {
  var t, c, n; // type, class, name

  // 特殊处理null值
  if (o === null) return "null";

  // 特殊处理NaN值： NaN是唯一不等于自身的值。
  if (o !== o) return "nan";

  // 原始值和函数
  if ((t = typeof o) !== "object") return t;

  // 大部分内置对象
  if ((c = classof(o)) !== "Object") return c;

  // 返回对象的构造函数名称（如果存在）
  if (
    o.constructor &&
    typeof o.constructor === "function" &&
    (n = o.constructor.getName())
  )
    return n;

  // 无法确定更具体的类型
  return "Object";
}

// 返回对象的类
function classof(o) {
  return Object.prototype.toString.call(o).slice(8, -1);
}

// 返回函数的名称（可能为""）或null(非函数)
Function.prototype.getName = function() {
  if ("name" in this) return this.name;
  return (this.name = this.toString().match(/function\s*([^(]*)\(/)[1]);
};

// 没有名称的构造函数
var Complex = function(x, y) {
  this.r = x;
  this.i = y;
};

// 有名称的构造函数
var Range = function Range(f, t) {
  this.from = f;
  this.to = t;
};

var lowercase = new Range("a", "z");
var thisYear = new Range(new Date(2009, 0, 1), new Date(2010, 0, 1));

// 例9-5. 用于鸭式辨型检查的函数

// 如果对象o实现了剩余参数指定的方法，返回true。
function quacks(o /*, ... */) {
  for (var i = 1; i < arguments.length; i++) {
    // 遍历剩余参数
    var arg = arguments[i];

    switch (
      typeof arg // 如果arg是：
    ) {
      case "string": // 字符串： 检查o是否有同名方法
        if (typeof o[arg] !== "fucntion") {
          return false;
        }
        continue;
      case "function": // 函数：使用其原型
        arg = arg.prototype;
      // 通过到下个case
      case "object": // 对象：检查方法匹配
        for (var m in arg) {
          // 逐一检查对象的属性
          if (typeof arg[m] !== "function") continue; // 忽略非方法
          if (typeof o[m] !== "function") return false;
        }
    }
  }

  // 执行到这里，o 通过了所有检查
  return true;
}

// 例9-6. Set.js: 一个值的任意集合
function Set() {
  // 构造函数
  this.values = {}; // 保存集合的属性
  this.n = 0; // 集合元素的个数
  this.add.apply(this, arguments); // 添加所有参数到集合中
}

// 添加每个参数到集合中
Set.prototype.add = function() {
  for (var i = 0; i < arguments.length; i++) {
    var val = arguments[i];
    var str = Set._v2s(val);
    if (!this.values.hasOwnProperty(str)) {
      this.values[str] = val;
      this.n++;
    }
  }
  return this; // 支持方法链调用
};

// 从集合中移除由参数指定的元素
Set.prototype.remove = function() {
  for (var i = 0; i < arguments.length; i++) {
    var val = arguments[i];
    var str = Set._v2s(val);
    if (this.values.hasOwnProperty(str)) {
      delete this.values[str];
      this.n--;
    }
  }
  return this; // 链式调用
};

// 如果集合包含value返回true，否则返回false
Set.prototype.contains = function(value) {
  var str = Set._v2s(value);
  return this.values.hasOwnProperty(str);
};

// 返回集合元素个数
Set.prototype.size = function() {
  return this.n;
};

// 为每个集合元素指定context并调用函数f
Set.prototype.foreach = function(f, context) {
  for (var p in this.values) {
    if (this.values.hasOwnProperty(p)) {
      // 忽略继承的属性
      f.call(context, this.values[p]);
    }
  }
};

// 这个内部函数映射任意JavaScript值为唯一字符串
Set._v2s = function(val) {
  switch (val) {
    case undefined: // 特殊原始值获取单个首字母
      return "u";
    case null:
      return "n";
    case true:
      return "t";
    case false:
      return "f";
    default:
      switch (typeof val) {
        case "number": // 数值加#前缀
          return "#" + val;
        case "string": // 字符串加"前缀
          return '"' + val;
        default:
          // 对象和函数加@前缀
          return "@" + objectId(val);
      }
  }

  // 对任意对象返回一个字符串。这个函数为不同对象返回不同字符串，
  // 并且无论调用多少次，始终为同一个对象返回相同的字符串。
  // 为此它在o上创建了一个属性，在ES5中，这个属性应该是不可枚举和只读的。
  function objectId(o) {
    var prop = "|**objectid**|"; // 私有属性来存储id
    if (!o.hasOwnProperty(prop)) {
      // 如果没有id
      o[prop] = Set._v2s.next++; // 赋下一个可用值
    }
    return o[prop]; // 返回id
  }
};

Set._v2s.next = 100; // 一开始给对象id赋这个初始值

// 例9-7. JavaScript中的枚举类型

// 这个函数创建一个新的枚举类型。参数对象指定这个类每个实例的名称和值。
// 返回值是一个标识新类的构造函数。但是，注意这个构造函数抛出一个异常：
// 你不能使用它创建该类型的新实例。
// 返回的构造函数有名值映射的属性、保存值列表的数组和foreach迭代函数。
function enumeration(nameToValues) {
  // 这是将用作返回值的伪构造函数
  var enumeration = function() {
    throw "Can't Instantiate Enumerations";
  };

  var proto = (enumeration.prototype = {
    constructor: enumeration, // 标识类型
    toString: function() {
      return this.name; // 返回名称
    },
    valueOf: function() {
      return this.value; // 返回值
    },
    toJSON: function() {
      return this.name; // 序列化
    }
  });

  enumeration.values = []; // 保存枚举对象的数组

  // 创建新类型的实例
  for (name in nameToValues) {
    // 对每个值：
    var e = inherit(proto); // 创建代表它的对象
    e.name = name; // 添加name
    e.value = nameToValues[name]; // 添加value
    enumeration[name] = e; // 使它称为构造函数的属性
    enumeration.values.push(e); // 把它保存到数组中
  }

  enumeration.foreach = function(f, c) {
    for (var i = 0; i < this.values.length; i++) {
      f.call(c, this.values[i]);
    }
  };

  // 返回标识新类型的构造函数
  return enumeration;
}

// 创建一个Coin类，拥有4个值Coin.Penny, Coin.Nickel等
var Coin = enumeration({
  Penny: 1,
  Nickel: 5,
  Dime: 10,
  Quarter: 25
});
var c = Coin.Dime; // 这个类的实例
c instanceof Coin; // => true，适用instanceof
c.constructor == Coin; // => true，适用constructor
Coin.Quarter + 3 * Coin.Nickel; // => 40：转化为数值(valueOf方法)
Coin.Dime == 10; // => true：转化为数值
Coin.Dime > Coin.Nickel; // => true：适用关系运算符
String(Coin.Dime) + ":" + Coin.Dime; // => "Dime:10":强制转化成字符串

// 例9-8. 用枚举类型表示卡牌

/**
 * 表示卡牌的类
 * @param {*} suit 花色
 * @param {*} rank 大小
 */
function Card(suit, rank) {
  this.suit = suit;
  this.rank = rank;
}

// 这两个枚举类型定义卡牌的花色和大小
Card.Suit = enumeration({ Clubs: 1, Diamonds: 2, Hearts: 3, Spades: 4 });
Card.Rank = enumeration({
  Two: 2,
  Three: 3,
  Four: 4,
  Five: 5,
  Six: 6,
  Seven: 7,
  Eight: 8,
  Nine: 9,
  Ten: 10,
  Jack: 11,
  Queen: 12,
  King: 13,
  Ace: 14
});

// 卡牌的文本表示
Card.prototype.toString = function() {
  return this.rank.toString() + " of " + this.suit.toString();
};
// 比较两张扑克牌的大小
Card.prototype.compareTo = function(that) {
  if (this.rank < that.rank) return -1;
  if (this.rank > that.rank) return 1;
  return 0;
};

// 给扑克牌排序
Card.orderByBank = function(a, b) {
  return a.compareTo(b);
};

// 给桥牌排序
Card.orderBySuit = function(a, b) {
  if (a.suit < b.suit) return -1;
  if (a.suit > b.suit) return 1;
  if (a.rank < b.rank) return -1;
  if (a.rank > b.rank) return 1;
  return 0;
};

// 定义一个类表示一副标准
function Deck() {
  var cards = (this.cards = []); // 一副卡牌就是一个卡牌数组
  Card.Suit.foreach(function(s) {
    Card.Rank.foreach(function(r) {
      cards.push(new Card(s, r));
    });
  });
}

// 洗牌方法：随机洗牌并返回牌组
Deck.prototype.shuffle = function() {
  var deck = this.cards;
  var len = deck.length;
  for (var i = len - 1; i > 0; i--) {
    var r = Math.floor(Math.random() * (i + 1)); // 随机数
    var temp = deck[i]; // 交换位置
    deck[i] = deck[r];
    deck[r] = temp;
  }
  return this;
};

// 从牌库中抓取n张牌
Deck.prototype.deal = function(n) {
  if (this.cards.length < n) throw "Out of cards";
  return this.cards.splice(this.cards.length - n, n);
};

// 创建一副新牌，洗牌并抓牌
var deck = new Deck().shuffle();
var hand = deck.deal(13).sort(Card.orderBySuit);

// 添加以下方法到 Set 的原型中
extend(Set.prototype, {
  // 集合转换为字符换
  toString: function() {
    var s = "{";
    var i = 0;
    this.foreach(function(v) {
      s += (i++ > 0 ? ", " : "") + v;
    });
    return s + "}";
  },
  // 同toString，但是调用其他值的toLocaleString方法
  toLocaleString: function() {
    var s = "{";
    var i = 0;
    this.foreach(function(v) {
      if (i++ > 0) s += ", ";
      if (v == null) s += v;
      // null & undefined
      else s += v.toLocaleString();
    });
  },
  // 集合转化为值的数组
  toArray: function() {
    var a = [];
    this.foreach(function(v) {
      a.push(v);
    });
    return a;
  }
});

// 转化为JSON字符串时，把Set当作数组处理
Set.prototype.toJSON = Set.prototype.toArray;

// Range类重写了constructor属性，现在加上它
Range.prototype.constructor = Range;

// Range对象不等于任何非Range对象
// 两个Range对象相等当且仅当它们的端点都相等
Range.prototype.equals = function(that) {
  // null && undefined
  if (that == null) return false;
  // 非range对象
  if (that.constructor !== Range) return false;
  // 如果两个端点相等返回true
  return this.from == that.from && this.to == that.to;
};

Set.prototype.equals = function(that) {
  if (this === that) return true;

  // 如果that不是set对象，它不等于this
  // 我们使用instanceof运算符，允许Set的子类
  // 如果我们想要鸭式辨型，可以跳过这个测试
  // 或者我们也可以加强它，检查this.constructor==that.constructor
  // 注意instanceof运算符正好排除了null和undefined值
  if (!(that instanceof Set)) return false;

  // 如果两个set对象的size不同，它们就不相等
  if (this.size() != that.size()) return false;

  // 检查是否this中的每个元素是否都在that对象中
  // 当set对象不相等时，抛出一个异常来跳出foreach循环
  try {
    this.foreach(function(v) {
      if (!that.contains(v)) {
        return false;
      }
    });
    return true; // 所有元素都匹配
  } catch (x) {
    if (x === false) return false; // this中的元素不在that对象中
    throw x; // 其他异常：重新抛出
  }
};

/**
 *
 * @param {*} superclass
 * @param {*} constructor
 * @param {*} methods
 * @param {*} statics
 */
function defineSubclass(superclass, constructor, methods, statics) {}

SingletonSet.prototype.equals = function(that) {
  return that instanceof Set && that.size() == 1 && that.contains(this.member);
};

// ex9-16
// 一个便捷函数，可用于任何抽象方法
function abstractmethod() {
  throw new Error("abstract method");
}

/**
 * AbstractSet类只定义一个抽象方法，contains()
 */
function AbstractSet() {
  throw new Error("Can't instantiate abstract classes");
}
AbstractSet.prototype.contains = abstractmethod;

/**
 * NotSet是AbstractSet的一个实体子类。
 *
 * 这个集合的成员全都不是其他某个集合的成员。
 * 因为它是很具另一个集合定义的，所以它不可写。
 * 又因为它有无限成员，所以它是不可枚举的。
 *
 * 我们唯一能做的是测试某个元素是否是其成员。
 *
 * 注意我们使用了Function.prototype.extend()来定义子类。
 */
var NotSet = AbstractSet.extend(
  function NotSet(set) {
    this.set = set;
  },
  {
    contains: function(x) {
      return !this.set.contains(x);
    },
    toString(x) {
      return "~" + this.set.toString();
    },
    equals: function(that) {
      return that instanceof NotSet && this.set.equals(that.set);
    }
  }
);

/**
 * AbstractEnumerableSet是AbstractSet的抽象子类。
 * 它定义了抽象方法size()和foreach，并在此基础上
 * 实现了具体方法isEmpty()、toArray()、toLocaleString()和 equals()。
 * 实现了contains()、size()和foreach()方法的子类可以无偿获得这五个实体方法。
 */
var AbstractEnumerableSet = AbstractSet.extend(
  function() {
    throw new Error("Can't instantiate abstract classes");
  },
  {
    size: abstractmethod,
    foreach: abstractmethod,
    isEmpty: function() {
      return this.size() == 0;
    },
    toString: function() {
      var s = "{";
      var i = 0;
      this.foreach(function(v) {
        if (i++ > 0) s += ", ";
        s += v;
      });
      return s + "}";
    },
    toLocaleString: function() {
      var s = "{";
      var i = 0;
      this.foreach(function(v) {
        if (i++ > 0) s += ", ";
        if (v == null) s += v;
        else s += v.toLocaleString();
      });
      return s + "}";
    },
    toArray: function() {
      var a = [];
      this.foreach(function(v) {
        a.push(v);
      });
      return a;
    },
    equals: function(that) {
      if (!(that instanceof AbstractEnumerableSet)) return false;
      if (this.size() != that.size()) return false;
      try {
        this.foreach(function(v) {
          if (!that.contains(v)) throw false;
        });
      } catch (x) {
        if (x === false) return false;
        throw x;
      }
    }
  }
);

/**
 * SingletonSet是AbstractEnumerableSet的实体子类。
 * 一个SingletonSet实例是只有一个成员的只读集合。
 */
var SingletonSet = AbstractEnumerableSet.extend(
  function SingletonSet(member) {
    this.member = member;
  },
  {
    contains: function(x) {
      return x === this.member;
    },
    size: function() {
      return 1;
    },
    foreach: function() {
      f.call(this, this.member);
    }
  }
);

/**
 * AbstractWritableSet是AbstractEnumerableSet的抽象子类。
 * 它定义抽象方法add()和remove()，
 * 并在此基础上实现了union(), intersection(), 和 difference()方法。
 */
var AbstractWritableSet = AbstractEnumerableSet.extend(
  function() {
    throw new Error("Can't instantiate abstract classes");
  },
  {
    add: abstractmethod,
    remove: abstractmethod,
    union: function(that) {
      var self = this;
      that.foreach(function(v) {
        self.add(v);
      });
      return this;
    },
    interseciton: function(that) {
      var self = this;
      this.foreach(function(v) {
        if (!that.contains(v)) {
          self.remove(v);
        }
      });
      return this;
    },
    difference: function(that) {
      var self = this;
      that.foreach(function(v) {
        self.remove(v);
      });
      return this;
    }
  }
);

/**
 * ArraySet是AbstractWritableSet的实体子类。
 * 它以值的数组的形式表示集合元素，并为其contains()方法使用数组的线性搜索。
 * 因为contains()方法复杂度是O(n)而不是O(1)，它仅适用于相对较小的集合。
 * 注意以下实现依赖ES5的数组方法indexOf()和forEach()。
 */
var ArraySet = AbstractWritableSet.extend(
  function ArraySet() {
    this.values = [];
    this.add.apply(this, arguments);
  },
  {
    contains: function(v) {
      return this.values.indexOf(v) != -1;
    },
    size: function() {
      return this.values.length;
    },
    foreach: function(f, c) {
      this.values.forEach(f, c);
    },
    add: function() {
      for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (!this.contains(arg)) {
          this.values.push(arg);
        }
      }
      return this;
    },
    remove: function() {
      for (var i = 0; i < arguments.length; i++) {
        var p = this.values.indexOf(arguments[i]);
        if (p == -1) continue;
        this.values.splice(p, 1);
      }
      return this;
    }
  }
);

// example9-17
// 在一个函数中包装我们的代码，以便我们可以在函数作用域内定义变量
(function() {
  // 将objectid定义为所有对象可继承的不可枚举属性。
  // 当读取这个属性时，将调用其getter函数。
  // 它没有setter函数，所以是只读的。
  // 它是不可配置的，所以无法删除。
  Object.defineProperty(Object.prototype, "objectId", {
    get: idGetter, // 获取值的方法
    enumerable: false, // 不可枚举
    configurable: false // 不能删除
  });

  // 这是当读取objectid时，调用的getter函数
  function idGetter() {
    //如果还没有id
    if (!(idprop in this)) {
      // 对象不可扩展
      if (!Object.isExtensible(this)) {
        throw Error("Can't define id fo nonextensible objects");
      }

      // 创建新的id属性
      Object.defineProperty(this, idprop, {
        value: nextid++,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }

    // 返回已有的或新创建的id值
    return this[idprop];
  }

  // 这些变量由idGetter()方法使用并且是这个函数私有的
  var idprop = "|**objectid**|";
  var nextid = 1;
})(); // 调用该包装函数，立即执行这些代码

// example9-18
// 该函数可以使用或不使用 new 关键字：对应构造函数或工厂函数
function Range(from, to) {
  var props = {
    from: {
      value: from,
      enumerable: true,
      writable: false,
      configurable: false
    },
    to: { value: to, enumerable: true, writable: false, configurable: false }
  };

  // 作为构造函数调用
  if (this instanceof Range) {
    Object.defineProperties(this, props);
  } else {
    // 作为工厂函数调用
    return Object.create(Range.prototype, props);
  }
}

// 如果我们以同样的方式为Range.prototype添加属性，
// 我们可以给原型对象的属性设置描述属性。
// 由于我们没有指定enumerable, writable, 和 configurable的值，
// 它们默认都为 false 。
Object.defineProperties(Range.prototype, {
  includes: {
    value: function(x) {
      return this.from <= x && x <= this.to;
    }
  },
  foreach: {
    value: function(f) {
      for (var x = Math.ceil(this.from); x <= this.to; x++) f(x);
    }
  },
  toString: {
    value: function() {
      return "(" + this.from + "..." + this.to + ")";
    }
  }
});

// example 9-19
// 使o中指定的（或全部）属性不可写入并不可配置。
function freezeProps(o) {
  var props =
    arguments.length == 1 // 如果只有1个参数
      ? Object.getOwnPropertyNames(o) // 使用全部属性
      : Array.prototype.splice.call(arguments, 1); // 否则使用指定的属性

  // 让这些属性只读和常驻（不可删除）
  props.forEach(function(n) {
    // 忽略不可配置的属性
    if (!Object.getOwnPropertyDescriptor(o, n).configurable) return;
    Object.defineProperty(o, n, { writable: false, configurable: false });
  });

  // 可以持续使用它（链式调用）
  return o;
}

// 如果o中指定的（或全部）属性可配置，则让其不可枚举。
function hideProps(o) {
  var props =
    arguments.length == 1 // 如果只有1个参数
      ? Object.getOwnPropertyNames(o) // 使用全部属性
      : Array.prototype.splice.call(arguments, 1); // 否则使用指定的属性

  // 从for/in循环中隐藏这些属性
  props.forEach(function(n) {
    if (!Object.getOwnPropertyDescriptor(o, n).configurable) return;
    Object.defineProperty(o, n, { enumerable: false });
  });

  return o;
}

// ex 9-20
// 不可变Range类的构造函数
function Range(from, to) {
  this.from = from;
  this.to = to;
  // 使属性不可变
  freezeProps(this);
}

// 使用不可枚举的属性定义原型
Range.prototype = hideProps({
  constructor: Range,
  includes: function(x) {
    return this.from <= x && x <= this.to;
  },
  foreach: function(f) {
    var x = Math.ceil(this.from);
    for (; x <= this.to; x++) f(x);
  },
  toString: function() {
    return "(" + this.from + "..." + this.to + ")";
  }
});

// ex 9-21
// 这个版本的Range类是可变的，
// 但是封装了它的端点变量以保持：from <= to
function Range(from, to) {
  // 创建时，验证 from <= to
  if (from > to) {
    throw new Error("Range: from must be <= to");
  }

  // 定义访问器方法，保持 from <= to
  function getFrom() {
    return from;
  }
  function getTo() {
    return to;
  }
  function setFrom(f) {
    if (f <= to) from = f;
    else throw new Error("Range: from must be <= to");
  }
  function setTo(t) {
    if (this.from <= t) to = t;
    else throw new Error("Range: to must be >= from");
  }

  // 使用访问器方法创建可枚举，不可配置的属性
  Object.defineProperties(this, {
    from: { get: getFrom, set: setFrom, enumerable: true, configurable: false },
    to: { get: getTo, set: setTo, enumerable: true, configurable: false }
  });
}

// 原型对象与上个例子相比未作任何改变。
// 实例方法可以像普通属性一样读取 from 和 to。
Range.prototype = hideProps({
  constructor: Range,
  includes: function(x) {
    return this.from <= x && x <= this.to;
  },
  foreach: function(f) {
    for (var x = Math.ceil(this.from); x <= this.to; x++) f(x);
  },
  toString: function() {
    return "(" + this.from + "..." + this.to + ")";
  }
});

// ex 9-22
function StringSet() {
  // 创建无原型的对象
  this.set = Object.create(null);
  this.n = 0;
  this.add.apply(this, arguments);
}

// 注意，使用Object.create，我们可以在一次调用中继承超类的原型并定义方法。
// 由于我们不指定任何writable，enumerable和configurable属性，
// 它们全都默认为false。只读方法使这个类变得更难子类化。
StringSet.prototype = Object.create(AbstractWritableSet.prototype, {
  constructor: { value: StringSet },
  contains: {
    value: function(x) {
      return x in this.set;
    }
  },
  size: {
    value: function(x) {
      return this.n;
    }
  },
  foreach: {
    value: function(f, c) {
      Object.keys(this.set).forEach(f, c);
    }
  },
  add: {
    value: function() {
      for (var i = 0; i < arguments.length; i++) {
        if (!(arguments[i] in this.set)) {
          this.set[arguments[i]] = true;
          this.n++;
        }
      }
      return this;
    }
  },
  remove: {
    value: function() {
      for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] in this.set) {
          delete this.set[arguments[i]];
          this.n--;
        }
      }
      return this;
    }
  }
});

// ex 9-23 ECMAScript5 属性工具类(properties utilities)
/**
 * 在Object.prototype中定义一个properties()方法，
 * 它返回一个对象。它表示调用该方法的对象的命名属性。
 * （或表示对象的全部自有属性（无参数调用时））。
 * 返回的对象定义了4个有用的方法：
 * toString(), descriptors(), hide()和freeze()
 */
(function namespace() {
  // 这个函数将成为所有对象的方法
  function properties() {
    var names; // 属性名称的数组

    if (arguments.length == 0) {
      // this的全部属性
      names = Object.getOwnPropertyNames(this);
    } else if (arguments.length == 1 && Array.isArray(arguments[0])) {
      // 数组中的属性名称
      names = arguments[0];
    } else {
      // 参数列表中的属性名称
      names = Array.prototype.splice(arguments, 0);
    }

    // 返回一个Properties对象表示具名的属性
    return new Properties(this, names);
  }

  // 让它成为Object.prototype的一个新的不可枚举的属性。
  // 这是从这个私有的函数作用域中唯一导出的一个值。
  Object.defineProperty(Object.prototype, "properties", {
    value: properties,
    enumerable: false,
    writable: true,
    configurable: true
  });

  /**
   * 这个构造函数由上面的properties()调用。
   * Porperties类表示对象的一组属性。
   * @param {*} o 属性所属的对象
   * @param {*} names 属性的名称列表
   */
  function Properties(o, names) {
    this.o = o;
    this.names = names;
  }

  // 让此对象表示的属性不可枚举
  Properties.prototype.hide = function() {
    var o = this.o;
    var hidden = { enumerable: false };
    this.names.forEach(function(n) {
      if (o.hasOwnProperty(n)) {
        Object.defineProperty(o, n, hidden);
      }
    });
    return this;
  };

  // 让这些属性只读和不可配置
  Properties.prototype.freeze = function() {
    var o = this.o;
    var frozen = { writable: false, configurable: false };
    this.names.forEach(function(n) {
      if (o.hasOwnProperty(n)) {
        Object.defineProperty(o, n, frozen);
      }
    });
    return this;
  };

  // 返回一个对象，它把这些属性的名称映射到对应属性描述符上。
  // 使用以下代码来拷贝属性及其属性描述符：
  //     Object.defineProperty(dest, src.properties.descriptors())
  Properties.prototype.descriptors = function() {
    var o = this;
    var desc = {};
    this.names.forEach(function(n) {
      if (!o.hasOwnProperty) return;
      desc[n] = Object.getOwnPropertyDescriptor(o, n);
    });
    return desc;
  };

  // 返回一个格式良好的属性的列表，列出属性名称，值和属性描述符。
  // 使用术语"permanent"来表述不可配置，readonly表示不可写入，
  // hidden表示不可枚举。
  // 标准的可枚举, 可写入, 可配置属性没有属性描述符列出。
  Properties.prototype.toString = function() {
    var o = this;
    var lines = this.names.map(nameToString);
    return "{\n " + lines.join(",\n ") + "\n}";

    function nameToString(n) {
      var s = "";
      var desc = Object.getOwnPropertyDescriptor(o, n);
      if (!desc) return "nonexistent " + n + ": undefined";
      if (!desc.configurable) s += "permanet ";
      if ((desc.get && !desc.set) || !desc.writable) s += "readonly ";
      if (!desc.enumerable) s += "hidden ";
      if (desc.get || desc.set) s += "accessor " + n;
      else {
        var value = typeof desc.value === "function" ? "function" : desc.value;
        s += n + ":" + value;
      }

      return s;
    }
  };

  // 最后，使用我们上面定义的方法，让上面的原型对象的实例方法不可枚举。
  Properties.prototype.properties().hide();
})(); // 定义完成后立即调用闭包函数

// ex 9-24
// 定义一个全局变量Set并把本函数的返回值赋值给它。
// 西面的括号和函数名称提示函数将在定义后立即调用，并且
// 它是正在赋值的函数的返回值，而不是函数本身。注意这是
// 一个函数表达式，所以函数名"invocation"不会创建全局变量。
var Set = (function invocation() {
  // 这个构造函数是个局部变量
  function Set() {
    this.values = {}; // 这个属性用来保存集合成员
    this.n = 0; // 集合成员的个数
    this.add.apply(this, arguments); // 添加参数到集合中
  }

  // 定义Set.prototype上的实例方法。
  // 为简洁起见，省略一部分实现功能的代码。
  Set.prototype.contains = function(value) {
    // 注意我们调用v2s(), 而不是带笨重前缀的Set._v2s()
    return this.values.hasOwnProperty(v2s(value));
  };
  Set.prototype.size = function() {
    return this.n;
  };
  Set.prototype.add = function() {
    /* ... */
  };
  Set.prototype.remove = function() {
    /* ... */
  };
  Set.prototype.foreach = function(f, context) {
    /* ... */
  };

  // 这些是供上面方法使用的辅助函数和变量。
  // 它们不是模块公共API的一部分，它们被隐藏在函数作用域中。
  // 所以我们无须把它们定义为Set的属性或者给它们加"_"前缀。
  function v2s() {
    /** ... */
  }
  function objectId(o) {
    /** ... */
  }
  var nextId = 1;

  // 这个模块的公共API是Set()构造函数。
  // 我们需要从私有的名称空间中导出那个函数，以便它能被外部使用。
  // 在本例中，我们通过返回构造函数来导出它。
  // 它变成上面第一行的赋值表达式的值。
  return Set;
})(); // 函数定义完成后，立即调用

// 创建一个全局变量来存储所有与collection相关的模块
var collections;
if (!collections) collections = {};

// 定义sets模块
collections.sets = (function namespace() {
  // 定义各种set类，使用局部变量和函数。
  //    ... 省略很多代码 ...

  // 通过返回名称空间对象，导出我们的API
  return {
    // 导出属性名称 : 本地变量名
    AbstractSet: AbstractSet,
    NotSet: NotSet,
    AbstractEnumerableSet: AbstractEnumerableSet,
    SingletonSet: SingletonSet,
    AbstractWritableSet: AbstractWritableSet,
    ArraySet: ArraySet
  };
})();

var collections;
if (!collections) collections = {};
collections.sets = new (function namespace() {
  //    ... 省略很多代码 ...

  // 导出我们的API到this对象
  this.AbstractSet = AbstractSet;
  this.NotSet = NotSet;
  // 还有其他API...

  // 注意这里是构造函数，不要有返回值
})();

var collections;
if (!collections) collections = {};
collections.sets = {};
(function namespace() {
  //   ... 省略很多代码 ...

  // 导出我们的公共API到上面创建的名称空间对象上
  collections.sets.AbstractSet = AbstractSet;
  collections.sets.NotSet = NotSet; // And so on...

  // 不需要return子句，因为导出已经在上面几行代码中完成了。
})();
