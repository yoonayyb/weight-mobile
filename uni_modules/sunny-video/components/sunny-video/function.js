/**
 * @description 用于获取用户传递值的px值  如果用户传递了"xxpx"或者"xxrpx"，取出其数值部分，如果是"xxxrpx"还需要用过uni.upx2px进行转换
 * @param {number|string} value 用户传递值的px值
 * @param {boolean} unit 
 * @returns {number|string}
 */
export const getPx = (value, unit = false)=> {
	if (testNumber(value)) {
		return unit ? `${value}px` : Number(value)
	}
	// 如果带有rpx，先取出其数值部分，再转为px值
	if (/(rpx|upx)$/.test(value)) {
		return unit ? `${uni.upx2px(parseInt(value))}px` : Number(uni.upx2px(parseInt(value)))
	}
	return unit ? `${parseInt(value)}px` : parseInt(value)
}
/**
 * @description 添加单位，如果有rpx，upx，%，px等单位结尾或者值为auto，直接返回，否则加上px单位结尾
 * @param {string|number} value 需要添加单位的值
 * @param {string} unit 添加的单位名 比如px
 */
export const addUnit =(value = 'auto', unit = 'px')=> {
	value = String(value)
	// 用uView内置验证规则中的number判断是否为数值
	return testNumber(value) ? `${value}${unit}` : value
}
/**
 * 验证十进制数字
 */
function testNumber(value) {
    return /^[\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(value)
}
/**
 * @description 获取系统信息同步接口
 * @link 获取系统信息同步接口 https://uniapp.dcloud.io/api/system/info?id=getsysteminfosync 
 */
export const sys=()=> {
	return uni.getSystemInfoSync()
}
export const playImgs = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAABQdJREFUeF7tm3uoZ1MUxz/ff/jHIxJSpgjlEcnIe3KZGJMyMUZ5RQY1Qo1CzciMx1BemYgpU0J5jCmvwZDnSMqUvJ+lPGpQGCmM8tWazu/ad8859/c453fn6txVv36/fmfv9fievddae+29xQSQ7eOBPYFpxXf6OzT4Fvim+B79Len1YaunYQiwvRcwCzgZOBHYbkA5vwHPAi8Cb0gKcBqlxgCwvTNwRWHwsY1q+R+z14A3gTslBTi1qREAbF9eGL9PbY16Y/AxcJeklb01r25VCwDb5wBh/BF9KrIJ+KH4RNfdis82ffJZWwAR3wPRQADYPhS4GTilB6kfAC8DzxUGb5D0S1k/2zsBuxdgBO/wIwf3ICNGwsJBpkXfANgOp/YQsMc4ij0OrAvDJX3RgwGVTWwfCJxUfAKQKnoXuEDSJ/3I6wsA2/OAMK6KVgN3SwrjGyfbpwOXASdUMA/HOE9Sz1OiZwBsLwZurBAcBofhAcDQyfZ5wALgyAph83t1kD0BYDvicMT0Mrpa0m1Dt7pEgO3rgBsqZC+RtLSbXl0BsL0CuKSC0WxJL3QTMsznthcCd1TImCnplfHkjwtAEd+XlzD4DjhGUqSvW51snwY8VaHIIZIiEpVSJQC2w9GUofeWpOO2utWZArYjKn1folfkG9MlxUvbgkoBsL1rYfxBWY8fJUXSMimpyCN+LlHuJWCOpD/yZ1UAPABcVMJoX0lfTUrrC6VsHwasL9FxpaT5XQGwHd4+vH5OF0sKYCY92T4TeKJE0Vl5jrDFCKgIeYskLZv0licK2r4GuDXTea2kMdnkGABsx7DP3/I6STP+T8Z3dLUdS+fcYY9JkkYBsL0D8DYQuXdKcycqw2saZNtnAE9mfGMpfXRn4ZQCsAS4Pmu8WtLcphWbSH62A4AAIqXRLDEF4FVgJGs4o87CxvYuwDPAUcAtwCpJ700wADEFYiqkNJrLbAbAdhQp86zuUUln11HWdhh9bcLjzyJtjZJWWbyuI66yr+3HgLOyBntL+roDwLnAw1mD2mHPdoSiCEk5fRZATFRYtR1L6HsyJRZIuq8DwCNAlLdS2oxQnVdiO4qYURKvosg3YjRExWhoZHs/4PNMwNOS5nQA2AhEFOjQekmH19WoBwA6Iu4vgPiyrsyq/rbfz8prv0vaXsWmRbyplJZJWlRXmT4ACFE/BQjF1Pi7ruy8v+3bgauy/0cCgKiuRI0vpZEmdmX6BKAjP2p7MS3CcTVGFS/6/AAg3vRNmaRpTezCDAhAR5WI3+Eo32kCBdv7A3nBdHEAEPPv0kTIJknbNiS0mxPsJuafZFps6NZ4vOcVS+UVAcAaYHbS+VNJB9QR1ulbcwSkKkQ0itFwbx29bP8FpJsvzwcAHwJp4WONpFPrCBoCAB2WD0q6cFDdbEeyF0lfhz4KAH4Fdkz+XC7pykGFpP0aHAEp26j7rxpEP9vhYKcnfTdOATA1Baac4FQYbH0i1PpUOJar7V0MRUy03d7lcAFA6wsirS+JtbsoWkyD9pbFCwDatDGyVFLYy9TWWLZ8be/maFLEKDsR1o7t8cIXtPuARAFCe4/IFAC0+5BUAUJ7j8klDjHuArTzoGQCQnuPynYJjZ3Hk/Ww9Gi2N14Jveth6QSE9h6XT0Bo74WJBIT2XplJQGjvpals8dTOa3O5V23txclsNMTV2UicZgLtujpbMiLad3l6vGRjMl+f/xdJFBaUpeHqagAAAABJRU5ErkJggg=='