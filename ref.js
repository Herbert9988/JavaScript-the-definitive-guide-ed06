// 例6-1
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

// 例6-2
function extend(o, base) {
  for (p in base) {
    o[p] = base[p];
  }
  return o;
}
