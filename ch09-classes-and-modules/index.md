# Chapter 09: 类和模块

## 概述

如果你对 Java 和 C++这种强类型的面向对象编程比较熟悉，你会发现 JavaScript 中的类和 Java 以及 C++中的类有很大不同。尽管在写法上类似，而且在 JavaScript 中也能“模拟”出很多经典的类的特性，但是最好要理解 JavaScript 中的类和基于原型的继承机制，以及和传统的 Java(包括类似 Java 的语言)的类和基于类的继承机制的不同之处。

定义类是模块开发和重用代码的有效方式之一。

## 9.1 类和原型

在 JavaScript 中，一个类的所有实例对象都从同一个原型对象继承属性。因此，原型对象是类的核心特征。在例 6-1 中定义了 inherit()函数，整个函数返回一个新创建的对象，这个对象继承自某个原型对象。如果定义一个原型对象，然后使用 inherit()创建继承自它的对象，我们就定义了一个 JavaScript 类。通常来说，类的实例还需要进一步初始化，常规做法是定义一个函数来创建并初始化这个新的实例对象。正如例 9-1 所示：它给一个表示值的范围的类定义了原型对象，还定义了一个工厂函数来创建并初始化这个类的新实例对象。

注：_本节中的专有名词 **“范围对象”** 表示通过下例中的 range 函数创建的对象。_

例 9-1：一个简单的 JavaScript 类

    // range.js: 表示值的范围的类。

    // 这是一个工厂方法，返回一个新的范围对象。
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
    var r = range(1, 3);    // 创建一个范围对象
    r.includes(2);          // => true: 2 is in the range
    r.foreach(console.log); // 打印1 2 3
    console.log(r);         // (1...3)

上例的代码定义了一个工厂函数 range()来创建新的范围对象，其中有一些值得注意的事情。首先，我们使用了 range()函数的 range.methods 属性来便捷地存储定义类的原型对象。把原型对象放在这里并没有什么特别的，也不是什么习惯用法。其次，range()函数在每一个范围对象上定义了 from 和 to 属性。这些属性表示每个对象自身独一无二的状态（起始点和结束点），它们是非共享的，也是非继承的。最后，在 range.methods 中定义的共享并可继承的方法都使用了 from 和 to 属性。为了引用它们，我们使用了 this 关键字来指代调用这个方法的对象。我们经常见到，this 的这种用法是类方法的一个基本特征。

## 9.2 类和构造函数

例 9-1 展示了一种定义 JavaScript 类的方法。但是，这不是惯用的方式，因为它没有定义构造函数(constructor)。构造函数是为初始化新创建的对象而设计的函数。使用\$8.2.3 节中描述的关键字 new 来调用构造函数。使用 new 的构造函数调用时会自动创建新对象，因此构造函数本身只需要初始化该新对象的状态。**构造函数调用的关键特性是构造函数的 prototype 属性将被用作新对象的原型**。这意味着从同一个构造函数创建的所有对象都继承自同一个原型对象，并且它们都是同一个类的成员。例 9-2 修改了例 9-1 中的范围类，使用构造函数代替了工厂函数：

例 9-2：使用构造函数的范围类

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
        var x = Math.ceil(this.from)
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
    var r = new Range(1, 3); // 创建一个范围对象
    r.includes(2);           // => true: 2 is in the range
    r.foreach(console.log);  // 打印1 2 3
    console.log(r);          // 打印(1...3)

值得仔细比较例 9-1 和例 9-2，并注意这两种定义类的技术之间的差异。

首先，我们在将它转化为构造函数时把 range()工厂函数重命名为 Range()。这是一种很常见的编码约定：构造函数在某种意义上定义了类，而类的名称以大写字母开头。常规函数和方法的名称以小写字母开头。

其次，调用 Range()构造函数时使用了 new 关键字，而调用 range()工厂函数时则不需要 new 关键字。例 9-1 使用了常规函数调用来创建新的对象(\$8.2.1)，而例 9-2 则使用了构造函数调用(\$8.2.3)。因为使用 new 调用 Range()构造函数，所以它不必调用 inherit()方法或采取任何操作来创建新对象。这个新对象会在调用构造函数之前自动创建，并且可以通过 this 值来访问。Range()构造函数只需要初始化它。构造函数甚至不必返回新创建的对象。构造函数调用自动创建一个新对象，将构造函数作为该对象的方法调用，并返回这个新对象。构造函数调用和常规函数调用是如此的不同，这也是我们在构造函数命名时以大写字母开头的另一个原因。构造函数被编写为使用 new 关键字作为构造函数调用，如果被当作常规函数调用，它们通常将无法正常工作。保持构造函数和常规函数不同的命名约定有助于程序员知道何时使用 new。

