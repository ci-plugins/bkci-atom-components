<script>

    export default {
        name: 'form-field',
        props: {
            label: {
                type: String,
                default: ''
            },
            inline: {
                type: Boolean,
                default: false
            },
            required: {
                type: Boolean,
                default: false
            },
            isError: {
                type: Boolean,
                default: false
            },
            errorMsg: {
                type: String,
                default: ''
            },
            desc: {
                type: String,
                default: ''
            },
            docsLink: {
                type: String,
                default: ''
            },
            descLink: {
                type: String,
                default: ''
            },
            descLinkText: {
                type: String,
                default: ''
            }
        },
        render (h) {
            const { label, inline, required, $slots, isError, errorMsg, desc, docsLink, descLink, descLinkText } = this
            return (
                <div class={{ 'form-field': true, 'bk-form-item': true, 'bk-form-inline-item': inline, 'is-required': required, 'is-danger': isError }} >
                    { label && <label title={label} class='bk-label atom-form-label'>{label}：
                        { docsLink
                            && <a target="_blank" href={docsLink}><i class="bk-icon icon-question-circle"></i></a>
                        }
                        { label.trim() && desc.trim() && <bk-popover placement="top" class="form-field-icon">
                            <i class="bk-icon icon-info-circle "></i>
                            <div slot="content" style="white-space: pre-wrap; font-size: 12px; max-width: 500px;">
                                <div> {desc} { descLink && <a class="desc-link" target="_blank" href={descLink}>{descLinkText}</a>} </div>
                            </div>
                        </bk-popover>
                        }
                    </label> }
                    
                    <div class='bk-form-content'>
                        {$slots.default}
                        {isError ? $slots.errorTip || <span class='bk-form-help is-danger'>{label + errorMsg}</span> : null}
                    </div>
                </div>
            )
        }
    }
</script>

<style lang="scss">
    .icon-info-circle, .icon-question-circle {
        color: #C3CDD7;
        font-size: 12px;
        vertical-align: middle;
    }
    .form-field.bk-form-item {
        position: relative;
    }
    .form-field-icon {
        position: relative;
        left: 0px;
        top: 0px;
    }
    .bk-sideslider-wrapper .bk-form-item.is-required .bk-label, .bk-form-inline-item.is-required .bk-label {
        margin-right: 10px;
        font-size: 12px;
    }
    .bk-form-inline-item {
        display: flex;
        margin-top: 10px;
        .bk-label {
            width: 120px !important;
            margin-right: 0px !important;
            padding-right: 7px !important;
        }
        .bk-form-content {
            flex-grow: 1;
        }
    }
    .desc-link {
        color: #3c96ff;
    }
    .atom-form-label {
        height: 36px;
        line-height: 36px;
        font-size: 12px;
    }
    .bk-form-help {
        font-size: 12px;
        margin: 4px 0;
    }
    .is-danger {
        color: #ff5656;
    }
</style>
