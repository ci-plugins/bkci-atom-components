export default {
    props: {
        name: {
            type: String,
            required: true
        },
        value: {
            type: [String, Array],
            required: true,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        handleChange: {
            type: Function,
            default: () => () => {}
        },
        atomValue: {
            type: Object,
            default: () => ({})
        },
        container: {
            type: Object,
            default: () => ({})
        },
        rule: {
            type: Object,
            default: () => ({})
        },
        component: String,
        required: Boolean,
        hasError: {
            type: Boolean
        },
        hidden: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        value (value, oldValue) {
            value !== oldValue && this.$emit('input', value)
        }
    },
    methods: {
        getResponseData (response, dataPath = 'data.records') {
            try {
                switch (true) {
                    case Array.isArray(response.data):
                        return response.data
                    case Array.isArray(response.data.record):
                        return response.data.record
                    default:
                        const path = dataPath.split('.')
                        let result = response
                        let pos = 0
                        while (path[pos] && result) {
                            const key = path[pos]
                            result = result[key]
                            pos++
                        }
                        if (pos === path.length && Array.isArray(result)) {
                            return result
                        } else {
                            throw Error('获取列表数据失败')
                        }
                }
            } catch (e) {
                console.error('获取列表数据失败', e)
                return []
            }
        },
        getQueryParams(urlStr) {
            let url = ''
            if (typeof urlStr == "undefined") {
                url = decodeURI(location.search)
            } else {
                url = "?" + urlStr.split("?")[1]
            }
            let queryObj = new Object()
            if (url.indexOf("?") != -1) {
                const str = url.substr(1)
                const strs = str.split("&")
                for (let i = 0; i < strs.length; i++) {
                    queryObj[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1])
                }
            }
            return queryObj
        },
        getParams () {
            const queryParams = this.getQueryParams()
            const pathParams = this.$route ? this.$route.params : {}
            return Object.assign({}, queryParams, pathParams)
        }
    }
}
