export function colMethod(columnArr, data) {
  let column = {}
  let position = 0

  columnArr.forEach((prop) => {
    column[prop] = []
    //  遍历合并的行数据
    data.forEach((row, rowIndex) => {
      // 第N列第一行
      column[prop][rowIndex] = [1, 1]
      if (rowIndex === 0) {
        // 记录当前行号
        position = 0
      } else if (row[prop] === data[rowIndex - 1][prop]) {
        // 当前行数据等于上一行，根据记录的行号，计算需要合并几行。
        column[prop][position][0] += 1
        // 当前行 隐藏不显示
        column[prop][rowIndex][0] = 0
      } else {
        // 不相等之后，重置记录行号
        position = rowIndex
      }
    })
  })
  return column
}