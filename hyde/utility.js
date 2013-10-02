
exports.merge_object = function (from, to) {
  if (typeof from === 'undefined')
    return;

  for (var key in from)
    if (from.hasOwnProperty(key))
      if (typeof to[key] === 'undefined')
        to[key] = from[key];
};