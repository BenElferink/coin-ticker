import { GREEN, RED } from '@/constants'
import NumberValue from './NumberValue'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'

const ChangeGreenRed = ({ value = 0, prefix = '', suffix = '', invert = false, withCaret = false, scale = 1 }) => {
  const changeColor = value > 0 ? GREEN : value < 0 ? RED : 'unset'
  const invertColor = '#f9f9f9'

  const styles = {
    root: {
      backgroundColor: invert ? changeColor : 'unset',
      color: invert ? invertColor : changeColor,
      fontSize: `${16 * scale}px`,
    },
    icon: {
      width: 14 * scale,
      height: 14 * scale,
      marginRight: `${3 * scale}px`,
    },
  }

  return (
    <span className={(invert ? 'py-1 px-2' : 'p-0') + ' flex items-center rounded-lg'} style={styles.root}>
      {withCaret && value > 0 ? (
        <ChevronUpIcon style={styles.icon} />
      ) : withCaret && value < 0 ? (
        <ChevronDownIcon style={styles.icon} />
      ) : null}

      <NumberValue prefix={prefix} suffix={suffix} value={Number(String(value).replace('-', ''))} />
    </span>
  )
}

export default ChangeGreenRed
