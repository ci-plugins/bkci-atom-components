const atomFieldMixin = {
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
        element: {
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

export default atomFieldMixin
