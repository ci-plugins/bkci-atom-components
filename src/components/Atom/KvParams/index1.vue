<template>
    <div class="kv-param">
        <ul>
            <template v-if="paramList.length">
                <li class="kv-param-item" v-for="(param, index) in paramList" :key="index">
                    <!-- <form-field :is-error="!isMetadataVar && errors.has(`param-${index}.key`)" :error-msg="errors.first(`param-${index}.key`)">
                        <bk-input
                            :data-vv-scope="`param-${index}`"
                            :disabled="disabled || editValueOnly"
                            :handle-change="(name, value) => handleParamChange(name, value, index)"
                            v-validate.initial="`required|unique:${paramList.map(p => p.key).join(&quot;,&quot;)}|max: 50|${snonVarRule}`"
                            name="key"
                            placeholder="Key"
                            :value="param.key" />
                    </form-field> -->
                    <bk-form class="kv-inline-form" form-type="inline" :label-width="0" :model="param" :ref="`row-${param[settingKey]}`">
                        <bk-form-item
                            :rules="keyRules"
                            :property="settingKey">
                            <bk-input v-model="param[settingKey]" :name="settingKey" :placeholder="keyPlaceholder" :disabled="disabled || editValueOnly" @change="(value) => handleParamChange(settingKey, value, index)"></bk-input>
                        </bk-form-item>
                        <div class="bk-form-item">
                            <bk-input :name="settingValue" :disabled="disabled" :placeholder="valuePlaceholder" :value="param[settingValue]" @change="(value) => handleParamChange(settingValue, value, index)" />
                        </div>
                        <i style="margin-top: 8px" @click.stop.prevent="editParam(index, false)" class="bk-icon icon-minus hover-click " v-if="!disabled && !editValueOnly" />
                    </bk-form>
                </li>
            </template>
            <a class="text-link hover-click" v-if="!disabled && !editValueOnly" @click.stop.prevent="editParam(paramList.length, true)">
                <i class="bk-icon icon-plus-circle" />
                <span>{{ addBtnText }}</span>
            </a>
        </ul>
    </div>
</template>

<script>

    export default {
        name: 'kv-params',
        props: {
            name: {
                type: String,
                default: ''
            },
            value: {
                type: Array,
                default: () => ([])
            },
            // 数组中每一项用作key的字段名称
            settingKey: {
                type: String,
                default: 'key'
            },
            // 数组中每一项用作value的字段名称
            settingValue: {
                type: String,
                default: 'value'
            },
            addBtnText: {
                type: String,
                default: '新增变量'
            },
            keyPlaceholder: {
                type: String,
                default: 'Key'
            },
            valuePlaceholder: {
                type: String,
                default: 'Value'
            },
            disabled: {
                type: Boolean,
                default: false
            },
            // 为true允许数组为空，为false表示至少留一项
            allowNull: {
                type: Boolean,
                default: true
            },
            // 只允许修改值，不允许增减项和修改key
            editValueOnly: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                paramList: [],
                keyRules: [
                    { required: true, message: 'Key不允许为空', trigger: 'blur' }
                ]
            }
        },
        watch: {
            value (val) {
                this.paramList = val
            }
        },
        async created () {
            this.paramList = this.value
        },
        methods: {
            editParam (index, isAdd) {
                if (isAdd) {
                    const param = {
                        key: `param${this.paramList.length + 1}`,
                        value: ''
                    }
                    this.paramList.splice(index + 1, 0, param)
                } else {
                    // 如果不允许数组为空并且是剩余最后一项，则不允许删除
                    if (this.allowNull || this.paramList.length > 1) {
                        this.paramList.splice(index, 1)
                    }
                }
                this.handleChange(this.name, this.paramList)
            },
            handleParamChange (key, value, paramIndex) {
                console.log(key, value, paramIndex, 33355)
                const param = this.paramList[paramIndex]
                if (param) {
                    Object.assign(param, {
                        [key]: value
                    })
                    this.handleChange(this.name, this.paramList)
                }
            },
            handleChange () {
                console.log(333)
            }
        }
    }
</script>

<style lang="scss">
    @import '../../../scss/conf.scss';
    .kv-param {
        .kv-param-item {
            .kv-inline-form {
                width: 100%;
                display: flex;
                .bk-form-item {
                    flex: 1;
                    margin-right: 8px;
                    .bk-form-content {
                        width: 100%;
                    }
                }
            }

        }
        .hover-click {
            cursor: pointer;
            line-height: 32px;
        }
    }
</style>
