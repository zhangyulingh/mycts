// 拆分成省市区
export function splitAddress(address: string): {province: string; city: string; district: string} {
  const arrProCityDist = address.split("省")
  let province = ""
  if (arrProCityDist.length >= 2) {
    province = `${arrProCityDist[0]}省`
  }
  const arrCityDist = arrProCityDist[arrProCityDist.length - 1].split("市")

  if (arrCityDist[arrCityDist.length - 1] === "") arrCityDist.pop()
  const city = `${arrCityDist[0]}市`
  if (arrProCityDist.length < 2) {
    province = city
  }
  const district = arrCityDist[arrCityDist.length - 1]
  return {province, city, district}
}
