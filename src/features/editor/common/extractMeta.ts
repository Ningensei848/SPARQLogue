import { AtMark, Id } from '~/src/common/types'
import { pattern_default_var } from '~/src/common/util/pattern'
import { isAtMark } from '~/src/common/util/validation'

interface metadataProps {
  at: string
  line: string
  parent_id: Id
  pattern: RegExp
}

export const extractMetadata = (props: metadataProps): AtMark | null => {
  const { at, line, parent_id, pattern } = props
  if (!isAtMark(at)) {
    return null
  }
  // e.g. defaultVariable=hogehoge #[option_name]=foobar  // 単純にsplitできない，key名が不定→片側から地道に処理
  const result_default = pattern_default_var.exec(line.replace(pattern, '') + ' ') // 末尾に空白文字をつける（エラー回避？）

  if (!result_default) {
    // defaultVariableが存在しない場合，処理を終了
    return null
  } else {
    return {
      at: at,
      var_name: result_default[1],
      var_elem: result_default[2], // hogehoge がリスト形式か否かは関知しない
      parent_id: parent_id
    }
  }
}
