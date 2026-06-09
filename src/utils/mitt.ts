// https://www.npmjs.com/package/mitt
import mitt, { Emitter } from "mitt"
import {MittType} from "@/types/mitt";

// 类型
const bus: Emitter<MittType> = mitt<MittType>()

// 导出
export default bus
