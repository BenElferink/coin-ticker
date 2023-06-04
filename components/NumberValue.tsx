const NumberValue = (props: { className?: string; value: number; prefix?: string; suffix?: string }) => {
  const { className = '', value = 0, prefix = '', suffix = '' } = props

  const renderValue = (v: number) => {
    if (v > 999 || v > 999) {
      return Math.round(v).toLocaleString('en')
    } else if (v < 1 && v > -1) {
      const arr = String(v).split('')

      let afterDot = false
      let zeroCount = 0

      for (const char of arr) {
        if (char !== '0' && afterDot) break
        if (char === '0' && afterDot) zeroCount++
        if (char === '.') afterDot = true
      }

      return v.toFixed(zeroCount + 3)
    }

    return v
  }

  return (
    <span className={className}>
      {prefix}
      {renderValue(value)}
      {suffix}
    </span>
  )
}

export default NumberValue
