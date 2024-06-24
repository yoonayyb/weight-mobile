import { getDateStr } from './common.js'
// 订单详情状态处理
export const orderStatusText = (status) => {
	if (status === 0) {
		return '待付款'
	} else if (status === 1) {
		return '待发货'
	} else if (status === 2) {
		return '待收货'
	} else if (status === 3) {
		return '已收货'
	} else if (status === 4) {
		return '已完成'
	} else if (status === 10) {
		return '已取消'
	} else if (status === 11) {
		return '退款中'
	} else if (status === 12) {
		return '已退款'
	} else if (status === 12) {
		return '拒绝退款'
	}
}
// 退款详情状态处理
export const refundStatusText = (status) => {
	if (status === 0) {
		return '待审核'
	} else if (status === 1) {
		return '已退款'
	} else if (status === 2) {
		return '已驳回'
	} else if (status === 3) {
		return '待退货'
	} else if (status === 4) {
		return '退款中'
	} else if (status === 5) {
		return '已关闭'
	}
}
export function formatChatTime(chatTime) {
	if (!chatTime) return ''
	const newDate = chatTime.replace(/-/g, '/')
	const MINUTE_MS = 60 * 1000;
	const HOUR_MS = 60 * MINUTE_MS;
	const DAY_MS = 24 * HOUR_MS;
	const WEEK_MS = 7 * DAY_MS;
	const YEAR_MS = 365 * DAY_MS;

	const now = new Date();
	const diffMs = now - new Date(newDate);

	if (diffMs < MINUTE_MS) {
		return '刚刚';
	} else if (diffMs < HOUR_MS) {
		const diffMins = Math.floor(diffMs / MINUTE_MS);
		return `${diffMins}分钟前`;
	} else if (diffMs < DAY_MS) {
		const diffHours = Math.floor(diffMs / HOUR_MS);
		return `${diffHours}小时前`;
	} else if (diffMs < WEEK_MS) {
		const diffDays = Math.floor(diffMs / DAY_MS);
		return `${diffDays}天前`;
	} else if (diffMs < YEAR_MS) {
		const diffWeeks = Math.floor(diffMs / WEEK_MS);
		return `${diffWeeks}周前`;
	} else {
		const diffYears = Math.floor(diffMs / YEAR_MS);
		return `${diffYears}年前`;
	}
}
// 处理话题中的时间显示
export const formatTopicTime = (date) => {
	if (!date) return ''
	const newDate = date.replace(/-/g, '/')
	const time = new Date(newDate)
	const timestamp = time.getTime() / 1000
	const _time = new Date()
	const _timestamp = _time.getTime() / 1000
	const m_diff = _timestamp / 60 - timestamp / 60
	if (m_diff < 60) {
		let current = m_diff.toFixed(0) == true ? m_diff.toFixed(0) : 1
		return current + '分钟前'
	} else if (m_diff < 1440) {
		const h_diff = _timestamp / 60 / 60 - timestamp / 60 / 60
		let current = h_diff.toFixed(0) == true ? h_diff.toFixed(0) : 1
		return current + '小时前'
	} else {
		return date
	}
}
// 去掉日期的时分秒
export const removeDateHMS = (date) => {
	date = date.replace(/\-/g, '-')
	return date.substring(0, date.length - 9)
}
// 如果传入时间戳 则转化为年月日时分秒，如果传年月日时分秒则判断是否昨天今天
export const formatDate = (timeStamp) => {

	if (!timeStamp) return ''

	function add0(m) {
		return m < 10 ? '0' + m : m
	}
	if (typeof timeStamp === 'number') {
		if (timeStamp.toString()
			.length < 13) {
			timeStamp = timeStamp * 1000
		}
		var time = new Date(timeStamp)
	} else {
		timeStamp = timeStamp.replace(/-/g, '/')
		var time = new Date(timeStamp)
	}

	const y = time.getFullYear()
	const m = time.getMonth() + 1
	const d = time.getDate()
	const h = time.getHours()
	const mm = time.getMinutes()
	const s = time.getSeconds()
	const toDay = getDateStr(0)
	const yesterday = getDateStr(-1)
	const theDayBeforeYesterday = getDateStr(-2)
	if (toDay === y + '-' + add0(m) + '-' + add0(d)) {
		return '今天' + add0(h) + ':' + add0(mm)
	} else if (yesterday === y + '-' + add0(m) + '-' + add0(d)) {
		return '昨天' + add0(h) + ':' + add0(mm)
	} else if (theDayBeforeYesterday === y + '-' + add0(m) + '-' + add0(d)) {
		return '前天' + add0(h) + ':' + add0(mm)
	} else {
		return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s)
	}
}
// 如果传入时间戳 则转化为年月日时分秒，如果传年月日时分秒则判断是否昨天今天
export const msgFormatDate = (timeStamp) => {

	if (!timeStamp) return ''

	function add0(m) {
		return m < 10 ? '0' + m : m
	}
	if (typeof timeStamp === 'number') {
		if (timeStamp.toString()
			.length < 13) {
			timeStamp = timeStamp * 1000
		}
		var time = new Date(timeStamp)
	} else {
		timeStamp = timeStamp.replace(/-/g, '/')
		var time = new Date(timeStamp)
	}

	const y = time.getFullYear()
	const m = time.getMonth() + 1
	const d = time.getDate()
	const h = time.getHours()
	const mm = time.getMinutes()
	const s = time.getSeconds()
	const toDay = getDateStr(0)
	const yesterday = getDateStr(-1)
	const theDayBeforeYesterday = getDateStr(-2)
	if (toDay === y + '-' + add0(m) + '-' + add0(d)) {
		return '今天' + add0(h) + ':' + add0(mm)
	} else if (yesterday === y + '-' + add0(m) + '-' + add0(d)) {
		return '昨天' + add0(h) + ':' + add0(mm)
	} else if (theDayBeforeYesterday === y + '-' + add0(m) + '-' + add0(d)) {
		return '前天' + add0(h) + ':' + add0(mm)
	} else {
		return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm)
	}
}
// 时间 
export const showTimePipe = (unix_stamp) => {
	if (!unix_stamp) return ''
	if (typeof unix_stamp === 'number') {
		if (unix_stamp.toString()
			.length < 13) {
			unix_stamp = unix_stamp * 1000
		}
		unix_stamp = new Date(unix_stamp)
	} else {
		unix_stamp = unix_stamp.replace(/-/g, '/')
		unix_stamp = new Date(unix_stamp)
	}
	var _today_obj = new Date(),
		_today_date = {
			y: _today_obj.getFullYear(),
			m: (_today_obj.getMonth() + 1 < 10 ? '0' + (_today_obj.getMonth() - -1) : (_today_obj.getMonth() - -1)),
			d: (_today_obj.getDate() < 10 ? '0' + _today_obj.getDate() : _today_obj.getDate())
		}

	var _today_stamp = Date.parse(_today_date.y + '/' + _today_date.m + '/' + _today_date.d + ' 00:00:00')

	var stamp = []
	stamp[0] = _today_stamp + 86400000
	stamp[1] = _today_stamp
	stamp[2] = _today_stamp - 86400000
	stamp[3] = _today_stamp - 172800000

	stamp[4] = _today_stamp - 518400000 // 7天

	stamp[5] = _today_stamp - 31536000000 // 365天

	var _compare_obj = new Date()
	_compare_obj.setTime(unix_stamp)

	var return_str

	if (unix_stamp >= stamp[1] && unix_stamp < stamp[0]) {
		return_str = _compare_obj.getHours() + ':' + (_compare_obj.getMinutes() < 10 ? '0' + _compare_obj
			.getMinutes() : _compare_obj.getMinutes())
	} else if (unix_stamp >= stamp[2] && unix_stamp < stamp[1]) {
		var yesterdayText = '昨天'
		return_str = yesterdayText + ' ' + _compare_obj.getHours() + ':' +
			(_compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes())
	} else if (unix_stamp >= stamp[3] && unix_stamp < stamp[2]) {
		var theDayBeforeYesterdayText = '前天'
		return_str = theDayBeforeYesterdayText + ' ' + _compare_obj.getHours() + ':' +
			(_compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes())

	} else if (unix_stamp >= stamp[4] && unix_stamp < stamp[3]) { // 7天内
		var daynames = ['天', '一', '二', '三', '四', '五', '六']
		var dathStr = '星期' + daynames[_compare_obj.getDay()]

		var SundayText = '星期天'
		var MondayText = '星期一'
		var TuesdayText = '星期二'
		var WednesdayText = '星期三'
		var ThursdayText = '星期四'
		var FridayText = '星期五'
		var SaturdayText = '星期六'

		var dathStr2

		switch (dathStr) {
			case '星期天':
				dathStr2 = SundayText
				break
			case '星期一':
				dathStr2 = MondayText
				break
			case '星期二':
				dathStr2 = TuesdayText
				break
			case '星期三':
				dathStr2 = WednesdayText
				break
			case '星期四':
				dathStr2 = ThursdayText
				break
			case '星期五':
				dathStr2 = FridayText
				break
			case '星期六':
				dathStr2 = SaturdayText
				break
			default:
				dathStr2 = dathStr
				break
		}

		return_str = dathStr2 + ' ' + _compare_obj.getHours() + ':' +
			(_compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes())
	} else if (unix_stamp >= stamp[5] && unix_stamp < stamp[4]) { // 365天内
		var monthText = '月'
		var dayText = '日'
		return_str = (_compare_obj.getMonth() - (-1)) + monthText + _compare_obj.getDate() + dayText + ' ' +
			_compare_obj.getHours() + ':' + (_compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() :
				_compare_obj.getMinutes())

	} else {
		var yearText = '年'
		var monthText = '月'
		var dayText = '日'
		return_str = _compare_obj.getFullYear() + yearText + (_compare_obj.getMonth() - (-1)) +
			monthText + _compare_obj.getDate() + dayText + ' ' + _compare_obj.getHours() + ':' +
			(_compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes())
	}
	return return_str

}

