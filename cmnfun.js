/**
 * Created by Reid on 2016/11/30.
 */
/**一些基本的函数**/
export function getVal(obj, defaultValue = ""){
    return isEmpty(obj) ? defaultValue : obj
}

export function toInt(o, defaultValue = 0){
    let res = parseInt(o)
    if(isNaN(res)) return defaultValue
    return res
}

export function isEmpty(o){
    if(o === null || o === undefined)
        return true
    switch (typeof o){
        case "boolean":
            return false
        case "object":
            for (let t in o)
                return false
            return true
        case "array":
        case "string":
            return o.length <= 0
        case "number":
            return o.toString().length <= 0
        case "function":
            return false
    }
    return true
}

export function isNum(n){
    return typeof n === "number"
}

export function toPercent(n, precision = 2){
    n = n || 0
    n *= 100
    return n.toFixed(precision) + "%"
}

/**
 * 判断两个变量是否相同
 * @returns {boolean}
 */
export function isEqual(a, b) {
    if(isEmpty(a) && isEmpty(b))
        return true;
    if(isEmpty(a) || isEmpty(b))
        return false;
    switch (typeof a){
        case "object":
            if(count(a) != count(b))
                return false;
            for(let i in a){
                if(!isEqual(a[i], b[i]))
                    return false
            }
            return true;
        default:
            return a === b
    }
}

/**json解析函数**/
export function json_decode(str, default_result = {}){
    let res = default_result
    try{
        res = JSON.parse(str)
    }catch(e){}
    return res
}

export function json_decode_arr(str){
    let res = []
    try{
        res = JSON.parse(str)
    }catch(e){}
    return res
}

/**对象和数组相关的函数**/
/**
 * 深度拷贝, 防止因直接赋值引起的地址相同问题
 * @returns {*}
 */
export function cpy(o){
    let res = {}
    switch(typeof o){
        case "object":
            //判断o是否是react组件对象， 如果是 直接赋值
            if(!isEmpty(o) && o["$$typeof"] === Symbol.for('react.element')) {
                res = o
                break
            }
            if(Object.prototype.toString.call(o) === '[object Array]')
                res = []
            for(let i in o){
                res[i] = cpy(o[i])
            }
            break
        default:
            res = o
            break
    }
    return res
}

/**
 * 获取变量的长度
 * string 获取字符数
 * object 获取其children数量(一级)
 * @param o 输入参数
 * @returns int
 */
export function count(o){
    switch (typeof o){
        case "string":
        case "array":
            return o.length
        case "object":
            let n = 0
            for(let i in o)
                n++
            return n
    }
    return 0
}

/**
 * 判断元素是否在数组中
 * @param obj
 * @param arr
 * @returns {boolean}
 */
export function in_array(obj, arr){
    if(isEmpty(arr))
        return false
    let i = arr.length
    while (i--) {
        if (arr[i] == obj)
            return true
    }
    return false
}

/**
 * 从数组中删除指定的元素
 * @param obj
 * @param arr
 */
export function array_remove(obj, arr){
    for(let i=0; i < arr.length; i++) {
        if(obj == arr[i])
            arr.splice(i,1)
    }
}

export function keyCount(arr, key, val){
    if(isEmpty(arr))
        return 0
    let count = 0
    for(let i in arr){
        if(!isEmpty(arr[i][key]) && arr[i][key] == val)
            count++
    }
    return count
}

export function subArrByKeyEq(arr, key, val){
    let check = item => {
        return !isEmpty(item[key]) && item[key] == val
    }
    return subArrByCheck(arr, check)
}

export function subArrByKeyNeq(arr, key, val){
    let check = item => {
        return isEmpty(item[key]) || item[key] != val
    }
    return subArrByCheck(arr, check)
}

export function subArrByCheck(arr, check){
    let result = []
    for(let i in arr) {
        if (!arr.hasOwnProperty(i))
            continue
        if (check(arr[i])) {
            result.push(arr[i])
        }
    }
    return result
}

export function maxKeyInArr(arr, key){
    let res = ""
    for(let i in arr){
        let item = arr[i]
        if(!isEmpty(item[key])){
            if(isEmpty(res))
                res = item[key]
            else
                res = res < item[key] ? item[key] : res
        }
    }
    return res
}

//根据key值查数据，如果数据存在返回当前条目，如果数据不存在返回空
export function findItemByKey(arr, key, val){
    if(isEmpty(arr))
        return {}
    for(let i in arr){
        if (!arr.hasOwnProperty(i))
            continue
        if(!isEmpty(arr[i][key]) && arr[i][key] == val){
            return arr[i]
        }
    }
    return {}
}

export function getOption(text, options){
    let res = ""
    if(isEmpty(text))
        return res
    for(let key in options){
        if(options.hasOwnProperty(key) && text == options[key]["key"])
            res = options[key]["title"]
    }
    return res
}

export function keyCpyObj(o, keys){
    let res = {}
    for(let i in keys){
        let key = keys[i]
        res[key] = o[key]
    }
    return res
}

/**input focus相关**/
const getInputElements = () => {
    let classobj= []
    let tags=document.getElementsByTagName("*")//获取HTML的所有标签
    for(let i in tags)
        if(tags[i].nodeType === 1 && in_array("ant-input", tags[i].classList))
            classobj.push(tags[i])
    return classobj//返回组成的数组
}

