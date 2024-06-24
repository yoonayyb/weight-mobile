/**
 * 常量
 */

// 图片oss
export const imgUrl = 'https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/'

export const bodyFatClass = [
  { title: '体重', field: 'weight', textUnit: 'kg', numUnit: '' },
  { title: 'BMI', field: 'bmi', textUnit: '', numUnit: '' },
  { title: '体脂率', field: 'bfp', textUnit: '%', numUnit: '%' },
  // { title: '肌肉率', field: 'muscle', textUnit: '%', numUnit: '%' },
  // { title: '肌肉重量', field: 'musclekg', textUnit: 'kg', numUnit: '%' },
  { title: '内脏脂肪', field: 'vfal', textUnit: '', numUnit: '' },
  { title: '水分', field: 'water', textUnit: '%', numUnit: '%' },
  { title: '基础代谢', field: 'bmr', textUnit: 'kcal', numUnit: '' },
  // { title: '骨量', field: 'bone', textUnit: 'kg', numUnit: 'kg' },
  { title: '骨骼肌量', field: 'smkg', textUnit: 'kg', numUnit: 'kg' },
  { title: '蛋白质', field: 'protein', textUnit: '%', numUnit: '%' }
  // { title: '去脂重量', field: 'leanbodymass', textUnit: 'kg', numUnit: '' },
  // { title: '身体年龄', field: 'age', textUnit: '岁', numUnit: '' },
]

export const bodyFatClass1 = [
  { title: '体重', field: 'weight', textUnit: 'kg', numUnit: '' },
  { title: 'BMI', field: 'bmi', textUnit: '', numUnit: '' },
  { title: '体脂率', field: 'bfp', textUnit: '%', numUnit: '%' },
  { title: '内脏脂肪', field: 'vfal', textUnit: '级', numUnit: '' },
  { title: '水分', field: 'water', textUnit: '%', numUnit: '%' },
  { title: '基础代谢', field: 'bmr', textUnit: '', numUnit: '' },
  { title: '骨骼肌量', field: 'smkg', textUnit: 'kg', numUnit: 'kg' },
  { title: '蛋白质', field: 'protein', textUnit: '%', numUnit: '%' },
  { title: '喝水量', field: 'drink', textUnit: '%', numUnit: '%' },
  { title: '空腹血糖', field: 'blood_sugars', textUnit: '%', numUnit: '%' },
  { title: '血压', field: 'blood_pressure', textUnit: '%', numUnit: '%' },
  { title: '尿酮', field: 'urine_ketone', textUnit: '%', numUnit: '%' },
  { title: '腰围', field: 'diary_waist', textUnit: '%', numUnit: '%' },
  { title: '臀围', field: 'diary_hipline', textUnit: '%', numUnit: '%' },
]
export const bodyFatClass2 = [
  { title: '体重', field: 'weight', textUnit: 'kg', numUnit: '' },
  { title: 'BMI', field: 'bmi', textUnit: '', numUnit: '' },
  { title: '体脂率', field: 'bfp', textUnit: '%', numUnit: '%' },
  // { title: '肌肉率', field: 'muscle', textUnit: '%', numUnit: '%' },
  // { title: '肌肉重量', field: 'musclekg', textUnit: 'kg', numUnit: '%' },
   { title: '蛋白质', field: 'protein', textUnit: '%', numUnit: '%' },

  { title: '水分', field: 'water', textUnit: '%', numUnit: '%' },
  { title: '基础代谢', field: 'bmr', textUnit: 'kcal', numUnit: '' },
  // { title: '骨量', field: 'bone', textUnit: 'kg', numUnit: 'kg' },
  { title: '骨骼肌量', field: 'smkg', textUnit: 'kg', numUnit: 'kg' },
   { title: '内脏脂肪', field: 'vfal', textUnit: '', numUnit: '' },
  // { title: '去脂重量', field: 'leanbodymass', textUnit: 'kg', numUnit: '' },
  // { title: '身体年龄', field: 'age', textUnit: '岁', numUnit: '' },
]
export const colorArr = [
  {
    color: '#64bed7',
    text: '偏瘦'
  },
  {
    color: '#79b579',
    text: '正常'
  },
  {
    color: '#edc763',
    text: '超重'
  },
  {
    color: '#f03e4b',
    text: '肥胖'
  }
]

export const colorList = {
  偏瘦: '#64bed7',
  正常: '#79b579',
  超重: '#edc763',
  肥胖: '#f03e4b',
  不足: '#64bed7',
  标准: '#79b579',
  优秀: '#58a458',
  偏低: '#67bed7',
  高: '#edc763',
  偏高: '#ef3e4a',
  未达标: '#ef3e4a',
  达标: '#58a458',
  未成年暂不做参考范围: '#edc763'
}

// 获取页数
export function pageCount(total, limit = 10) {
  return total > 0 ? (total < limit ? 1 : total % limit ? parseInt(total / limit) + 1 : total / limit) : 0
}
