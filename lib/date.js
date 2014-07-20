var moment = require('moment');

module.exports.getDate = function(days, start) {
  var mnt;
  if (start) {
    mnt = moment(start, 'YYYYMMDD');
  } else {
    mnt = moment();
  }
  if (days) {
    mnt = mnt.subtract(days, 'days');
  }
  mnt = mnt.startOf('day');
  return parseInt(mnt.format('YYYYMMDD'));
}