const findIndex = (arr, obj) => {
    for(let i in arr){
        if(arr[i] == obj)
            return i
    }
    return -1
}

export function focusNext(target){
    //获取所有ant-input的标签
    let inputList = getInputElements()
    let i = findIndex(inputList, target)
    let next = parseInt(i)+1
    if(i >= 0 && inputList[next]){
        inputList[next].focus()
    }
}

export function focusModal(index = 1){
    let modals = document.getElementsByClassName("ant-modal-body")
    if(modals.length === 0 || isEmpty(modals)) return
    let last = modals.length - 1
    let tags = modals[last].getElementsByTagName("*")
    let inputList = []
    for(let i in tags){
        if(tags[i].nodeType === 1 && in_array("ant-input", tags[i].classList))
            inputList.push(tags[i])
    }
    if(!isEmpty(inputList))
        inputList[index-1].focus()
}

/**
 * 跟操作者有相关的key
 * @type {[*]}
 */
export const operator_keys = ["create_by","creator_name","create_time","update_by","update_name","update_time"]

const getPanelTitle = (columns, key) => {
    for(let i in columns){
        for(let j in columns[i]){
            let curData = columns[i][j]
            if(curData.key === key)
                return curData.title
        }
    }
    return ""
}

/**
 * checkPanel, 检查DataPanel是否有错
 * @param data, 为传入DataPanel的data
 * @param columns, 为传入DataPanel的columns
 * @param rules, 当只需要检测必填项时, 该参数不需要传. 但该参数也提供了一些其他的校验功能
 * array[object{
 *      key: 要校验的key,
 *      type: [number] 校验类型
 *      pattern: {正则表达式} 校验是否满足正则
 *      validator: function(data) => msg 自定义校验,返回错误信息,校验通过时返回空("")
 *      msg: 当校验出错时, 覆盖默认的返回信息
 * }]
 * @returns {*}
 */
export const checkPanel = (data, columns, rules = false) => {
    data = data || {}
    //检查必填项
    for(let i in columns){
        for(let j in columns[i]){
            let curData = columns[i][j]
            if(curData.key && curData.required && isEmpty(data[curData.key]))
                return curData.msg ? curData.msg : "请输入"+curData.title
        }
    }
    if(!rules)  return ""
    //检查rules
    for(let i in rules){
        let rule = rules[i]
        //如果有key
        if(rule.key){
            let item = data[rule.key]
            if(rule.type){
                switch (rule.type){
                    case "number":
                        if(typeof item !== "number" && !/^[0-9]+$/.test(item))
                            return rule.msg ? rule.msg : getPanelTitle(columns, rule.key) + "必须为数字!"
                    default: break
                }
            }
            if(rule.pattern && !rule.pattern.test(item))
                return rule.msg ? rule.msg : getPanelTitle(columns, rule.key) + "未通过正则校验!"
        }
        if(rule.validator){
            let error_msg = rule.validator(data)
            if(!isEmpty(error_msg)) return error_msg
        }
    }
    return ""
}

export const checkPanels = (data, rules, ...columns_arr) => {
    for(let columns of columns_arr){
        let msg = checkPanel(data, columns, rules)
        if(msg) return msg
    }
    return ""
}

const getTableTitle = (columns, key) => {
    for(let i in columns){
        if(columns[i].key === key)
            return columns[i].title
    }
    return ""
}

/**
 * 检查表格一行数据
 * @param data
 * @param columns
 * @param rules
 * @param rowIndex  //单行调用时一般不传,该值用于传入validator中
 * @returns {*}
 */
export const checkRow = (data, columns, rules = false, rowIndex = "") => {
    for(let i in columns){
        let col = columns[i]
        let item = col.key || col.dataIndex
        if(col.required && item && isEmpty(data[item]))
            return col.msg ? col.msg : "请输入"+col.title
    }
    if(!rules)  return ""
    //检查rules
    for(let i in rules){
        let rule = rules[i]
        //如果有key
        if(rule.key){
            let item = data[rule.key] || data[rule.dataIndex]
            if(rule.type){
                switch (rule.type){
                    case "number":
                        if(typeof item !== "number" && !/^[0-9]+$/.test(item))
                            return rule.msg ? rule.msg : getTableTitle(columns, rule.key) + "必须为数字!"
                    default: break
                }
            }
            if(rule.pattern && !rule.pattern.test(item))
                return rule.msg ? rule.msg : getTableTitle(columns, rule.key) + "未通过正则校验!"
        }
        if(rule.validator){
            let error_msg = rule.validator(data, rowIndex)
            if(!isEmpty(error_msg)) return error_msg
        }
    }
    return ""
}

/**
 * 检查表格多行数据
 * @param list
 * @param columns
 * @param checkRows 要检查的行数(数组),不传或传false表示全部检查,一般用于多选同时编辑的情况,传入modifyRows
 * @param rules
 * @returns {*}
 */
export const checkTable = (list, columns, checkRows = false, rules = false) => {
    if(checkRows){
        for(let i in checkRows){
            let row = checkRows[i]
            let msg = checkRow(list[row], columns, rules)
            if(!isEmpty(msg))
                return  msg
        }
    } else {
        for(let i in list){
            let msg = checkRow(list[i], columns, rules)
            if(!isEmpty(msg))
                return msg
        }
    }
    return ""
}