例 9-1 和例 9-2 之间的另一个关键区别是原型对象的命名方式。在第一个例子中，原型对象是 range.methods。这种命名很方便，语义化也很好，但是过于随意。在第二个例子中，原型对象是 Range.prototype，这是一个强制的命名。调用 Range()构造函数时，会自动使用 Range.prototype 作为新 Range 对象的原型。

最后，还要注意例 9-1 和例 9-2 的共通之处：两者类方法的定义和调用方式都是相同的。

### 9.2.1 构造函数和类的标识(Class Identity)

正如我们所见，原型对象是一个类最根本的标识：当且仅当两个对象继承自同一个原型对象时，它们才是同一个类的实例。初始化新对象状态的构造函数不能作为类的标识：两个构造函数的 prototype 属性可能指向同一个原型对象。那么这两个构造函数都可以用于创建同一个类的实例。

即使构造函数不像原型那样基本，构造函数也可以作为类的“门面”。最明显的就是，构造函数的名称通常被用作类的名称。比如，我们说 Range()构造函数创建 Range 对象。然而，更基本的是，构造函数和 instanceof 运算符一起使用，可以用来检测一个对象是否属于某个类。假设我们有一个对象 r，想知道它是否是 Range 对象，我们可以这样写：

    // 如果r继承自Range.prototype，返回true
    r instanceof Range

实际上 instanceof 运算符并不会检查 r 是否由 Range 构造函数初始化。它检查它是否继承自 Range.prototype 对象。然而，instanceof 的语法强化了“构造函数作为类的公共标识的用途”的印象。我们将在本章后续再次见到 instanceof 运算符。

### 9.2.2 constructor 属性

在例 9-2 中，我们将 Range.prototype 设置为包含我们类的方法的新对象。尽量将这些方法表达为一个对象直接量(object literal)的属性很方便，但实际上并不需要创建新对象。任何 JavaScript 函数都可以用作构造函数，而构造函数调用需要一个 prototype 属性。因此，每个 JavaScript 函数（ES5 中 Function.bind()方法返回的函数除外）都自动拥有一个 prototype 属性。这个属性的值是一个对象，这个对象只有一个不可枚举的 constructor 属性（\_\_proto\_\_属性除外）。而 constructor 属性的值就是这个函数对象：

    var F = function() {}; // 函数对象
    var p = F.prototype;   // F关联的原型对象
    var c = p.constructor; // p关联的函数
    // 对任意函数都成立：F.prototype.constructor == F
    c === F;               // => true

从上面代码中，可以看到预定义的原型对象及其 constructor 属性。这意味着每个对象一般都会继承一个 constructor 属性，这个属性指向它的构造函数。由于构造函数充当类的公共标识，因此这个 constructor 属性提供了对象的类：

    var o = new F();     // 创建一个F类的对象o
    o.constructor === F; // => true: constructor属性指定类

图 9-1 展示了构造函数，其原型对象，从原型到构造函数的逆向引用(back reference)以及使用构造函数创建实例之间的关系。

![图9-1.构造函数，其原型和实例](imgs/f-0901-constructor-prototype-instance.png "A constructor function, its prototype, and instances")  
_图 9-1.构造函数，其原型和实例_

请注意，图 9-1 使用了我们的 Range()构造函数来作为例子。但是，实际上，例 9-2 中的 Range 类会使用自己的对象覆盖预定义的 Range.prototype 对象。所以 Range 类的实例，正如定义的一样，没有 constructor 属性。我们可以通过向原型对象显式添加一个 constructor 属性来解决这个问题：

    Range.prototype = {
      constructor: Range, // 显示设置逆向引用的构造函数
      includes: function(x) {
        return this.from <= x && x <= this.to;
      },
      foreach: function(f) {
        var x = Math.ceil(this.from);
        for (; x <= this.to; x++) {
          f(x);
        }
      },
      toString: function() {
        return "(" + this.from + "..." + this.to + ")";
      }
    }

另一种常见技术是使用预定义的原型对象及其 constructor 属性，然后一个一个地向其添加方法：

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

## 9.3 JavaScript 中 Java 风格的类
