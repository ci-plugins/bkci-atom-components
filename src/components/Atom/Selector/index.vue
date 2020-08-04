<template>
    <bk-select v-bind="dropdownConf"
        :name="name"
        :loading="isLoading"
        :placeholder="isLoading ? &quot;获取数据中...&quot; : placeholder"
        :value="value"
        :disabled="disabled || isLoading"
        @selected="handleSelect"
        @toggle="toggleVisible"
        @clear="handleClear"
        :popover-options="popoverOptions"
    >
        <bk-option
            v-for="item in list"
            :key="item.id"
            :id="item.id"
            :name="item.name"
        >
        </bk-option>
        <template v-if="mergedOptionsConf.hasAddItem">
            <div slot="extension" class="bk-selector-create-item">
                <a :href="addItemUrl" target="_blank">
                    <i class="bk-icon icon-plus-circle" />
                    {{ mergedOptionsConf.itemText }}
                </a>
            </div>
        </template>
    </bk-select>
</template>

<script>
    import mixins from '../mixins'
    export default {
        name: 'selector',
        mixins: [mixins],
        props: {
            placeholder: {
                type: String,
                default: '请选择'
            },
            options: {
                type: Array,
                default: () => ([])
            },
            optionsConf: {
                type: Object,
                default: () => ({})
            }
        },
        data () {
            return {
                isLoading: false,
                list: this.options,
                webUrl: ''
            }
        },
        computed: {
            popoverOptions () {
                return {
                    popperOptions: {
                        modifiers: {
                            preventOverflow: {
                                boundariesElement: 'window'
                            }
                        }
                    }
                }
            },
            mergedOptionsConf () {
                return Object.assign({}, {
                    hasAddItem: false,
                    itemText: '',
                    itemTargetUrl: ``,
                    url: '',
                    paramId: 'id',
                    paramName: 'name',
                    searchable: false,
                    clearable: false,
                    multiple: false
                }, this.optionsConf)
            },
            hasUrl () {
                return this.mergedOptionsConf && this.mergedOptionsConf.url && typeof this.mergedOptionsConf.url === 'string'
            },
            urlParamKeys () {
                if (this.hasUrl) {
                    const paramKey = this.mergedOptionsConf.url.match(/\{(.*?)\}/g)
                    return paramKey ? paramKey.map(key => key.replace(/\{(.*?)\}/, '$1')) : []
                }
                return []
            },
            isLackParam () {
                return this.urlParamKeys.some(key => {
                    return this.queryParams.hasOwnProperty(key) && (typeof this.queryParams[key] === 'undefined' || this.queryParams[key] === null || this.queryParams[key] === '')
                })
            },
            queryParams () {
                const params = this.getParams()
                console.log(params, 4431)
                const { atomValue = {}} = this
                return {
                    ...params,
                    ...atomValue
                }
            },
            dropdownConf () {
                const { searchable, tools, multiple, clearable } = this.mergedOptionsConf
                return {
                    tools,
                    searchable,
                    multiple,
                    clearable
                }
            },
            addItemUrl () {
                const params = this.getParams()
                const { webUrl, urlParse, mergedOptionsConf: { itemTargetUrl } } = this
                const originUrl = /^(http|https):\/\//.test(itemTargetUrl) ? itemTargetUrl : webUrl + itemTargetUrl

                return urlParse(originUrl, params)
            }
        },
        watch: {
            atomValue: {
                deep: true,
                handler: function (params) {
                    // this.freshList()
                }
            },
            options (newOptions) {
                this.list = newOptions
            }
        },
        created () {
            if (this.hasUrl) {
                this.freshList()
            }
        },
        methods: {
            handleSelect (selected, data) {
                this.handleChange(this.name, selected)
            },
            handleClear () {
                const val = this.dropdownConf.multiple ? [] : ''

                this.handleChange(this.name, val)
            },
            toggleVisible (open) {
                open && this.hasUrl && this.freshList()
            },
            urlParse (originUrl, query) {
                /* eslint-disable */
                return new Function('ctx', `return '${originUrl.replace(/\{(.*?)\}/g, '\'\+ ctx.$1 \+\'')}'`)(query)
                /* eslint-enable */
            },
            getUrlParamKey (url) {
                if (this.hasUrl) {
                    const paramKey = url.match(/\{(.*?)\}/g)
                    return paramKey || []
                }
                return []
            },
            transformList (res) {
                const list = this.getResponseData(res, this.mergedOptionsConf.dataPath)
                return list.map(item => {
                    if (typeof item === 'string') {
                        return {
                            id: item,
                            name: item
                        }
                    }
                    return {
                        ...item,
                        id: item[this.mergedOptionsConf.paramId],
                        name: item[this.mergedOptionsConf.paramName]
                    }
                })
            },
            async freshList () {
                if (this.isLackParam) { // 缺少参数时，选择列表置空
                    this.list = []
                    return
                }
                try {
                    const params = this.getParams()
                    const { atomValue = {}, transformList, mergedOptionsConf } = this
                    const changeUrl = this.urlParse(mergedOptionsConf.url, {
                        ...params,
                        ...atomValue
                    })
                    this.isLoading = true

                    const res = await this.$ajax.get(changeUrl)

                    this.list = transformList(res)
                    // 添加无权限查看项
                    const valueArray = mergedOptionsConf.multiple && Array.isArray(this.value) ? this.value : [this.value]
                    const listMap = this.list.reduce((listMap, item) => {
                        listMap[item.id] = item
                        return listMap
                    }, {})

                    valueArray.map(value => {
                        if (typeof value !== 'undefined' && value !== '' && !listMap[value]) {
                            this.list.splice(0, 0, {
                                id: value,
                                name: '******（无权限查看）'
                            })
                        }
                    })

                    this.$emit('change', this.list)
                } catch (e) {
                    this.$bkMessage({
                        message: e.message,
                        theme: 'error'
                    })
                } finally {
                    this.isLoading = false
                }
            }
        }
    }
</script>

<style lang="scss">
    @import '../../../scss/conf.scss';
    
    .bk-form .bk-form-content,
    .form-field.bk-form-item {
        position: static;
    }
    .bk-selector-create-item {
        a {
            display: block;
            color: $fontWeightColor;
        }

        &:hover {
            &, a {
                color: $primaryColor !important;
            }
        }
    }
</style>
