import { urlJoin } from '@/utils/util'

const atomMixin = {
    props: {
        atomPropsModel: {
            type: Object,
            default: () => ({})
        },
        atomPropsValue: {
            type: Object,
            default: () =>({})
        },
        atomPropsContainerInfo: {
            type: Object,
            default: () =>({})
        },
        disabled: Boolean
    },
    data () {
        return {
            atomValue: {},
            atomModel: {},
            containerInfo: {}
        }
    },
    created () {
        this.atomValue = this.atomPropsValue
        this.atomModel = this.atomPropsModel
        this.containerInfo = this.atomPropsContainerInfo
        window.addEventListener('unload', () => {
            window.parent && window.parent.postMessage({ atomValue: this.atomValue }, '*')
        })
    },
    methods: {
        setAtomIsError (status = false) {
            window.parent && window.parent.postMessage({ isError: status }, '*')
        },
        setAtomValue () {
            window.parent && window.parent.postMessage({ atomValue: this.atomValue }, '*')
        },
        handlePath (path = '', getFileName = false) {
            if (path.startsWith('./')) {
                path = path.slice(2)
            }
            if (path.endsWith('/')) {
                path = path.substring(0, path.length - 1)
            }
            if (getFileName && path) {
                const index = path.lastIndexOf('/')
                path = path.substring(index + 1, path.length) // 文件名
            }
            return path
        },
        isHidden (obj, element) {
            const isHidden = eval(`(${obj.isHidden})`) // eslint-disable-line

            if (typeof isHidden === 'function') {
                return isHidden(element)
            }

            if (typeof obj.hidden === 'boolean') {
                return obj.hidden
            }

            return typeof isHidden === 'boolean' ? isHidden : false
        },
        getPlaceholder (obj, element) {
            if (obj.getPlaceholder) {
                const getPlaceholder = eval(`(${obj.getPlaceholder})`)  // eslint-disable-line
                if (typeof getPlaceholder === 'function') {
                    return getPlaceholder(element)
                }

                return ''
            }
            return obj.placeholder || ''
        },
        getComponentTips (obj, element) {
            const tips = eval(`(${obj.tips})`) // eslint-disable-line
            if (typeof tips === 'function') {
                return tips(element, urlJoin, this.handlePath)
            }

            return {
                visible: false
            }
        },
        rely (obj, element) {
            try {
                const { rely: { expression = [], operation = 'AND' } } = obj
                const cb = item => {
                    const { key, value } = item
                    if (Array.isArray(value)) {
                        return typeof element[key] !== 'undefined' && value.includes(element[key])
                    } else if (Array.isArray(element[key])) {
                        return element[key].includes(value)
                    } else {
                        return element[key] === value
                    }
                }
                switch (operation) {
                    case 'AND':
                        return expression.every(cb)
                    case 'OR':
                        return expression.length > 0 ? expression.some(cb) : true
                    default:
                        return true
                }
            } catch (e) {
                return true
            }
        }
    }
}

export default atomMixin
