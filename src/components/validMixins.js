import { bus } from '@/utils/bus'
const validMixins = {
    props: {
        setParentValidate: Function
    },
    computed: {
        errorFields () {
            return this.errors && Array.isArray(this.errors.items) ? [
                ...this.errors.items
            ] : []
        }
    },
    watch: {
        errorFields (newFields, oldFields) {
            const addFields = newFields.filter(e => !oldFields.find(oe => oe.field === e.field))
            const removeFields = oldFields.filter(e => !newFields.find(ne => ne.field === e.field))
            this.setParentValidate(addFields, removeFields)
        }
    },
    created () {
        bus.$on('validate', () => {
            this.$validator.validateAll()
        })
    }
}

export default validMixins