// 过滤小数点前面
export const dotFront = (str) => {
	if (str === undefined || str === null || str === '') {
		return ''
	}
	str = str + ''
	let tempStr = str.split('.')
	if (tempStr[0]) {
		return tempStr[0]
	} else {
		return ''
	}
}
// 过滤小数点后面
export const dotRear = (str) => {
	if (str === undefined || str === null || str === '') {
		return ''
	}
	str = str + ''
	let tempStr = str.split('.')
	if (tempStr[1]) {
		return '.' + tempStr[1]
	} else {
		return ''
	}
}
// 过滤小数点后面
export const totalFormat = (num) => {
	const total = Number(num)
	if (total >= 10000) {
		return (total / 10000)
			.toFixed(2) + 'w'
	} else if (total >= 0) {
		return total
	} else {
		return ''
	}
}

export const formatWeight = (num) => {
	if (num) {
		return Math.abs(num)
	} else {
		return 0
	}
}

export const dotFrontAndRemoveReduce = (str) => {
	if (str === undefined || str === null || str === '') return ''
	str = str + ''
	let tempStr = str.split('.')
	if (tempStr[0]) {
		// 如果是负数，则去掉'-'
		if (tempStr[0].indexOf('-') !== -1) {
			tempStr[0] = tempStr[0].substr(1)
		}
		return tempStr[0]
	} else {
		return ''
	}
}
export const weekDay = function(time) {
	let datelist = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
	return datelist[new Date(time)
		.getDay()]
}
export const duringDay = function(start, end) {
	let startTime = new Date(start)
		.getTime()
	let endTime = new Date(end)
		.getTime()
	const differTime = endTime - startTime
	return (differTime / (1000 * 3600 * 24))
		.toFixed(0) + '天'
}
export const formatDate1 = (timeStamp) => {
	if (!timeStamp) return ''

	timeStamp = timeStamp.replace(/\-/g, '/')
	let time = new Date(timeStamp)

	function add0(m) {
		return m < 10 ? '0' + m : m
	}

	const y = time.getFullYear()
	const m = time.getMonth() + 1
	const d = time.getDate()
	const h = time.getHours()
	const mm = time.getMinutes()
	const s = time.getSeconds()

	return y + '-' + add0(m) + '-' + add0(d)
}
export const formatDate2 = (timeStamp) => {
	if (!timeStamp) return ''
	let time = ''
	if (timeStamp.toString()
		.length < 13) {
		timeStamp = timeStamp * 1000
		time = new Date(timeStamp)
	} else {
		time = timeStamp
	}

	function add0(m) {
		return m < 10 ? '0' + m : m
	}

	const y = time.getFullYear()
	const m = time.getMonth() + 1
	const d = time.getDate()
	const h = time.getHours()
	const mm = time.getMinutes()
	const s = time.getSeconds()

	return add0(m) + '-' + add0(d)
}
export const formatTime1 = (timeStamp) => {

	if (!timeStamp) return ''
	timeStamp = timeStamp.replace(/\-/g, '/');
	console.log('[ timeStamp ]-218', timeStamp)
	let time = ''
	time = new Date(timeStamp)

	function add0(m) {
		return m < 10 ? '0' + m : m
	}
	const h = time.getHours()
	const mm = time.getMinutes()
	// console.log(add0(h) + ':' + add0(mm))
	return add0(h) + ':' + add0(mm)
}
export const formatTime3 = (timeStamp) => {

	return formatTime2(timeStamp) + ' ' + formatTime1(timeStamp)
}
export const formatTime4 = (timeStamp) => {
	if (!timeStamp) return ''

	timeStamp = timeStamp.replace(/\-/g, '/')
	let time = new Date(timeStamp)

	function add0(m) {
		return m < 10 ? '0' + m : m
	}

	const y = time.getFullYear()
	const m = time.getMonth() + 1
	const d = time.getDate()
	const h = time.getHours()
	const mm = time.getMinutes()
	const s = time.getSeconds()

	return add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm)
}
export const formatTime2 = (timeStamp) => {
	if (!timeStamp) return ''
	timeStamp = timeStamp.replace(/\-/g, '/');
	let time = ''
	time = new Date(timeStamp)

	function add0(m) {
		return m < 10 ? '0' + m : m
	}
	const y = time.getFullYear()
	const m = time.getMonth() + 1
	const d = time.getDate()
	return `${y}-${add0(m)}-${add0(d)}`
}
export const timeship = (timeStamp) => {
	if (!timeStamp) return ''
	let time = ''
	if (timeStamp.toString()
		.length < 13) {
		timeStamp = timeStamp * 1000
		time = new Date(timeStamp)
	} else {
		time = timeStamp
	}

	function add0(m) {
		return m < 10 ? '0' + m : m
	}
	const h = time.getHours()
	const mm = time.getMinutes()

	return add0(h) + ':' + add0(mm)
}
//去掉多余的0
export const filterNum = (value) => {
	let val = parseFloat(Number(value)
		.toFixed(2)) || '--'
	return val;
}
//只取整数
export const filterNumParseInt = (value) => {
	let val = parseInt(Number(value)) || '--'
	return val;
}
//只要 时分秒
export const formatTimeHHMMSS = (timeStamp) => {
	if (!timeStamp) return ''
	timeStamp = timeStamp.replace(/\-/g, '/');
	let time = ''
	time = new Date(timeStamp)

	function add0(m) {
		return m < 10 ? '0' + m : m
	}
	const h = time.getHours()
	const mm = time.getMinutes()
	const s = time.getSeconds()
	return `${add0(h)}:${add0(mm)}:${add0(s)}`
}